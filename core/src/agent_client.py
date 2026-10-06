from __future__ import annotations

import json
import os
import threading
import time
from typing import Callable, Optional
from urllib import error, request

# Turn = Tutor + (optional) Compliance retry + Evaluator on the agent side, each a Gemini round-trip.
_DEFAULT_TURN_TIMEOUT = 45.0
_OPEN_TIMEOUT = 5.0
_COMPLETE_TIMEOUT = 10.0
_SLOW_THRESHOLD = 3.0       # seconds before on_slow fires (same as BrainManager)
_DEFAULT_COOLDOWN = 60.0    # seconds to skip the agent after it looks unreachable


class AgentError(Exception):
    """The agent could not serve the request — caller should fall back to the local brain."""

    def __init__(self, message: str, status: Optional[int] = None):
        super().__init__(message)
        self.status = status


class AgentClient:
    """
    HTTP client for the Lery Agent service (agent/, POST /v1/sessions, /v1/turns, ...).

    The agent owns the conversation: it keeps the chat history, evaluates the turn
    and persists the InteractionLog through the API. So the Pi must NOT also write
    logs for a session that runs on the agent.

    Failures raise AgentError. Network-level failures (timeout, refused, 5xx) also
    start a cooldown during which every call fails fast — otherwise an agent on a
    sleeping laptop would add a full timeout to every session start.
    """

    def __init__(
        self,
        base_url: str,
        turn_timeout: float = _DEFAULT_TURN_TIMEOUT,
        cooldown: float = _DEFAULT_COOLDOWN,
        clock: Callable[[], float] = time.monotonic,
    ):
        self.base_url = base_url.rstrip('/')
        self._turn_timeout = turn_timeout
        self._cooldown = cooldown
        self._clock = clock
        self._down_until = 0.0

    # ── HTTP ──────────────────────────────────────────────────────────────────

    def _request(self, method: str, path: str, body: Optional[dict], timeout: float) -> dict:
        if self._clock() < self._down_until:
            raise AgentError('agent unreachable — cooling down')

        data = json.dumps(body).encode() if body is not None else None
        req = request.Request(
            f'{self.base_url}{path}',
            data=data,
            headers={'Content-Type': 'application/json'},
            method=method,
        )
        try:
            with request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode())
        except error.HTTPError as e:
            detail = e.read().decode(errors='replace')[:200]
            if e.code >= 500:
                self._mark_down()
            raise AgentError(f'{method} {path} → HTTP {e.code}: {detail}', status=e.code) from e
        except (error.URLError, OSError) as e:
            self._mark_down()
            raise AgentError(f'{method} {path} → network error: {getattr(e, "reason", e)}') from e
        except ValueError as e:
            raise AgentError(f'{method} {path} → invalid JSON response') from e

    def _mark_down(self) -> None:
        self._down_until = self._clock() + self._cooldown

    # ── Public API ────────────────────────────────────────────────────────────

    def open_session(self, mode: str) -> str:
        """POST /v1/sessions → agentSessionId. mode: FREE_TALK | GUIDED_LESSON."""
        result = self._request('POST', '/v1/sessions', {'mode': mode}, _OPEN_TIMEOUT)
        session_id = result.get('agentSessionId')
        if not session_id:
            raise AgentError('POST /v1/sessions → response without agentSessionId')
        print(f'[Agent] Session opened — id={session_id}, mode={mode}, level={result.get("level")}')
        return session_id

    def turn(
        self,
        agent_session_id: str,
        user_text: str,
        evaluate: Optional[bool] = None,
        on_slow: Optional[Callable[[], None]] = None,
    ) -> dict:
        """
        POST /v1/turns → { reply, evaluation, logId, ... }.
        evaluate=None lets the agent decide (it evaluates GUIDED_LESSON turns).
        on_slow fires once if the agent takes longer than _SLOW_THRESHOLD.
        """
        body: dict = {'agentSessionId': agent_session_id, 'userText': user_text}
        if evaluate is not None:
            body['evaluate'] = evaluate

        timer = None
        if on_slow:
            timer = threading.Timer(_SLOW_THRESHOLD, on_slow)
            timer.start()
        try:
            result = self._request('POST', '/v1/turns', body, self._turn_timeout)
        finally:
            if timer:
                timer.cancel()

        if not isinstance(result.get('reply'), str) or not result['reply'].strip():
            raise AgentError('POST /v1/turns → empty reply')
        return result

    def complete_session(self, agent_session_id: str) -> Optional[dict]:
        """PATCH /v1/sessions/:id/complete. Best-effort — never raises."""
        try:
            result = self._request(
                'PATCH', f'/v1/sessions/{agent_session_id}/complete', {}, _COMPLETE_TIMEOUT
            )
        except AgentError as e:
            print(f'[Agent] complete_session failed: {e}')
            return None
        print(
            f'[Agent] Session completed — finalScore={result.get("finalScore")}, '
            f'progressStatus={result.get("progressStatus")}'
        )
        return result


def create_agent_client() -> Optional[AgentClient]:
    """
    Factory reading LERY_AGENT_URL (+ optional LERY_AGENT_TIMEOUT, LERY_AGENT_COOLDOWN).
    Returns None when the URL is unset — the core then uses its local BrainManager only.
    """
    url = os.getenv('LERY_AGENT_URL')
    if not url:
        return None

    try:
        timeout = float(os.getenv('LERY_AGENT_TIMEOUT', _DEFAULT_TURN_TIMEOUT))
        cooldown = float(os.getenv('LERY_AGENT_COOLDOWN', _DEFAULT_COOLDOWN))
    except ValueError:
        print('[Agent] Invalid LERY_AGENT_TIMEOUT / LERY_AGENT_COOLDOWN — using defaults')
        timeout, cooldown = _DEFAULT_TURN_TIMEOUT, _DEFAULT_COOLDOWN

    print(f'[Agent] Using agent at {url} (local BrainManager as fallback)')
    return AgentClient(url, turn_timeout=timeout, cooldown=cooldown)

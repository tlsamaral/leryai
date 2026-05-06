import json
import os
from typing import Optional
from urllib import request, error


class ApiClient:
    """
    HTTP client for the Lery AI API IoT endpoints (/core/).
    All methods return None on failure — the Pi must never crash due to API issues.
    Timeout: 5s per request (keeps FSM responsive).
    """

    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url.rstrip('/')
        self._headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        }

    def _get(self, path: str) -> Optional[dict]:
        url = f'{self.base_url}{path}'
        req = request.Request(url, headers=self._headers, method='GET')
        try:
            with request.urlopen(req, timeout=5) as resp:
                return json.loads(resp.read().decode())
        except error.HTTPError as e:
            print(f'[ApiClient] GET {path} → HTTP {e.code}: {e.read().decode()}')
        except error.URLError as e:
            print(f'[ApiClient] GET {path} → network error: {e.reason}')
        except Exception as e:
            print(f'[ApiClient] GET {path} → unexpected error: {e}')
        return None

    def _post(self, path: str, body: dict) -> Optional[dict]:
        url = f'{self.base_url}{path}'
        data = json.dumps(body).encode()
        req = request.Request(url, data=data, headers=self._headers, method='POST')
        try:
            with request.urlopen(req, timeout=5) as resp:
                return json.loads(resp.read().decode())
        except error.HTTPError as e:
            print(f'[ApiClient] POST {path} → HTTP {e.code}: {e.read().decode()}')
        except error.URLError as e:
            print(f'[ApiClient] POST {path} → network error: {e.reason}')
        except Exception as e:
            print(f'[ApiClient] POST {path} → unexpected error: {e}')
        return None

    def _patch(self, path: str, body: Optional[dict] = None) -> Optional[dict]:
        url = f'{self.base_url}{path}'
        data = json.dumps(body or {}).encode()
        req = request.Request(url, data=data, headers=self._headers, method='PATCH')
        try:
            with request.urlopen(req, timeout=5) as resp:
                return json.loads(resp.read().decode())
        except error.HTTPError as e:
            print(f'[ApiClient] PATCH {path} → HTTP {e.code}: {e.read().decode()}')
        except error.URLError as e:
            print(f'[ApiClient] PATCH {path} → network error: {e.reason}')
        except Exception as e:
            print(f'[ApiClient] PATCH {path} → unexpected error: {e}')
        return None

    # -------------------------------------------------------------------------
    # Public API
    # -------------------------------------------------------------------------

    def get_session_config(self) -> Optional[dict]:
        """
        GET /core/session/config
        Returns lesson systemPrompt, user level, and profile.
        Returns None if API unreachable — caller falls back to local system prompt.

        Response shape:
        {
            deviceId, userId, level,
            lesson: { id, title, scenario, systemPrompt, objectives, order } | None,
            module: { id, name, description, order } | None,
            profile: { nativeLanguage, interests, hobbies, occupation, ageGroup, learningGoal } | None
        }
        """
        result = self._get('/core/session/config')
        if result:
            lesson = result.get('lesson')
            level = result.get('level', 'A1')
            print(f'[ApiClient] Config loaded — level={level}, lesson={lesson["title"] if lesson else "none"}')
        return result

    def create_session(self, mode: str, lesson_id: Optional[str] = None) -> Optional[str]:
        """
        POST /core/sessions
        Returns session id (str) or None on failure.

        mode: 'FREE_TALK' | 'GUIDED_LESSON' | 'DIAGNOSIS'
        """
        body: dict = {'mode': mode}
        if lesson_id:
            body['lessonId'] = lesson_id

        result = self._post('/core/sessions', body)
        if result:
            session_id = result.get('id')
            print(f'[ApiClient] Session created — id={session_id}, mode={mode}')
            return session_id
        return None

    def create_log(
        self,
        session_id: str,
        user_audio_trans: Optional[str] = None,
        lery_response: Optional[str] = None,
        grammatical_fixes: Optional[str] = None,
        task_achievement: Optional[int] = None,
        grammar: Optional[int] = None,
        vocabulary: Optional[int] = None,
        fluency: Optional[int] = None,
        total_score: Optional[int] = None,
        evaluation_reasoning: Optional[str] = None,
    ) -> Optional[dict]:
        """
        POST /core/logs
        Saves transcript + Lery response + CEFR scores.
        Returns { id, progressStatus } or None on failure.

        CEFR scores are optional — post without them when evaluate_turn is not yet
        implemented. Pass them when brain_manager.evaluate_turn() is available (P1).
        """
        body: dict = {'sessionId': session_id}

        if user_audio_trans is not None:
            body['userAudioTrans'] = user_audio_trans
        if lery_response is not None:
            body['leryResponse'] = lery_response
        if grammatical_fixes is not None:
            body['grammaticalFixes'] = grammatical_fixes
        if task_achievement is not None:
            body['taskAchievement'] = task_achievement
        if grammar is not None:
            body['grammar'] = grammar
        if vocabulary is not None:
            body['vocabulary'] = vocabulary
        if fluency is not None:
            body['fluency'] = fluency
        if total_score is not None:
            body['totalScore'] = total_score
        if evaluation_reasoning is not None:
            body['evaluationReasoning'] = evaluation_reasoning

        result = self._post('/core/logs', body)
        if result:
            print(f'[ApiClient] Log saved — id={result.get("id")}, progressStatus={result.get("progressStatus")}')
        return result

    def complete_session(self, session_id: str) -> Optional[dict]:
        """
        PATCH /core/sessions/:id/complete
        Finalizes session, computes final score, applies 70% progress rule.
        Returns { id, endedAt, finalScore, progressStatus } or None on failure.
        """
        result = self._patch(f'/core/sessions/{session_id}/complete')
        if result:
            print(
                f'[ApiClient] Session completed — finalScore={result.get("finalScore")}, '
                f'progressStatus={result.get("progressStatus")}'
            )
        return result


def create_api_client() -> Optional['ApiClient']:
    """
    Factory that reads LERY_API_URL and LERY_DEVICE_API_KEY from environment.
    Returns None if vars are missing — caller must handle offline mode.
    """
    api_url = os.getenv('LERY_API_URL')
    api_key = os.getenv('LERY_DEVICE_API_KEY')

    if not api_url or not api_key:
        print('[ApiClient] LERY_API_URL or LERY_DEVICE_API_KEY not set — running offline')
        return None

    return ApiClient(base_url=api_url, api_key=api_key)

import json
import os
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src'))

import agent_client
from agent_client import AgentClient, AgentError, create_agent_client


class FakeAgent:
    """Real HTTP server on a random port; routes map (method, path) -> (status, body | callable)."""

    def __init__(self):
        self.routes = {}
        self.requests = []
        outer = self

        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *_a):
                pass

            def _handle(self):
                length = int(self.headers.get('Content-Length') or 0)
                body = json.loads(self.rfile.read(length) or b'null')
                outer.requests.append((self.command, self.path, body))
                route = outer.routes.get((self.command, self.path))
                if route is None:
                    status, payload = 404, {'error': 'not found'}
                else:
                    status, payload = route
                    if callable(payload):
                        payload = payload()
                raw = payload if isinstance(payload, bytes) else json.dumps(payload).encode()
                self.send_response(status)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(raw)))
                self.end_headers()
                self.wfile.write(raw)

            do_POST = do_PATCH = _handle

        self.server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        threading.Thread(target=self.server.serve_forever, daemon=True).start()
        self.url = f'http://127.0.0.1:{self.server.server_address[1]}'

    def stop(self):
        self.server.shutdown()
        self.server.server_close()


@pytest.fixture
def fake():
    f = FakeAgent()
    yield f
    f.stop()


class Clock:
    def __init__(self):
        self.now = 1000.0

    def __call__(self):
        return self.now


@pytest.mark.unit
class TestOpenSession:
    def test_returns_session_id(self, fake):
        fake.routes[('POST', '/v1/sessions')] = (201, {'agentSessionId': 'abc', 'level': 'A2'})
        assert AgentClient(fake.url).open_session('FREE_TALK') == 'abc'
        assert fake.requests[0][2] == {'mode': 'FREE_TALK'}

    def test_response_without_id_raises(self, fake):
        fake.routes[('POST', '/v1/sessions')] = (201, {})
        with pytest.raises(AgentError):
            AgentClient(fake.url).open_session('FREE_TALK')

    def test_invalid_json_raises(self, fake):
        fake.routes[('POST', '/v1/sessions')] = (201, b'<html>nope</html>')
        with pytest.raises(AgentError, match='invalid JSON'):
            AgentClient(fake.url).open_session('FREE_TALK')


@pytest.mark.unit
class TestTurn:
    def test_returns_reply_and_omits_evaluate_by_default(self, fake):
        fake.routes[('POST', '/v1/turns')] = (200, {'reply': 'Hi there', 'evaluation': None})
        result = AgentClient(fake.url).turn('abc', 'Hello')
        assert result['reply'] == 'Hi there'
        assert fake.requests[0][2] == {'agentSessionId': 'abc', 'userText': 'Hello'}

    def test_sends_evaluate_when_given(self, fake):
        fake.routes[('POST', '/v1/turns')] = (200, {'reply': 'ok'})
        AgentClient(fake.url).turn('abc', 'Hello', evaluate=False)
        assert fake.requests[0][2]['evaluate'] is False

    def test_empty_reply_raises(self, fake):
        fake.routes[('POST', '/v1/turns')] = (200, {'reply': '   '})
        with pytest.raises(AgentError, match='empty reply'):
            AgentClient(fake.url).turn('abc', 'Hello')

    def test_unknown_session_raises_with_status(self, fake):
        # no route registered -> 404, like an agent that restarted and lost the session
        with pytest.raises(AgentError) as exc:
            AgentClient(fake.url).turn('lost', 'Hello')
        assert exc.value.status == 404

    def test_on_slow_fires_when_agent_is_slow(self, fake, monkeypatch):
        monkeypatch.setattr(agent_client, '_SLOW_THRESHOLD', 0.05)

        def slow():
            time.sleep(0.3)
            return {'reply': 'late'}

        fake.routes[('POST', '/v1/turns')] = (200, slow)
        fired = threading.Event()
        AgentClient(fake.url).turn('abc', 'Hello', on_slow=fired.set)
        assert fired.is_set()

    def test_on_slow_not_fired_when_fast(self, fake, monkeypatch):
        monkeypatch.setattr(agent_client, '_SLOW_THRESHOLD', 0.2)
        fake.routes[('POST', '/v1/turns')] = (200, {'reply': 'quick'})
        fired = threading.Event()
        AgentClient(fake.url).turn('abc', 'Hello', on_slow=fired.set)
        time.sleep(0.3)
        assert not fired.is_set()


@pytest.mark.unit
class TestCooldown:
    def test_5xx_starts_cooldown_and_fails_fast(self, fake):
        fake.routes[('POST', '/v1/sessions')] = (503, {'error': 'overloaded'})
        client = AgentClient(fake.url, cooldown=60, clock=Clock())
        with pytest.raises(AgentError):
            client.open_session('FREE_TALK')
        hits = len(fake.requests)

        with pytest.raises(AgentError, match='cooling down'):
            client.open_session('FREE_TALK')
        assert len(fake.requests) == hits  # second call never reached the server

    def test_4xx_does_not_start_cooldown(self, fake):
        client = AgentClient(fake.url, cooldown=60, clock=Clock())
        with pytest.raises(AgentError):
            client.turn('lost', 'Hello')  # 404
        fake.routes[('POST', '/v1/turns')] = (200, {'reply': 'ok'})
        assert client.turn('abc', 'Hello')['reply'] == 'ok'

    def test_connection_refused_starts_cooldown(self):
        clock = Clock()
        client = AgentClient('http://127.0.0.1:1', cooldown=60, clock=clock)  # nothing listens on port 1
        with pytest.raises(AgentError, match='network error'):
            client.open_session('FREE_TALK')
        with pytest.raises(AgentError, match='cooling down'):
            client.open_session('FREE_TALK')

    def test_cooldown_expires(self, fake):
        clock = Clock()
        fake.routes[('POST', '/v1/sessions')] = (503, {})
        client = AgentClient(fake.url, cooldown=60, clock=clock)
        with pytest.raises(AgentError):
            client.open_session('FREE_TALK')

        clock.now += 61
        fake.routes[('POST', '/v1/sessions')] = (201, {'agentSessionId': 'back'})
        assert client.open_session('FREE_TALK') == 'back'


@pytest.mark.unit
class TestCompleteSession:
    def test_returns_result(self, fake):
        fake.routes[('PATCH', '/v1/sessions/abc/complete')] = (
            200, {'finalScore': 82, 'progressStatus': 'COMPLETED', 'turnCount': 4},
        )
        assert AgentClient(fake.url).complete_session('abc')['finalScore'] == 82

    def test_never_raises(self):
        assert AgentClient('http://127.0.0.1:1').complete_session('abc') is None


@pytest.mark.unit
class TestFactory:
    def test_none_when_url_unset(self, monkeypatch):
        monkeypatch.delenv('LERY_AGENT_URL', raising=False)
        assert create_agent_client() is None

    def test_builds_client_from_env(self, monkeypatch):
        monkeypatch.setenv('LERY_AGENT_URL', 'http://10.0.0.5:3334/')
        monkeypatch.setenv('LERY_AGENT_TIMEOUT', '12')
        client = create_agent_client()
        assert client.base_url == 'http://10.0.0.5:3334'
        assert client._turn_timeout == 12.0

    def test_invalid_numbers_fall_back_to_defaults(self, monkeypatch):
        monkeypatch.setenv('LERY_AGENT_URL', 'http://x')
        monkeypatch.setenv('LERY_AGENT_TIMEOUT', 'abc')
        assert create_agent_client()._turn_timeout == agent_client._DEFAULT_TURN_TIMEOUT

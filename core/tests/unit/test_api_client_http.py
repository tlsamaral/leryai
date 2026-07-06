import json
import sys
import os
import pytest
from unittest.mock import MagicMock
from urllib import error as urllib_error

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src'))

from api_client import ApiClient


@pytest.fixture
def client():
    return ApiClient(base_url='http://api.test', api_key='test-key')


def make_response(data: dict, status: int = 200):
    mock_resp = MagicMock()
    mock_resp.read.return_value = json.dumps(data).encode()
    mock_resp.status = status
    mock_resp.__enter__ = MagicMock(return_value=mock_resp)
    mock_resp.__exit__ = MagicMock(return_value=False)
    return mock_resp


@pytest.mark.unit
class TestGetMethod:
    def test_happy_path_returns_parsed_dict(self, client, mocker):
        mocker.patch('api_client.request.urlopen', return_value=make_response({'id': '1'}))
        result = client._get('/test')
        assert result == {'id': '1'}

    def test_http_error_returns_none(self, client, mocker):
        mock_err = urllib_error.HTTPError(url='', code=401, msg='Unauthorized', hdrs={}, fp=None)
        mock_err.read = MagicMock(return_value=b'Unauthorized')
        mocker.patch('api_client.request.urlopen', side_effect=mock_err)
        result = client._get('/test')
        assert result is None

    def test_url_error_returns_none(self, client, mocker):
        mocker.patch('api_client.request.urlopen', side_effect=urllib_error.URLError('connection refused'))
        result = client._get('/test')
        assert result is None

    def test_auth_header_sent(self, client, mocker):
        mock_urlopen = mocker.patch('api_client.request.urlopen', return_value=make_response({'ok': True}))
        client._get('/test')
        req = mock_urlopen.call_args[0][0]
        assert req.get_header('Authorization') == 'Bearer test-key'


@pytest.mark.unit
class TestPostMethod:
    def test_sends_json_body(self, client, mocker):
        mock_urlopen = mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 'new'}))
        client._post('/sessions', {'mode': 'FREE_TALK'})
        req = mock_urlopen.call_args[0][0]
        body = json.loads(req.data.decode())
        assert body == {'mode': 'FREE_TALK'}

    def test_happy_path_returns_dict(self, client, mocker):
        mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 'sess-1'}))
        result = client._post('/sessions', {'mode': 'FREE_TALK'})
        assert result['id'] == 'sess-1'

    def test_http_error_returns_none(self, client, mocker):
        mock_err = urllib_error.HTTPError(url='', code=422, msg='Unprocessable', hdrs={}, fp=None)
        mock_err.read = MagicMock(return_value=b'error')
        mocker.patch('api_client.request.urlopen', side_effect=mock_err)
        result = client._post('/sessions', {})
        assert result is None


@pytest.mark.unit
class TestHighLevelMethods:
    def test_create_session_returns_session_id(self, client, mocker):
        mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 'sess-abc'}))
        session_id = client.create_session(mode='FREE_TALK')
        assert session_id == 'sess-abc'

    def test_create_session_includes_lesson_id_when_provided(self, client, mocker):
        mock_urlopen = mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 'sess-1'}))
        client.create_session(mode='GUIDED_LESSON', lesson_id='lesson-42')
        req = mock_urlopen.call_args[0][0]
        body = json.loads(req.data.decode())
        assert body['lessonId'] == 'lesson-42'

    def test_complete_session_sends_patch(self, client, mocker):
        mock_urlopen = mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 's', 'finalScore': 80, 'progressStatus': 'PASSED'}))
        client.complete_session('sess-1')
        req = mock_urlopen.call_args[0][0]
        assert req.method == 'PATCH'
        assert '/core/sessions/sess-1/complete' in req.full_url

    def test_complete_diagnosis_sends_estimated_level(self, client, mocker):
        mock_urlopen = mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 's', 'updatedLevel': 'B1'}))
        client.complete_diagnosis('sess-1', 'B1')
        req = mock_urlopen.call_args[0][0]
        body = json.loads(req.data.decode())
        assert body['estimatedLevel'] == 'B1'

    def test_create_log_omits_none_fields(self, client, mocker):
        mock_urlopen = mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 'log-1', 'progressStatus': None}))
        client.create_log(session_id='sess-1', user_audio_trans='hello')
        req = mock_urlopen.call_args[0][0]
        body = json.loads(req.data.decode())
        assert 'grammar' not in body
        assert 'fluency' not in body
        assert body['userAudioTrans'] == 'hello'

    def test_get_session_config_returns_dict(self, client, mocker):
        config = {
            'level': 'B2',
            'diagnosisCompleted': True,
            'lesson': None,
            'profile': None,
        }
        mocker.patch('api_client.request.urlopen', return_value=make_response(config))
        result = client.get_session_config()
        assert result == config

    def test_get_session_config_returns_none_on_failure(self, client, mocker):
        from urllib import error as urllib_error
        mock_err = urllib_error.URLError('connection refused')
        mocker.patch('api_client.request.urlopen', side_effect=mock_err)
        result = client.get_session_config()
        assert result is None

    def test_create_session_returns_id_string(self, client, mocker):
        mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 'sess-1'}))
        result = client.create_session(mode='FREE_TALK')
        assert result == 'sess-1'

    def test_create_session_includes_lesson_id_when_provided(self, client, mocker):
        mock_urlopen = mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 'sess-2'}))
        client.create_session(mode='GUIDED_LESSON', lesson_id='lesson-99')
        req = mock_urlopen.call_args[0][0]
        body = json.loads(req.data.decode())
        assert body['lessonId'] == 'lesson-99'

    def test_create_session_omits_lesson_id_when_none(self, client, mocker):
        mock_urlopen = mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 'sess-3'}))
        client.create_session(mode='FREE_TALK', lesson_id=None)
        req = mock_urlopen.call_args[0][0]
        body = json.loads(req.data.decode())
        assert 'lessonId' not in body

    def test_create_log_sends_all_scores(self, client, mocker):
        mock_urlopen = mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 'log-2', 'progressStatus': 'PASSED'}))
        client.create_log(
            session_id='sess-1',
            user_audio_trans='I went to the store.',
            lery_response='Great sentence!',
            grammatical_fixes='None.',
            task_achievement=20,
            grammar=18,
            vocabulary=17,
            fluency=19,
            total_score=74,
            evaluation_reasoning='Well done.',
        )
        req = mock_urlopen.call_args[0][0]
        body = json.loads(req.data.decode())
        assert body['taskAchievement'] == 20
        assert body['grammar'] == 18
        assert body['vocabulary'] == 17
        assert body['fluency'] == 19
        assert body['totalScore'] == 74
        assert body['grammaticalFixes'] == 'None.'
        assert body['evaluationReasoning'] == 'Well done.'

    def test_complete_session_calls_patch(self, client, mocker):
        mock_urlopen = mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 'sess-x', 'finalScore': 90, 'progressStatus': 'PASSED'}))
        client.complete_session('sess-x')
        req = mock_urlopen.call_args[0][0]
        assert req.method == 'PATCH'
        assert 'sess-x' in req.full_url
        assert 'complete' in req.full_url

    def test_complete_diagnosis_sends_level(self, client, mocker):
        mock_urlopen = mocker.patch('api_client.request.urlopen', return_value=make_response({'id': 'sess-d', 'updatedLevel': 'C1'}))
        client.complete_diagnosis('sess-d', 'C1')
        req = mock_urlopen.call_args[0][0]
        body = json.loads(req.data.decode())
        assert body['estimatedLevel'] == 'C1'
        assert req.method == 'PATCH'

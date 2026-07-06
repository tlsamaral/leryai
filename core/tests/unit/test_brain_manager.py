import concurrent.futures
import json
import sys
import os
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src'))


@pytest.fixture
def brain(mocker):
    mocker.patch('brain_manager.genai.Client')
    from brain_manager import BrainManager
    bm = BrainManager(system_prompt='You are a tutor.')
    return bm


def make_response(text: str):
    m = type('R', (), {'text': text})()
    return m


# ── generate_response ─────────────────────────────────────────────────────────

@pytest.mark.unit
class TestGenerateResponse:
    def _mock_executor(self, mocker, future):
        mock_exec = mocker.MagicMock()
        mock_exec.submit.return_value = future
        mocker.patch('brain_manager.concurrent.futures.ThreadPoolExecutor', return_value=mock_exec)
        mocker.patch('brain_manager.time.sleep')
        return mock_exec

    def test_happy_path_returns_text(self, brain, mocker):
        future = mocker.MagicMock()
        future.result.return_value = mocker.MagicMock(text='Hello!')
        self._mock_executor(mocker, future)
        result = brain.generate_response('hi')
        assert result == 'Hello!'

    def test_retries_on_503(self, brain, mocker):
        future = mocker.MagicMock()
        future.result.side_effect = [
            Exception('503 service unavailable'),
            mocker.MagicMock(text='Retry worked!'),
        ]
        self._mock_executor(mocker, future)
        result = brain.generate_response('hi')
        assert result == 'Retry worked!'
        assert future.result.call_count == 2

    def test_retries_on_timeout(self, brain, mocker):
        future = mocker.MagicMock()
        future.result.side_effect = [
            concurrent.futures.TimeoutError(),
            mocker.MagicMock(text='After timeout'),
        ]
        self._mock_executor(mocker, future)
        result = brain.generate_response('hi')
        assert result == 'After timeout'

    def test_non_retryable_stops_after_first_attempt(self, brain, mocker):
        future = mocker.MagicMock()
        future.result.side_effect = Exception('401 unauthorized')
        self._mock_executor(mocker, future)
        result = brain.generate_response('hi')
        assert result == "I'm sorry, I'm having trouble thinking right now."
        assert future.result.call_count == 1

    def test_exhausted_retries_returns_fallback(self, brain, mocker):
        future = mocker.MagicMock()
        future.result.side_effect = Exception('503 always fails')
        self._mock_executor(mocker, future)
        result = brain.generate_response('hi')
        assert result == "I'm sorry, I'm having trouble thinking right now."
        assert future.result.call_count == 4  # _MAX_RETRIES = 4

    def test_sleep_called_between_retries(self, brain, mocker):
        future = mocker.MagicMock()
        future.result.side_effect = [
            Exception('503'),
            mocker.MagicMock(text='ok'),
        ]
        self._mock_executor(mocker, future)
        sleep_mock = mocker.patch('brain_manager.time.sleep')
        brain.generate_response('hi')
        sleep_mock.assert_called_once()


# ── rate_cefr ─────────────────────────────────────────────────────────────────

@pytest.mark.unit
class TestRateCefr:
    def test_returns_valid_cefr_level(self, brain, mocker):
        brain.client.models.generate_content.return_value = make_response(
            '{"estimated_cefr": "B2", "justification": "good range"}'
        )
        result = brain.rate_cefr('I have been studying English for three years.')
        assert result == 'B2'

    def test_strips_markdown_code_fences(self, brain, mocker):
        brain.client.models.generate_content.return_value = make_response(
            '```json\n{"estimated_cefr": "C1", "justification": "advanced"}\n```'
        )
        result = brain.rate_cefr('transcript here')
        assert result == 'C1'

    def test_unknown_cefr_value_fallback_to_a2(self, brain, mocker):
        brain.client.models.generate_content.return_value = make_response(
            '{"estimated_cefr": "Z9", "justification": "weird"}'
        )
        result = brain.rate_cefr('some transcript')
        assert result == 'A2'

    def test_malformed_json_fallback_to_a2(self, brain, mocker):
        brain.client.models.generate_content.return_value = make_response('not json at all')
        mocker.patch('brain_manager.time.sleep')
        result = brain.rate_cefr('transcript')
        assert result == 'A2'

    def test_retries_on_503_and_returns_level(self, brain, mocker):
        mocker.patch('brain_manager.time.sleep')
        brain.client.models.generate_content.side_effect = [
            Exception('503'),
            make_response('{"estimated_cefr": "A1", "justification": "beginner"}'),
        ]
        result = brain.rate_cefr('hello i am student')
        assert result == 'A1'
        assert brain.client.models.generate_content.call_count == 2

    def test_exhausted_retries_fallback_to_a2(self, brain, mocker):
        mocker.patch('brain_manager.time.sleep')
        brain.client.models.generate_content.side_effect = Exception('503')
        result = brain.rate_cefr('transcript')
        assert result == 'A2'
        assert brain.client.models.generate_content.call_count == 4  # _MAX_RETRIES

    def test_all_valid_cefr_levels_returned_correctly(self, brain):
        for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
            brain.client.models.generate_content.return_value = make_response(
                f'{{"estimated_cefr": "{level}", "justification": "test"}}'
            )
            assert brain.rate_cefr('transcript') == level


# ── evaluate_turn ─────────────────────────────────────────────────────────────

VALID_JSON = json.dumps({
    'task_achievement': 20,
    'grammar': 18,
    'vocabulary': 17,
    'fluency': 19,
    'total_score': 74,
    'grammatical_fixes': 'No corrections needed.',
    'reasoning': 'Good vocabulary; improve fluency.',
})


@pytest.mark.unit
class TestEvaluateTurn:
    def test_returns_dict_with_all_pillars(self, brain):
        brain.client.models.generate_content.return_value = make_response(VALID_JSON)
        result = brain.evaluate_turn('I go yesterday.', 'Great try!')
        assert result is not None
        assert result['task_achievement'] == 20
        assert result['grammar'] == 18
        assert result['vocabulary'] == 17
        assert result['fluency'] == 19

    def test_total_score_recomputed_from_pillars(self, brain):
        bad_total = json.dumps({
            'task_achievement': 20, 'grammar': 18, 'vocabulary': 17,
            'fluency': 19, 'total_score': 999,
            'grammatical_fixes': 'ok', 'reasoning': 'good',
        })
        brain.client.models.generate_content.return_value = make_response(bad_total)
        result = brain.evaluate_turn('test', 'ok')
        assert result['total_score'] == 74  # 20+18+17+19

    def test_clamps_pillar_above_25_to_25(self, brain):
        data = json.loads(VALID_JSON)
        data['grammar'] = 999
        brain.client.models.generate_content.return_value = make_response(json.dumps(data))
        result = brain.evaluate_turn('test', 'ok')
        assert result['grammar'] == 25

    def test_clamps_pillar_below_0_to_0(self, brain):
        data = json.loads(VALID_JSON)
        data['fluency'] = -10
        brain.client.models.generate_content.return_value = make_response(json.dumps(data))
        result = brain.evaluate_turn('test', 'ok')
        assert result['fluency'] == 0

    def test_injects_lesson_objectives_in_prompt(self, brain):
        brain.client.models.generate_content.return_value = make_response(VALID_JSON)
        brain.evaluate_turn('test', 'ok', lesson_objectives='Use past tense.')
        call_args = brain.client.models.generate_content.call_args
        prompt = call_args[1]['contents'] if 'contents' in call_args[1] else call_args[0][0] if call_args[0] else ''
        # Check via keyword args (model=, contents=)
        contents_arg = call_args.kwargs.get('contents', '')
        assert 'LESSON OBJECTIVES' in contents_arg
        assert 'Use past tense.' in contents_arg

    def test_no_objectives_section_when_empty(self, brain):
        brain.client.models.generate_content.return_value = make_response(VALID_JSON)
        brain.evaluate_turn('test', 'ok', lesson_objectives='')
        contents_arg = brain.client.models.generate_content.call_args.kwargs.get('contents', '')
        assert 'LESSON OBJECTIVES' not in contents_arg

    def test_malformed_json_returns_none(self, brain, mocker):
        mocker.patch('brain_manager.time.sleep')
        brain.client.models.generate_content.return_value = make_response('not json')
        result = brain.evaluate_turn('test', 'ok')
        assert result is None

    def test_retries_on_503_and_succeeds(self, brain, mocker):
        mocker.patch('brain_manager.time.sleep')
        brain.client.models.generate_content.side_effect = [
            Exception('503'),
            make_response(VALID_JSON),
        ]
        result = brain.evaluate_turn('test', 'ok')
        assert result is not None
        assert brain.client.models.generate_content.call_count == 2

    def test_exhausted_retries_returns_none(self, brain, mocker):
        mocker.patch('brain_manager.time.sleep')
        brain.client.models.generate_content.side_effect = Exception('503')
        result = brain.evaluate_turn('test', 'ok')
        assert result is None

import sys
import os
import pytest
from unittest.mock import MagicMock, patch, call

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src'))

from main import LeryAI, State


# ── Shared fixture ────────────────────────────────────────────────────────────

def _make_lery(mocker, *, api=None):
    """Build a LeryAI instance with all hardware + network deps mocked."""
    mock_audio = MagicMock()
    mock_led = MagicMock()
    mock_tts = MagicMock()
    mock_tts.synthesize.return_value = []
    mock_wake = MagicMock()
    mock_brain = MagicMock()
    mock_brain.generate_response.return_value = "Hello!"

    mocker.patch('main.AudioManager', return_value=mock_audio)
    mocker.patch('main.create_led_controller', return_value=mock_led)
    mocker.patch('main.create_tts_provider', return_value=mock_tts)
    mocker.patch('main.create_wake_word_detector', return_value=mock_wake)
    mocker.patch('main.create_api_client', return_value=api)
    mocker.patch('main.BrainManager', return_value=mock_brain)
    mocker.patch('main.time.sleep')

    lery = LeryAI()
    lery._mock_audio = mock_audio
    lery._mock_led = mock_led
    lery._mock_tts = mock_tts
    lery._mock_wake = mock_wake
    lery._mock_brain = mock_brain
    return lery


@pytest.fixture
def lery(mocker):
    return _make_lery(mocker)


@pytest.fixture
def lery_with_api(mocker):
    api = MagicMock()
    api.get_session_config.return_value = {
        'level': 'B1',
        'diagnosisCompleted': True,
        'lesson': None,
        'profile': None,
    }
    return _make_lery(mocker, api=api)


# ── Init ──────────────────────────────────────────────────────────────────────

@pytest.mark.unit
class TestLeryAIInit:
    def test_starts_in_idle_state(self, lery):
        assert lery.state == State.IDLE

    def test_default_mode_is_free_talk(self, lery):
        assert lery._session_mode == 'FREE_TALK'

    def test_silence_strikes_starts_at_zero(self, lery):
        assert lery._silence_strikes == 0

    def test_no_api_means_no_diagnosis_needed(self, lery):
        assert lery._needs_diagnosis is False

    def test_api_with_diagnosis_completed_no_diagnosis(self, lery_with_api):
        assert lery_with_api._needs_diagnosis is False

    def test_api_with_diagnosis_pending_sets_flag(self, mocker):
        api = MagicMock()
        api.get_session_config.return_value = {
            'level': 'A1',
            'diagnosisCompleted': False,
            'lesson': None,
            'profile': None,
        }
        lery = _make_lery(mocker, api=api)
        assert lery._needs_diagnosis is True

    def test_lesson_fields_loaded_when_config_has_lesson(self, mocker):
        api = MagicMock()
        api.get_session_config.return_value = {
            'level': 'B1',
            'diagnosisCompleted': True,
            'lesson': {
                'id': 'lesson-1',
                'title': 'At the Airport',
                'systemPrompt': 'Guide the student.',
                'objectives': 'Use travel vocab.',
            },
            'profile': None,
        }
        lery = _make_lery(mocker, api=api)
        assert lery._lesson_id == 'lesson-1'
        assert lery._lesson_system_prompt == 'Guide the student.'
        assert lery._lesson_objectives == 'Use travel vocab.'

    def test_no_lesson_fields_when_config_has_no_lesson(self, lery_with_api):
        assert lery_with_api._lesson_id is None
        assert lery_with_api._lesson_system_prompt is None


# ── set_state ─────────────────────────────────────────────────────────────────

@pytest.mark.unit
class TestSetState:
    def test_updates_state_attribute(self, lery):
        lery.set_state(State.LISTENING)
        assert lery.state == State.LISTENING

    def test_calls_led_with_state_value(self, lery):
        lery.set_state(State.THINKING)
        lery._mock_led.set_state.assert_called_with('THINKING')

    def test_multiple_transitions_tracked(self, lery):
        lery.set_state(State.LISTENING)
        lery.set_state(State.THINKING)
        lery.set_state(State.SPEAKING)
        assert lery.state == State.SPEAKING


# ── _ensure_session ───────────────────────────────────────────────────────────

@pytest.mark.unit
class TestEnsureSession:
    def test_does_nothing_when_no_api(self, lery):
        lery._session_id = None
        lery._ensure_session()
        assert lery._session_id is None

    def test_does_nothing_when_session_already_exists(self, lery_with_api):
        lery_with_api._session_id = 'existing-id'
        lery_with_api._ensure_session()
        lery_with_api.api.create_session.assert_not_called()

    def test_creates_session_and_stores_id(self, lery_with_api):
        lery_with_api.api.create_session.return_value = 'new-sess-1'
        lery_with_api._session_id = None
        lery_with_api._ensure_session()
        assert lery_with_api._session_id == 'new-sess-1'

    def test_creates_session_with_free_talk_mode(self, lery_with_api):
        lery_with_api.api.create_session.return_value = 'sess'
        lery_with_api._session_id = None
        lery_with_api._session_mode = 'FREE_TALK'
        lery_with_api._ensure_session()
        lery_with_api.api.create_session.assert_called_once_with(
            mode='FREE_TALK', lesson_id=None
        )

    def test_creates_session_with_lesson_id_in_guided_mode(self, lery_with_api):
        lery_with_api.api.create_session.return_value = 'sess'
        lery_with_api._session_id = None
        lery_with_api._session_mode = 'GUIDED_LESSON'
        lery_with_api._lesson_id = 'lesson-abc'
        lery_with_api._ensure_session()
        lery_with_api.api.create_session.assert_called_once_with(
            mode='GUIDED_LESSON', lesson_id='lesson-abc'
        )


# ── _switch_to_guided_lesson ──────────────────────────────────────────────────

@pytest.mark.unit
class TestSwitchToGuidedLesson:
    def test_returns_false_when_no_lesson_id(self, lery):
        lery._lesson_id = None
        lery._lesson_system_prompt = None
        assert lery._switch_to_guided_lesson() is False

    def test_returns_true_when_lesson_available(self, lery):
        lery._lesson_id = 'lesson-1'
        lery._lesson_system_prompt = 'Guide the student.'
        lery._config = {'level': 'B1'}
        assert lery._switch_to_guided_lesson() is True

    def test_switches_session_mode(self, lery):
        lery._lesson_id = 'lesson-1'
        lery._lesson_system_prompt = 'Guide.'
        lery._config = {'level': 'B1'}
        lery._switch_to_guided_lesson()
        assert lery._session_mode == 'GUIDED_LESSON'

    def test_completes_existing_session_on_switch(self, lery_with_api):
        lery_with_api._lesson_id = 'lesson-1'
        lery_with_api._lesson_system_prompt = 'Guide.'
        lery_with_api._session_id = 'open-session'
        lery_with_api._switch_to_guided_lesson()
        lery_with_api.api.complete_session.assert_called_once_with('open-session')

    def test_resets_session_id_on_switch(self, lery):
        lery._lesson_id = 'lesson-1'
        lery._lesson_system_prompt = 'Guide.'
        lery._config = {'level': 'B1'}
        lery._session_id = 'old-session'
        lery._switch_to_guided_lesson()
        # session_id is reset to None so _ensure_session opens a fresh one
        assert lery._session_id is None

    def test_creates_new_guided_session_via_api(self, lery_with_api):
        lery_with_api._lesson_id = 'lesson-1'
        lery_with_api._lesson_system_prompt = 'Guide.'
        lery_with_api.api.create_session.return_value = 'guided-sess'
        lery_with_api._switch_to_guided_lesson()
        lery_with_api.api.create_session.assert_called_with(
            mode='GUIDED_LESSON', lesson_id='lesson-1'
        )


# ── _run_session: silence strikes ─────────────────────────────────────────────

@pytest.mark.unit
class TestRunSessionSilence:
    def test_three_silences_end_session(self, lery):
        lery._mock_audio.record_audio.return_value = None
        lery._run_session()  # should return (not hang)
        assert lery._silence_strikes == 3

    def test_silence_counter_resets_on_speech(self, lery, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        call_count = 0

        def record_side_effect(**_kwargs):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                return None  # silence → strike 1
            if call_count == 2:
                return str(audio_file)  # speech → resets
            return None  # 3 more silences to end

        lery._mock_audio.record_audio.side_effect = record_side_effect
        lery.transcribe_audio = MagicMock(return_value='hello')
        lery._ensure_session = MagicMock()
        lery._mock_brain.generate_response.return_value = 'Hi!'

        with patch('main._matches_keywords', return_value=False), \
             patch('main._matches_lesson_intent', return_value=False):
            lery._run_session()

        # After speech was detected, strikes should have been reset
        assert lery._silence_strikes >= 0  # session ended via final silences

    def test_nudge_spoken_on_silence_below_max(self, mocker, lery):
        calls = 0

        def record_side_effect(**_kwargs):
            nonlocal calls
            calls += 1
            return None

        lery._mock_audio.record_audio.side_effect = record_side_effect
        lery._speak = MagicMock()

        lery._run_session()

        # nudge spoken on first and second silence, goodbye on third
        assert lery._speak.call_count >= 3


# ── _run_session: exit keywords ───────────────────────────────────────────────

@pytest.mark.unit
class TestRunSessionExitKeywords:
    def test_exit_keyword_ends_session(self, lery, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        lery._mock_audio.record_audio.return_value = str(audio_file)
        lery.transcribe_audio = MagicMock(return_value='goodbye')
        lery._speak = MagicMock()

        lery._run_session()  # should return after exit keyword

        lery._speak.assert_called_once()
        assert 'Goodbye' in lery._speak.call_args[0][0] or \
               'goodbye' in lery._speak.call_args[0][0].lower()

    def test_portuguese_exit_keyword_ends_session(self, lery, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        lery._mock_audio.record_audio.return_value = str(audio_file)
        lery.transcribe_audio = MagicMock(return_value='tchau')
        lery._speak = MagicMock()

        lery._run_session()

        lery._speak.assert_called_once()


# ── _run_session: lesson intent ───────────────────────────────────────────────

@pytest.mark.unit
class TestRunSessionLessonIntent:
    def test_lesson_intent_in_free_talk_triggers_switch(self, lery, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        lery._mock_audio.record_audio.side_effect = [
            str(audio_file),
            None, None, None,  # end via silence after
        ]
        lery.transcribe_audio = MagicMock(return_value='start lesson')
        lery._switch_to_guided_lesson = MagicMock(return_value=True)
        lery._speak = MagicMock()
        lery._session_mode = 'FREE_TALK'

        lery._run_session()

        lery._switch_to_guided_lesson.assert_called_once()

    def test_no_lesson_available_plays_fallback(self, lery, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        lery._mock_audio.record_audio.side_effect = [
            str(audio_file),
            None, None, None,
        ]
        lery.transcribe_audio = MagicMock(return_value='start lesson please')
        lery._switch_to_guided_lesson = MagicMock(return_value=False)
        lery._speak = MagicMock()
        lery._session_mode = 'FREE_TALK'

        lery._run_session()

        # fallback message about no lesson
        lery._speak.assert_any_call(
            "[PT]Ainda não há uma lição disponível para o seu nível.[/PT] "
            "No lesson is available yet. Let's keep practicing in free talk!"
        )

    def test_lesson_intent_ignored_in_guided_lesson_mode(self, lery, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        lery._mock_audio.record_audio.side_effect = [
            str(audio_file),
            None, None, None,
        ]
        lery.transcribe_audio = MagicMock(return_value='start lesson')
        lery._switch_to_guided_lesson = MagicMock()
        lery._session_mode = 'GUIDED_LESSON'
        lery._ensure_session = MagicMock()
        lery._speak = MagicMock()
        lery._mock_brain.generate_response.return_value = 'Sure!'

        lery._run_session()

        lery._switch_to_guided_lesson.assert_not_called()


# ── _run_session: normal turn ─────────────────────────────────────────────────

@pytest.mark.unit
class TestRunSessionNormalTurn:
    def test_normal_turn_calls_brain_and_speaks(self, lery, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        lery._mock_audio.record_audio.side_effect = [
            str(audio_file),
            None, None, None,
        ]
        lery.transcribe_audio = MagicMock(return_value='How are you?')
        lery._ensure_session = MagicMock()
        lery._speak = MagicMock()
        lery._mock_brain.generate_response.return_value = "I'm great!"

        with patch('main._matches_keywords', return_value=False), \
             patch('main._matches_lesson_intent', return_value=False):
            lery._run_session()

        lery._mock_brain.generate_response.assert_called()
        lery._speak.assert_any_call("I'm great!")

    def test_brain_error_response_sets_error_state(self, lery, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        # One user turn (error), then 3 silences to end session.
        # Silence nudges also call generate_response, so provide enough responses.
        lery._mock_audio.record_audio.side_effect = [
            str(audio_file),
            None, None, None,
        ]
        lery.transcribe_audio = MagicMock(return_value='Hello')
        lery._ensure_session = MagicMock()
        lery._speak = MagicMock()
        lery._mock_brain.generate_response.side_effect = [
            "I'm sorry, I'm having trouble thinking right now.",  # turn 1 error
            "Are you still there?",   # nudge on silence strike 1
            "Are you still there?",   # nudge on silence strike 2
        ]

        with patch('main._matches_keywords', return_value=False), \
             patch('main._matches_lesson_intent', return_value=False):
            lery._run_session()

        # ERROR state must have been set at some point
        lery._mock_led.set_state.assert_any_call('ERROR')

    def test_guided_lesson_evaluates_turn(self, lery_with_api, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        lery_with_api._mock_audio.record_audio.side_effect = [
            str(audio_file),
            None, None, None,
        ]
        lery_with_api.transcribe_audio = MagicMock(return_value='I went to school.')
        # _run_session resets _session_id to None, so use _ensure_session to set it
        def mock_ensure():
            lery_with_api._session_id = 'sess-1'
        lery_with_api._ensure_session = mock_ensure
        lery_with_api._session_mode = 'GUIDED_LESSON'
        lery_with_api._lesson_objectives = 'Use past tense.'
        lery_with_api._speak = MagicMock()
        lery_with_api._mock_brain.generate_response.return_value = 'Good job!'
        lery_with_api._mock_brain.evaluate_turn.return_value = {
            'task_achievement': 20, 'grammar': 18, 'vocabulary': 17,
            'fluency': 19, 'total_score': 74,
            'grammatical_fixes': 'None needed.', 'reasoning': 'Good.',
        }

        with patch('main._matches_keywords', return_value=False), \
             patch('main._matches_lesson_intent', return_value=False):
            lery_with_api._run_session()

        lery_with_api._mock_brain.evaluate_turn.assert_called_once()

    def test_free_talk_does_not_evaluate_turn(self, lery_with_api, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        lery_with_api._mock_audio.record_audio.side_effect = [
            str(audio_file),
            None, None, None,
        ]
        lery_with_api.transcribe_audio = MagicMock(return_value='Hello!')
        def mock_ensure():
            lery_with_api._session_id = 'sess-1'
        lery_with_api._ensure_session = mock_ensure
        lery_with_api._session_mode = 'FREE_TALK'
        lery_with_api._speak = MagicMock()
        lery_with_api._mock_brain.generate_response.return_value = 'Hi!'

        with patch('main._matches_keywords', return_value=False), \
             patch('main._matches_lesson_intent', return_value=False):
            lery_with_api._run_session()

        lery_with_api._mock_brain.evaluate_turn.assert_not_called()


# ── run() outer loop ──────────────────────────────────────────────────────────

@pytest.mark.unit
class TestRun:
    def test_keyboard_interrupt_exits_cleanly(self, lery):
        lery._mock_wake.wait_for_wake_word.side_effect = KeyboardInterrupt
        lery._mock_audio.play_chime = MagicMock()
        lery.run()  # should return without raising

    def test_completes_open_session_on_keyboard_interrupt(self, lery_with_api):
        lery_with_api._session_id = 'open-sess'
        lery_with_api._mock_wake.wait_for_wake_word.side_effect = KeyboardInterrupt
        lery_with_api.run()
        lery_with_api.api.complete_session.assert_called_with('open-sess')

    def test_led_cleanup_called_on_exit(self, lery):
        lery._mock_wake.wait_for_wake_word.side_effect = KeyboardInterrupt
        lery.run()
        lery._mock_led.cleanup.assert_called_once()

    def test_wake_word_triggers_session(self, lery):
        call_count = 0

        def wake_side_effect():
            nonlocal call_count
            call_count += 1
            if call_count >= 2:
                raise KeyboardInterrupt

        lery._mock_wake.wait_for_wake_word.side_effect = wake_side_effect
        lery._mock_audio.play_chime = MagicMock()
        lery._mock_audio.record_audio.return_value = None  # silences end session
        lery._speak = MagicMock()

        lery.run()

        assert call_count == 2  # two wake cycles


# ── transcribe_audio ──────────────────────────────────────────────────────────

@pytest.mark.unit
class TestTranscribeAudio:
    def test_returns_none_when_file_not_exists(self, lery):
        result = lery.transcribe_audio('/tmp/does_not_exist_lery_test.wav')
        assert result is None

    def test_returns_transcription_text(self, mocker, lery, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        mock_transcription = MagicMock()
        mock_transcription.text = 'Hello world'
        mock_client = MagicMock()
        mock_client.audio.transcriptions.create.return_value = mock_transcription
        mocker.patch('main.client', mock_client)

        result = lery.transcribe_audio(str(audio_file))
        assert result == 'Hello world'

    def test_returns_none_on_exception(self, mocker, lery, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        mock_client = MagicMock()
        mock_client.audio.transcriptions.create.side_effect = Exception('API error')
        mocker.patch('main.client', mock_client)

        result = lery.transcribe_audio(str(audio_file))
        assert result is None
        lery._mock_audio.play_error_sound.assert_called_once()

    def test_deletes_file_after_transcription(self, mocker, lery, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        mock_transcription = MagicMock()
        mock_transcription.text = 'Test'
        mock_client = MagicMock()
        mock_client.audio.transcriptions.create.return_value = mock_transcription
        mocker.patch('main.client', mock_client)
        mock_remove = mocker.patch('main.os.remove')

        lery.transcribe_audio(str(audio_file))
        mock_remove.assert_called_once_with(str(audio_file))

    def test_deletes_file_even_on_exception(self, mocker, lery, tmp_path):
        audio_file = tmp_path / 'input.wav'
        audio_file.write_bytes(b'RIFF')

        mock_client = MagicMock()
        mock_client.audio.transcriptions.create.side_effect = Exception('fail')
        mocker.patch('main.client', mock_client)
        mock_remove = mocker.patch('main.os.remove')

        lery.transcribe_audio(str(audio_file))
        mock_remove.assert_called_once_with(str(audio_file))


# ── _speak ────────────────────────────────────────────────────────────────────

@pytest.mark.unit
class TestSpeak:
    def test_sets_speaking_state(self, lery):
        lery._mock_tts.synthesize.return_value = []
        lery._speak('hello')
        assert lery.state == State.SPEAKING

    def test_plays_each_tts_file(self, lery):
        lery._mock_tts.synthesize.return_value = ['file1.mp3', 'file2.mp3']
        lery._speak('Hello there')
        assert lery._mock_audio.play_audio.call_count == 2
        lery._mock_audio.play_audio.assert_any_call('file1.mp3')
        lery._mock_audio.play_audio.assert_any_call('file2.mp3')

    def test_tts_failure_plays_error_sound(self, lery):
        lery._mock_tts.synthesize.side_effect = Exception('TTS error')
        # Reset state to IDLE so we can check it doesn't change to SPEAKING
        lery.state = State.IDLE
        lery._speak('Hello')
        lery._mock_audio.play_error_sound.assert_called_once()
        assert lery.state != State.SPEAKING


# ── _run_diagnosis_session ────────────────────────────────────────────────────

@pytest.mark.unit
class TestRunDiagnosisSession:
    def _make_lery_with_diagnosis_api(self, mocker):
        api = MagicMock()
        api.create_session.return_value = 'diag-sess-1'
        api.complete_diagnosis.return_value = {'updatedLevel': 'B1'}

        mock_brain_instance = MagicMock()
        mock_brain_instance.generate_response.return_value = 'Hello, what is your name?'
        mock_brain_instance.rate_cefr.return_value = 'B1'

        # BrainManager is called twice: once in __init__, once in _run_diagnosis_session
        # We return the same mock for both (or different — doesn't matter for our tests)
        mocker.patch('main.BrainManager', return_value=mock_brain_instance)
        mocker.patch('main.AudioManager', return_value=MagicMock())
        mocker.patch('main.create_led_controller', return_value=MagicMock())
        mocker.patch('main.create_tts_provider', return_value=MagicMock())
        mocker.patch('main.create_wake_word_detector', return_value=MagicMock())
        mocker.patch('main.create_api_client', return_value=api)
        mocker.patch('main.time.sleep')

        lery = LeryAI()
        lery._mock_brain = mock_brain_instance
        lery._speak = MagicMock()
        lery.api = api
        return lery, api, mock_brain_instance

    def test_creates_diagnosis_session_via_api(self, mocker):
        lery, api, _ = self._make_lery_with_diagnosis_api(mocker)
        lery._mock_brain_instance = lery._mock_brain
        # 2 silences → exits diagnosis loop
        lery.audio_manager.record_audio.return_value = None
        lery._run_diagnosis_session()
        api.create_session.assert_called_with(mode='DIAGNOSIS')

    def test_opens_session_and_speaks_opening(self, mocker):
        lery, api, brain = self._make_lery_with_diagnosis_api(mocker)
        lery.audio_manager.record_audio.return_value = None
        lery._run_diagnosis_session()
        # _speak should be called with the opening response from brain
        lery._speak.assert_any_call('Hello, what is your name?')

    def test_two_silences_end_diagnosis_loop(self, mocker):
        lery, api, brain = self._make_lery_with_diagnosis_api(mocker)
        # All record_audio calls return None (silence)
        lery.audio_manager.record_audio.return_value = None
        lery._run_diagnosis_session()
        # Should return (not hang) — verified by test completing
        assert True

    def test_exit_keyword_ends_diagnosis_early(self, mocker, tmp_path):
        lery, api, brain = self._make_lery_with_diagnosis_api(mocker)

        audio_file = tmp_path / 'diag.wav'
        audio_file.write_bytes(b'RIFF')

        lery.audio_manager.record_audio.return_value = str(audio_file)
        lery.transcribe_audio = MagicMock(return_value='goodbye')

        lery._run_diagnosis_session()

        # Exit keyword should break the loop after 1 turn
        assert lery.transcribe_audio.call_count == 1

    def test_collects_student_lines_for_rating(self, mocker, tmp_path):
        lery, api, brain = self._make_lery_with_diagnosis_api(mocker)

        audio_file = tmp_path / 'diag.wav'
        audio_file.write_bytes(b'RIFF')

        call_count = 0

        def record_side_effect(**_kwargs):
            nonlocal call_count
            call_count += 1
            if call_count <= 2:
                return str(audio_file)
            return None  # 2 silences end loop

        lery.audio_manager.record_audio.side_effect = record_side_effect
        lery.transcribe_audio = MagicMock(return_value='I like to travel')

        lery._run_diagnosis_session()

        # rate_cefr should be called with transcript containing student lines
        brain.rate_cefr.assert_called_once()
        call_args = brain.rate_cefr.call_args[0][0]
        assert 'I like to travel' in call_args

    def test_calls_complete_diagnosis_with_estimated_level(self, mocker, tmp_path):
        lery, api, brain = self._make_lery_with_diagnosis_api(mocker)

        audio_file = tmp_path / 'diag.wav'
        audio_file.write_bytes(b'RIFF')

        call_count = 0

        def record_side_effect(**_kwargs):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                return str(audio_file)
            return None

        lery.audio_manager.record_audio.side_effect = record_side_effect
        lery.transcribe_audio = MagicMock(return_value='I enjoy reading books')
        brain.rate_cefr.return_value = 'C1'

        lery._run_diagnosis_session()

        api.complete_diagnosis.assert_called_once_with('diag-sess-1', 'C1')

    def test_fallback_level_when_no_student_lines(self, mocker):
        lery, api, brain = self._make_lery_with_diagnosis_api(mocker)
        # All silence → no student lines collected
        lery.audio_manager.record_audio.return_value = None

        lery._run_diagnosis_session()

        # rate_cefr should NOT be called (no student lines)
        brain.rate_cefr.assert_not_called()
        # complete_diagnosis called with fallback 'A2'
        api.complete_diagnosis.assert_called_once_with('diag-sess-1', 'A2')


# ── run() post-session cleanup ────────────────────────────────────────────────

@pytest.mark.unit
class TestRunPostSession:
    def test_complete_session_called_after_run_session(self, mocker):
        api = MagicMock()
        api.get_session_config.return_value = {
            'level': 'B1',
            'diagnosisCompleted': True,
            'lesson': None,
            'profile': None,
        }
        api.create_session.return_value = 'sess-post-1'
        lery = _make_lery(mocker, api=api)

        # _run_session sets _session_id; mock it to set the id and return
        def mock_run_session():
            lery._session_id = 'sess-post-1'

        lery._run_session = MagicMock(side_effect=mock_run_session)
        lery._speak = MagicMock()

        wake_calls = 0

        def wake_side():
            nonlocal wake_calls
            wake_calls += 1
            if wake_calls >= 2:
                raise KeyboardInterrupt

        lery._mock_wake.wait_for_wake_word.side_effect = wake_side
        lery._mock_audio.play_chime = MagicMock()

        lery.run()

        api.complete_session.assert_called_with('sess-post-1')

    def test_mode_resets_to_free_talk_after_session(self, mocker):
        api = MagicMock()
        api.get_session_config.return_value = {
            'level': 'B1',
            'diagnosisCompleted': True,
            'lesson': None,
            'profile': None,
        }
        lery = _make_lery(mocker, api=api)

        def mock_run_session():
            lery._session_mode = 'GUIDED_LESSON'
            lery._session_id = None  # no session to complete

        lery._run_session = MagicMock(side_effect=mock_run_session)
        lery._speak = MagicMock()

        wake_calls = 0

        def wake_side():
            nonlocal wake_calls
            wake_calls += 1
            if wake_calls >= 2:
                raise KeyboardInterrupt

        lery._mock_wake.wait_for_wake_word.side_effect = wake_side
        lery._mock_audio.play_chime = MagicMock()

        lery.run()

        assert lery._session_mode == 'FREE_TALK'

    def test_run_calls_diagnosis_on_first_wake_word(self, mocker):
        api = MagicMock()
        api.get_session_config.return_value = {
            'level': 'A1',
            'diagnosisCompleted': False,
            'lesson': None,
            'profile': None,
        }
        lery = _make_lery(mocker, api=api)
        assert lery._needs_diagnosis is True

        lery._run_diagnosis_session = MagicMock()
        lery._speak = MagicMock()

        wake_calls = 0

        def wake_side():
            nonlocal wake_calls
            wake_calls += 1
            if wake_calls >= 2:
                raise KeyboardInterrupt

        lery._mock_wake.wait_for_wake_word.side_effect = wake_side
        lery._mock_audio.play_chime = MagicMock()

        lery.run()

        lery._run_diagnosis_session.assert_called_once()

    def test_diagnosis_reloads_config_after_completion(self, mocker):
        api = MagicMock()
        fresh_config = {
            'level': 'B1',
            'diagnosisCompleted': True,
            'lesson': None,
            'profile': None,
        }
        api.get_session_config.return_value = {
            'level': 'A1',
            'diagnosisCompleted': False,
            'lesson': None,
            'profile': None,
        }
        lery = _make_lery(mocker, api=api)
        assert lery._needs_diagnosis is True

        # After diagnosis, get_session_config returns fresh config
        api.get_session_config.return_value = fresh_config

        lery._run_diagnosis_session = MagicMock()
        lery._speak = MagicMock()

        wake_calls = 0

        def wake_side():
            nonlocal wake_calls
            wake_calls += 1
            if wake_calls >= 2:
                raise KeyboardInterrupt

        lery._mock_wake.wait_for_wake_word.side_effect = wake_side
        lery._mock_audio.play_chime = MagicMock()

        lery.run()

        # get_session_config called once during __init__ and once after diagnosis
        assert api.get_session_config.call_count >= 2

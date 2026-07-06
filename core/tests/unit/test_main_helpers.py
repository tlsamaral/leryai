import sys
import os
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src'))

# Import pure helper functions — no LLM, no hardware, no network
from main import (
    _matches_keywords,
    _matches_lesson_intent,
    _build_diagnosis_prompt,
    _build_free_talk_prompt,
    _RESPONSE_LIMITS,
    _EXIT_KEYWORDS,
    _LESSON_TRIGGER_WORDS,
    _LESSON_ACTION_WORDS,
)


# ── _matches_keywords ─────────────────────────────────────────────────────────

@pytest.mark.unit
class TestMatchesKeywords:
    def test_exact_match(self):
        assert _matches_keywords('goodbye', _EXIT_KEYWORDS) is True

    def test_case_insensitive(self):
        assert _matches_keywords('GOODBYE', _EXIT_KEYWORDS) is True

    def test_keyword_within_sentence(self):
        assert _matches_keywords("I think I'm done for today", _EXIT_KEYWORDS) is True

    def test_no_match(self):
        assert _matches_keywords('hello there', _EXIT_KEYWORDS) is False

    def test_portuguese_exit_keyword(self):
        assert _matches_keywords('tchau!', _EXIT_KEYWORDS) is True

    def test_empty_string_no_match(self):
        assert _matches_keywords('', _EXIT_KEYWORDS) is False


# ── _matches_lesson_intent ────────────────────────────────────────────────────

@pytest.mark.unit
class TestMatchesLessonIntent:
    def test_start_lesson(self):
        assert _matches_lesson_intent('let us start the lesson') is True

    def test_begin_lesson_variant(self):
        assert _matches_lesson_intent('begin lesson please') is True

    def test_portuguese_variant(self):
        assert _matches_lesson_intent('quero começar a aula') is True

    def test_trigger_word_only_no_action(self):
        assert _matches_lesson_intent('I have a lesson tomorrow') is False

    def test_action_word_only_no_trigger(self):
        assert _matches_lesson_intent('let us start something') is False

    def test_case_insensitive(self):
        assert _matches_lesson_intent('START LESSON') is True

    def test_empty_string(self):
        assert _matches_lesson_intent('') is False


# ── _build_diagnosis_prompt ───────────────────────────────────────────────────

@pytest.mark.unit
class TestBuildDiagnosisPrompt:
    def test_returns_non_empty_string(self):
        prompt = _build_diagnosis_prompt()
        assert isinstance(prompt, str)
        assert len(prompt) > 0

    def test_contains_diagnosis_mode(self):
        assert 'DIAGNOSIS' in _build_diagnosis_prompt()

    def test_instructs_not_to_reveal_cefr(self):
        assert 'CEFR' not in _build_diagnosis_prompt() or \
               'Do NOT mention levels' in _build_diagnosis_prompt()

    def test_contains_lery_identity(self):
        assert 'Lery' in _build_diagnosis_prompt()

    def test_max_2_sentences_constraint(self):
        assert '2 sentences' in _build_diagnosis_prompt()


# ── _build_free_talk_prompt ───────────────────────────────────────────────────

@pytest.mark.unit
class TestBuildFreeTalkPrompt:
    def test_returns_none_when_config_is_none(self):
        assert _build_free_talk_prompt(None) is None

    def test_contains_level(self):
        prompt = _build_free_talk_prompt({'level': 'B2', 'profile': None})
        assert 'B2' in prompt

    def test_contains_level_rule_for_a1(self):
        prompt = _build_free_talk_prompt({'level': 'A1', 'profile': None})
        assert 'A1' in prompt
        assert 'beginner' in prompt.lower()

    def test_all_cefr_levels_produce_prompt(self):
        for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
            result = _build_free_talk_prompt({'level': level, 'profile': None})
            assert result is not None
            assert level in result

    def test_unknown_level_falls_back(self):
        prompt = _build_free_talk_prompt({'level': 'X9', 'profile': None})
        assert prompt is not None

    def test_includes_occupation_when_set(self):
        config = {
            'level': 'B1',
            'profile': {
                'occupation': 'nurse',
                'interests': [],
                'hobbies': [],
                'learningGoal': None,
                'ageGroup': None,
                'nativeLanguage': None,
            },
        }
        assert 'nurse' in _build_free_talk_prompt(config)

    def test_omits_profile_section_when_empty(self):
        config = {
            'level': 'B1',
            'profile': {
                'occupation': None,
                'interests': [],
                'hobbies': [],
                'learningGoal': None,
                'ageGroup': None,
                'nativeLanguage': None,
            },
        }
        prompt = _build_free_talk_prompt(config)
        assert 'STUDENT PROFILE' not in prompt

    def test_includes_response_limit_from_constants(self):
        prompt = _build_free_talk_prompt({'level': 'A1', 'profile': None})
        assert 'RESPONSE LENGTH' in prompt


# ── _RESPONSE_LIMITS completeness ────────────────────────────────────────────

@pytest.mark.unit
class TestResponseLimits:
    def test_all_cefr_levels_present(self):
        for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
            assert level in _RESPONSE_LIMITS
            assert len(_RESPONSE_LIMITS[level]) > 0

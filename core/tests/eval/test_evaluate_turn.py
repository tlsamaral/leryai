import json
import os
import sys
import time
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent.parent / 'src'))

from tests.helpers.eval_logger import assert_pillar_in_range, log_eval_result

FIXTURES_DIR = Path(__file__).parent.parent / 'fixtures' / 'evaluate_turn'
HAS_API_KEY = bool(os.getenv('GOOGLE_API_KEY'))

PILLARS = ['task_achievement', 'grammar', 'vocabulary', 'fluency']


def load_fixtures():
    return [
        (f.stem, json.loads(f.read_text()))
        for f in sorted(FIXTURES_DIR.glob('*.json'))
    ]


def eval_with_retry(bm, fixture, fixture_name: str):
    """Call evaluate_turn up to 2 times. Raise on second consecutive range failure."""
    inp = fixture['input']
    exp = fixture['expect']

    for attempt in range(2):
        start = time.monotonic()
        result = bm.evaluate_turn(
            user_input=inp['userInput'],
            lery_response=inp['leryResponse'],
            lesson_objectives=inp.get('lessonObjectives') or '',
        )
        latency_ms = (time.monotonic() - start) * 1000

        if result is None:
            continue

        failures = [
            msg for p in PILLARS
            if (msg := assert_pillar_in_range(fixture_name, p, result[p], tuple(exp['pillar_ranges'][p])))
        ]

        if not failures:
            return result, latency_ms

        if attempt == 1:
            model = os.getenv('GEMINI_EVALUATOR_MODEL', 'unknown')
            log_eval_result(fixture_name, model, result, latency_ms, False, '; '.join(failures))
            pytest.fail(f'Eval failed after 2 attempts:\n' + '\n'.join(failures))

    pytest.fail('evaluate_turn returned None on both attempts')


@pytest.fixture(scope='module')
def brain(request):
    if not HAS_API_KEY:
        pytest.skip('GOOGLE_API_KEY not set')
    from brain_manager import BrainManager
    return BrainManager(system_prompt='You are an English tutor.')


@pytest.mark.eval
@pytest.mark.skipif(not HAS_API_KEY, reason='GOOGLE_API_KEY not set')
@pytest.mark.parametrize('fixture_name,fixture', load_fixtures())
def test_evaluate_turn_fixture(brain, fixture_name, fixture):
    exp = fixture['expect']
    result, latency_ms = eval_with_retry(brain, fixture, fixture_name)
    model = os.getenv('GEMINI_EVALUATOR_MODEL', 'unknown')

    # Pillar ranges
    for p in PILLARS:
        lo, hi = exp['pillar_ranges'][p]
        assert lo <= result[p] <= hi, f'{fixture_name} — {p}: expected [{lo},{hi}], got {result[p]}'

    # Total score range
    assert exp['total_score_min'] <= result['total_score'] <= exp['total_score_max'], \
        f"total_score {result['total_score']} out of range [{exp['total_score_min']},{exp['total_score_max']}]"

    # total_score invariant
    computed = sum(result[p] for p in PILLARS)
    assert result['total_score'] == computed, f'total_score {result["total_score"]} != sum {computed}'

    # grammatical_fixes
    if exp['grammatical_fixes_not_empty']:
        assert result['grammatical_fixes'].strip()
        assert result['grammatical_fixes'] != 'No corrections needed.'

    # reasoning word count
    assert len(result['reasoning'].split()) >= exp['reasoning_min_words']

    log_eval_result(fixture_name, model, result, latency_ms, True)

import os
import sys
import time
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent.parent / 'src'))

from tests.helpers.eval_logger import log_eval_result

FIXTURES_DIR = Path(__file__).parent.parent / 'fixtures' / 'rate_cefr'
HAS_API_KEY = bool(os.getenv('GOOGLE_API_KEY'))

# Accept one band of deviation — real speech is ambiguous at level boundaries
CASES = [
    ('a1_transcript.txt', 'A1', {'A1', 'A2'}),
    ('b2_transcript.txt', 'B2', {'B1', 'B2', 'C1'}),
    ('c1_transcript.txt', 'C1', {'B2', 'C1', 'C2'}),
]


@pytest.fixture(scope='module')
def brain():
    if not HAS_API_KEY:
        pytest.skip('GOOGLE_API_KEY not set')
    from brain_manager import BrainManager
    return BrainManager(system_prompt='You are an English tutor.')


@pytest.mark.eval
@pytest.mark.skipif(not HAS_API_KEY, reason='GOOGLE_API_KEY not set')
@pytest.mark.parametrize('filename,expected_level,acceptable_levels', CASES)
def test_rate_cefr_fixture(brain, filename, expected_level, acceptable_levels):
    transcript = (FIXTURES_DIR / filename).read_text()
    model = os.getenv('GEMINI_EVALUATOR_MODEL', 'unknown')

    # One retry on unexpected result
    result = None
    for attempt in range(2):
        start = time.monotonic()
        result = brain.rate_cefr(transcript)
        latency_ms = (time.monotonic() - start) * 1000

        if result in acceptable_levels:
            log_eval_result(
                fixture=filename,
                model=model,
                scores={'estimated_cefr': result},
                latency_ms=latency_ms,
                passed=True,
            )
            break

        if attempt == 1:
            log_eval_result(
                fixture=filename,
                model=model,
                scores={'estimated_cefr': result},
                latency_ms=latency_ms,
                passed=False,
                failure_reason=f'expected one of {acceptable_levels}, got {result}',
            )
            pytest.fail(
                f'{filename}: expected level in {acceptable_levels}, got {result!r}'
            )

    assert result in acceptable_levels

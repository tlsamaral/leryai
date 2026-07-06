import os
import re
import sys
import time
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent.parent / 'src'))

HAS_API_KEY = bool(os.getenv('GOOGLE_API_KEY'))

SMOKE_CASES = [
    {
        'name': 'a1_response_length',
        'system_prompt': (
            'You are Lery, an English tutor. The student is A1 (complete beginner). '
            'RESPONSE LENGTH — HARD LIMIT: 1 sentence only. Maximum 8 words. Then ask ONE yes/no question.'
        ),
        'user_input': 'Hello! My name is Ana.',
        'expect': {
            'non_empty': True,
            'max_sentences': 3,
        },
    },
    {
        'name': 'b2_engagement',
        'system_prompt': (
            'You are Lery, an English tutor. The student is B2. '
            'Always end your reply with a question.'
        ),
        'user_input': "I've been reading a lot about climate change lately.",
        'expect': {
            'non_empty': True,
            'ends_with_question': True,
        },
    },
]


@pytest.fixture(scope='module')
def make_brain():
    if not HAS_API_KEY:
        pytest.skip('GOOGLE_API_KEY not set')
    from brain_manager import BrainManager
    def factory(system_prompt: str):
        return BrainManager(system_prompt=system_prompt)
    return factory


@pytest.mark.eval
@pytest.mark.skipif(not HAS_API_KEY, reason='GOOGLE_API_KEY not set')
@pytest.mark.parametrize('case', SMOKE_CASES, ids=[c['name'] for c in SMOKE_CASES])
def test_generate_response_smoke(make_brain, case):
    brain = make_brain(case['system_prompt'])
    exp = case['expect']

    start = time.monotonic()
    response = brain.generate_response(case['user_input'])
    latency_ms = (time.monotonic() - start) * 1000

    # Non-empty
    if exp.get('non_empty'):
        assert response.strip(), 'Response is empty'
        assert response != "I'm sorry, I'm having trouble thinking right now.", \
            'Response is fallback error string'

    # Max sentences (rough split)
    if 'max_sentences' in exp:
        sentences = [s.strip() for s in re.split(r'[.!?]+', response) if s.strip()]
        assert len(sentences) <= exp['max_sentences'], \
            f'Too many sentences: {len(sentences)} > {exp["max_sentences"]}\nResponse: {response}'

    # Ends with question mark
    if exp.get('ends_with_question'):
        assert '?' in response, f'Response has no question mark:\n{response}'

    # Latency
    assert latency_ms < 60_000

    print(f'\n[{case["name"]}] {latency_ms:.0f}ms: {response!r}')

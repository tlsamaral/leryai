import sys
import os
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src'))

from unittest.mock import MagicMock, patch

import tts_manager
from tts_manager import (
    _select_provider, _split_segments, _strip_pt_tags, create_tts_provider,
    CachingTTSProvider, EdgeTTSProvider, ElevenLabsProvider, GTTSProvider, OpenAITTSProvider,
)


@pytest.mark.unit
class TestStripPtTags:
    def test_removes_pt_tags_preserves_content(self):
        result = _strip_pt_tags('[PT]Olá mundo[/PT]')
        assert result == 'Olá mundo'

    def test_removes_tags_leaves_english(self):
        result = _strip_pt_tags('Hello [PT]mundo[/PT] friend')
        assert result == 'Hello mundo friend'

    def test_removes_markdown_bold(self):
        result = _strip_pt_tags('**bold** text')
        assert result == 'bold text'

    def test_removes_markdown_italic(self):
        result = _strip_pt_tags('_italic_ text')
        assert result == 'italic text'

    def test_empty_string(self):
        assert _strip_pt_tags('') == ''

    def test_no_tags_passthrough(self):
        result = _strip_pt_tags('plain english')
        assert result == 'plain english'

    def test_strips_surrounding_whitespace(self):
        result = _strip_pt_tags('  hello  ')
        assert result == 'hello'

    def test_multiline_pt_tag(self):
        result = _strip_pt_tags('[PT]linha um\nlinha dois[/PT]')
        assert 'linha um' in result
        assert 'linha dois' in result


@pytest.mark.unit
class TestCreateTtsProvider:
    def test_returns_gtts_when_no_eleven_key_and_no_edge(self, monkeypatch):
        monkeypatch.delenv('ELEVEN_API_KEY', raising=False)
        monkeypatch.setattr(tts_manager, '_edge_available', lambda: False)
        provider = _select_provider()
        assert isinstance(provider, GTTSProvider)

    def test_returns_elevenlabs_when_key_set(self, monkeypatch):
        monkeypatch.setenv('ELEVEN_API_KEY', 'test-key')
        monkeypatch.setenv('ELEVEN_VOICE_ID', 'voice-123')
        provider = _select_provider()
        assert isinstance(provider, ElevenLabsProvider)


@pytest.mark.unit
class TestOpenAIProviderSelection:
    def test_explicit_openai_choice(self, monkeypatch):
        monkeypatch.setenv('LERY_TTS_PROVIDER', 'openai')
        monkeypatch.setenv('OPENAI_API_KEY', 'sk-test')
        monkeypatch.setenv('LERY_OPENAI_VOICE', 'nova')
        provider = _select_provider()
        assert isinstance(provider, OpenAITTSProvider)
        assert provider.voice == 'nova'

    def test_explicit_openai_wins_over_elevenlabs_key(self, monkeypatch):
        monkeypatch.setenv('LERY_TTS_PROVIDER', 'openai')
        monkeypatch.setenv('OPENAI_API_KEY', 'sk-test')
        monkeypatch.setenv('ELEVEN_API_KEY', 'eleven-key')
        assert isinstance(_select_provider(), OpenAITTSProvider)

    def test_openai_choice_without_key_falls_back_to_gtts(self, monkeypatch):
        monkeypatch.setenv('LERY_TTS_PROVIDER', 'openai')
        monkeypatch.delenv('OPENAI_API_KEY', raising=False)
        assert isinstance(_select_provider(), GTTSProvider)

    def test_explicit_gtts_ignores_eleven_key(self, monkeypatch):
        monkeypatch.setenv('LERY_TTS_PROVIDER', 'gtts')
        monkeypatch.setenv('ELEVEN_API_KEY', 'eleven-key')
        assert isinstance(_select_provider(), GTTSProvider)

    def test_explicit_elevenlabs_without_key_falls_back_to_gtts(self, monkeypatch):
        monkeypatch.setenv('LERY_TTS_PROVIDER', 'elevenlabs')
        monkeypatch.delenv('ELEVEN_API_KEY', raising=False)
        assert isinstance(_select_provider(), GTTSProvider)


def _fake_openai(write=b'mp3'):
    """Patches openai.OpenAI so streaming speech.create writes `write` to the target file."""
    response = MagicMock()
    response.stream_to_file.side_effect = lambda path: open(path, 'wb').write(write)
    cm = MagicMock()
    cm.__enter__.return_value = response
    client = MagicMock()
    client.audio.speech.with_streaming_response.create.return_value = cm
    return patch('openai.OpenAI', return_value=client), client


@pytest.mark.unit
class TestOpenAITTSProvider:
    def test_synthesizes_single_mp3_with_tags_stripped(self, tmp_path):
        patcher, client = _fake_openai()
        with patcher:
            files = OpenAITTSProvider('sk-test', voice='coral').synthesize(
                'Hello [PT]tudo bem[/PT]?', output_dir=str(tmp_path)
            )
        assert files == [str(tmp_path / 'output_0.mp3')]
        kwargs = client.audio.speech.with_streaming_response.create.call_args.kwargs
        assert kwargs['input'] == 'Hello tudo bem?'
        assert kwargs['voice'] == 'coral'
        assert kwargs['response_format'] == 'mp3'

    def test_sends_instructions_to_gpt4o_models(self, tmp_path):
        patcher, client = _fake_openai()
        with patcher:
            OpenAITTSProvider('sk-test', model='gpt-4o-mini-tts').synthesize('Hi', str(tmp_path))
        assert 'instructions' in client.audio.speech.with_streaming_response.create.call_args.kwargs

    def test_omits_instructions_for_tts1(self, tmp_path):
        patcher, client = _fake_openai()
        with patcher:
            OpenAITTSProvider('sk-test', model='tts-1').synthesize('Hi', str(tmp_path))
        assert 'instructions' not in client.audio.speech.with_streaming_response.create.call_args.kwargs

    def test_empty_text_returns_no_files_and_makes_no_request(self, tmp_path):
        patcher, client = _fake_openai()
        with patcher:
            assert OpenAITTSProvider('sk-test').synthesize('  ', str(tmp_path)) == []
        client.audio.speech.with_streaming_response.create.assert_not_called()

    def test_error_falls_back_to_gtts(self, tmp_path):
        provider = OpenAITTSProvider('sk-test')
        provider._fallback = MagicMock()
        provider._fallback.synthesize.return_value = ['gtts.mp3']
        with patch('openai.OpenAI', side_effect=RuntimeError('quota')):
            assert provider.synthesize('Hello', str(tmp_path)) == ['gtts.mp3']
        provider._fallback.synthesize.assert_called_once()


def _no_free_fallback(monkeypatch):
    monkeypatch.setattr(tts_manager, '_edge_available', lambda: False)


@pytest.mark.unit
class TestEdgeSelection:
    def test_default_without_keys_is_edge_when_installed(self, monkeypatch):
        monkeypatch.delenv('ELEVEN_API_KEY', raising=False)
        monkeypatch.setattr(tts_manager, '_edge_available', lambda: True)
        assert isinstance(_select_provider(), EdgeTTSProvider)

    def test_elevenlabs_key_still_wins_when_unset(self, monkeypatch):
        monkeypatch.setenv('ELEVEN_API_KEY', 'k')
        monkeypatch.setattr(tts_manager, '_edge_available', lambda: True)
        assert isinstance(_select_provider(), ElevenLabsProvider)

    def test_explicit_edge_ignores_eleven_key_and_reads_voice_env(self, monkeypatch):
        monkeypatch.setenv('LERY_TTS_PROVIDER', 'edge')
        monkeypatch.setenv('ELEVEN_API_KEY', 'k')
        monkeypatch.setenv('LERY_EDGE_VOICE_EN', 'en-GB-SoniaNeural')
        monkeypatch.setenv('LERY_EDGE_RATE', '-15%')
        monkeypatch.setattr(tts_manager, '_edge_available', lambda: True)
        provider = _select_provider()
        assert isinstance(provider, EdgeTTSProvider)
        assert (provider.voice_en, provider.rate) == ('en-GB-SoniaNeural', '-15%')

    def test_explicit_edge_not_installed_falls_back_to_gtts(self, monkeypatch):
        monkeypatch.setenv('LERY_TTS_PROVIDER', 'edge')
        _no_free_fallback(monkeypatch)
        assert isinstance(_select_provider(), GTTSProvider)

    def test_paid_providers_fall_back_to_edge_when_installed(self, monkeypatch):
        monkeypatch.setattr(tts_manager, '_edge_available', lambda: True)
        assert isinstance(ElevenLabsProvider('k', 'v')._fallback, EdgeTTSProvider)
        assert isinstance(OpenAITTSProvider('k')._fallback, EdgeTTSProvider)

    def test_paid_providers_fall_back_to_gtts_otherwise(self, monkeypatch):
        _no_free_fallback(monkeypatch)
        assert isinstance(ElevenLabsProvider('k', 'v')._fallback, GTTSProvider)


@pytest.mark.unit
class TestSplitSegments:
    def test_splits_languages(self):
        assert _split_segments('Hello [PT]tudo bem[/PT] friend') == [
            ('en', 'Hello'), ('pt', 'tudo bem'), ('en', 'friend'),
        ]

    def test_strips_markdown_and_empty_parts(self):
        assert _split_segments('**Hi**  ') == [('en', 'Hi')]
        assert _split_segments('   ') == []


class _FakeEdge:
    """Stands in for the edge_tts module; records calls and writes a tiny file."""

    def __init__(self, fail=False):
        self.calls = []
        self.fail = fail

    def Communicate(self, text, voice, rate=None):
        outer = self

        class _C:
            async def save(self, path):
                outer.calls.append((text, voice, rate))
                if outer.fail:
                    raise RuntimeError('boom')
                open(path, 'wb').write(b'mp3')

        return _C()


@pytest.mark.unit
class TestEdgeProvider:
    def test_renders_each_segment_with_its_voice(self, tmp_path, monkeypatch):
        fake = _FakeEdge()
        monkeypatch.setitem(__import__('sys').modules, 'edge_tts', fake)
        provider = EdgeTTSProvider(voice_en='EN', voice_pt='PT', rate='-5%')

        files = provider.synthesize('Hello [PT]tudo bem[/PT]', str(tmp_path))

        assert [os.path.basename(f) for f in files] == ['output_0.mp3', 'output_1.mp3']
        assert fake.calls == [('Hello', 'EN', '-5%'), ('tudo bem', 'PT', '-5%')]
        assert provider.fell_back is False

    def test_error_falls_back_and_flags_it(self, tmp_path, monkeypatch):
        monkeypatch.setitem(__import__('sys').modules, 'edge_tts', _FakeEdge(fail=True))
        provider = EdgeTTSProvider()
        provider._fallback = MagicMock()
        provider._fallback.synthesize.return_value = ['gtts.mp3']

        assert provider.synthesize('Hello', str(tmp_path)) == ['gtts.mp3']
        assert provider.fell_back is True

    def test_empty_text(self, tmp_path):
        assert EdgeTTSProvider().synthesize('  ', str(tmp_path)) == []

    def test_cache_id_changes_with_voice(self):
        assert EdgeTTSProvider(voice_en='A').cache_id != EdgeTTSProvider(voice_en='B').cache_id


class _CountingProvider(tts_manager.TTSProvider):
    def __init__(self, cache_id='fake:v1'):
        self._id = cache_id
        self.calls = 0
        self.fail_over = False

    @property
    def cache_id(self):
        return self._id

    def synthesize(self, text, output_dir='data/audio'):
        self.calls += 1
        self.fell_back = self.fail_over
        os.makedirs(output_dir, exist_ok=True)
        path = os.path.join(output_dir, 'output_0.mp3')
        open(path, 'wb').write(f'audio-{self.calls}'.encode())
        return [path]


@pytest.mark.unit
class TestCachingProvider:
    def _make(self, tmp_path, **kw):
        inner = _CountingProvider(**{k: v for k, v in kw.items() if k == 'cache_id'})
        cache = CachingTTSProvider(inner, cache_dir=str(tmp_path / 'cache'), max_chars=kw.get('max_chars', 80))
        return inner, cache

    def test_second_call_is_served_from_cache(self, tmp_path):
        inner, cache = self._make(tmp_path)
        first = cache.synthesize('Hey!', str(tmp_path / 'out'))
        second = cache.synthesize('Hey!', str(tmp_path / 'out'))
        assert inner.calls == 1
        assert first == second
        assert open(second[0], 'rb').read() == b'audio-1'

    def test_cached_file_survives_output_dir_being_overwritten(self, tmp_path):
        inner, cache = self._make(tmp_path)
        cached = cache.synthesize('Hey!', str(tmp_path / 'out'))
        cache.synthesize('A different and fresh sentence', str(tmp_path / 'out'))  # overwrites output_0.mp3
        assert open(cached[0], 'rb').read() == b'audio-1'

    def test_long_text_bypasses_cache(self, tmp_path):
        inner, cache = self._make(tmp_path, max_chars=10)
        cache.synthesize('This sentence is much longer than ten chars', str(tmp_path / 'out'))
        cache.synthesize('This sentence is much longer than ten chars', str(tmp_path / 'out'))
        assert inner.calls == 2
        assert not (tmp_path / 'cache').exists()

    def test_fallback_audio_is_not_cached(self, tmp_path):
        inner, cache = self._make(tmp_path)
        inner.fail_over = True
        cache.synthesize('Hey!', str(tmp_path / 'out'))
        inner.fail_over = False
        cache.synthesize('Hey!', str(tmp_path / 'out'))
        assert inner.calls == 2  # the good voice was asked again, not stuck on the fallback

    def test_different_voice_does_not_share_entries(self, tmp_path):
        cache_dir = str(tmp_path / 'cache')
        a, b = _CountingProvider('voice:A'), _CountingProvider('voice:B')
        CachingTTSProvider(a, cache_dir).synthesize('Hey!', str(tmp_path / 'out'))
        CachingTTSProvider(b, cache_dir).synthesize('Hey!', str(tmp_path / 'out'))
        assert (a.calls, b.calls) == (1, 1)

    def test_multi_segment_audio_keeps_order(self, tmp_path):
        class Multi(_CountingProvider):
            def synthesize(self, text, output_dir='data/audio'):
                self.calls += 1
                os.makedirs(output_dir, exist_ok=True)
                files = []
                for i in range(11):  # >10 so a naive string sort would misorder
                    path = os.path.join(output_dir, f'output_{i}.mp3')
                    open(path, 'wb').write(str(i).encode())
                    files.append(path)
                return files

        cache = CachingTTSProvider(Multi(), cache_dir=str(tmp_path / 'cache'))
        cache.synthesize('Hi', str(tmp_path / 'out'))
        hit = cache.synthesize('Hi', str(tmp_path / 'out'))
        assert [open(f, 'rb').read() for f in hit] == [str(i).encode() for i in range(11)]


@pytest.mark.unit
class TestFactoryWrapsWithCache:
    def test_wrapped_by_default(self, monkeypatch):
        monkeypatch.delenv('ELEVEN_API_KEY', raising=False)
        assert isinstance(create_tts_provider(), CachingTTSProvider)

    def test_cache_can_be_disabled(self, monkeypatch):
        monkeypatch.delenv('ELEVEN_API_KEY', raising=False)
        monkeypatch.setenv('LERY_TTS_CACHE', '0')
        assert not isinstance(create_tts_provider(), CachingTTSProvider)

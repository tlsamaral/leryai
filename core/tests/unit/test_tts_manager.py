import sys
import os
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src'))

from unittest.mock import MagicMock, patch

from tts_manager import (
    _strip_pt_tags, create_tts_provider, GTTSProvider, ElevenLabsProvider, OpenAITTSProvider,
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
    def test_returns_gtts_when_no_eleven_key(self, monkeypatch):
        monkeypatch.delenv('ELEVEN_API_KEY', raising=False)
        provider = create_tts_provider()
        assert isinstance(provider, GTTSProvider)

    def test_returns_elevenlabs_when_key_set(self, monkeypatch):
        monkeypatch.setenv('ELEVEN_API_KEY', 'test-key')
        monkeypatch.setenv('ELEVEN_VOICE_ID', 'voice-123')
        provider = create_tts_provider()
        assert isinstance(provider, ElevenLabsProvider)


@pytest.mark.unit
class TestOpenAIProviderSelection:
    def test_explicit_openai_choice(self, monkeypatch):
        monkeypatch.setenv('LERY_TTS_PROVIDER', 'openai')
        monkeypatch.setenv('OPENAI_API_KEY', 'sk-test')
        monkeypatch.setenv('LERY_OPENAI_VOICE', 'nova')
        provider = create_tts_provider()
        assert isinstance(provider, OpenAITTSProvider)
        assert provider.voice == 'nova'

    def test_explicit_openai_wins_over_elevenlabs_key(self, monkeypatch):
        monkeypatch.setenv('LERY_TTS_PROVIDER', 'openai')
        monkeypatch.setenv('OPENAI_API_KEY', 'sk-test')
        monkeypatch.setenv('ELEVEN_API_KEY', 'eleven-key')
        assert isinstance(create_tts_provider(), OpenAITTSProvider)

    def test_openai_choice_without_key_falls_back_to_gtts(self, monkeypatch):
        monkeypatch.setenv('LERY_TTS_PROVIDER', 'openai')
        monkeypatch.delenv('OPENAI_API_KEY', raising=False)
        assert isinstance(create_tts_provider(), GTTSProvider)

    def test_explicit_gtts_ignores_eleven_key(self, monkeypatch):
        monkeypatch.setenv('LERY_TTS_PROVIDER', 'gtts')
        monkeypatch.setenv('ELEVEN_API_KEY', 'eleven-key')
        assert isinstance(create_tts_provider(), GTTSProvider)

    def test_explicit_elevenlabs_without_key_falls_back_to_gtts(self, monkeypatch):
        monkeypatch.setenv('LERY_TTS_PROVIDER', 'elevenlabs')
        monkeypatch.delenv('ELEVEN_API_KEY', raising=False)
        assert isinstance(create_tts_provider(), GTTSProvider)


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

import sys
import os
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src'))

from tts_manager import _strip_pt_tags, create_tts_provider, GTTSProvider, ElevenLabsProvider


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

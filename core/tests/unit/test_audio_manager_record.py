import sys
import os
import numpy as np
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src'))


@pytest.fixture
def audio_mgr(mocker):
    mocker.patch('audio_manager.pygame.mixer.init')
    from audio_manager import AudioManager
    # sample_rate=1024 → chunks_per_second=1 → easy math
    return AudioManager(sample_rate=1024)


def silent_chunk(chunk_size: int = 1024) -> tuple:
    return (np.zeros((chunk_size, 1), dtype='int16'), False)


def loud_chunk(chunk_size: int = 1024, amplitude: int = 1500) -> tuple:
    data = np.full((chunk_size, 1), amplitude, dtype='int16')
    return (data, False)


def make_stream(mocker, chunks: list):
    """Context-manager-compatible mock stream that returns chunks in sequence."""
    mock_stream = mocker.MagicMock()
    mock_stream.read.side_effect = chunks
    mock_stream.__enter__ = mocker.MagicMock(return_value=mock_stream)
    mock_stream.__exit__ = mocker.MagicMock(return_value=False)
    return mock_stream


@pytest.mark.unit
class TestRecordAudio:
    def test_returns_none_when_no_speech_within_wait_window(self, audio_mgr, mocker, tmp_path):
        # sample_rate=1024, chunk_size=1024 → chunks_per_second=1
        # max_wait_seconds=8 → max_wait_chunks=8
        # Need 9+ silent chunks to trigger "no speech" return
        chunks = [silent_chunk() for _ in range(10)]
        stream = make_stream(mocker, chunks)
        mocker.patch('audio_manager.sd.InputStream', return_value=stream)
        result = audio_mgr.record_audio(
            output_filename=str(tmp_path / 'audio' / 'input.wav'),
            max_wait_seconds=8,
        )
        assert result is None

    def test_returns_filename_after_speech_then_silence(self, audio_mgr, mocker, tmp_path):
        # 3 loud chunks (speech), then 3 silent (post-speech silence > silence_duration=2s)
        chunks = [loud_chunk() for _ in range(3)] + [silent_chunk() for _ in range(3)]
        stream = make_stream(mocker, chunks)
        mocker.patch('audio_manager.sd.InputStream', return_value=stream)
        output = str(tmp_path / 'output.wav')
        result = audio_mgr.record_audio(
            output_filename=output,
            silence_duration=2.0,
        )
        assert result == output

    def test_creates_output_directory(self, audio_mgr, mocker, tmp_path):
        chunks = [loud_chunk() for _ in range(3)] + [silent_chunk() for _ in range(3)]
        stream = make_stream(mocker, chunks)
        mocker.patch('audio_manager.sd.InputStream', return_value=stream)
        nested = str(tmp_path / 'deep' / 'nested' / 'audio.wav')
        audio_mgr.record_audio(output_filename=nested, silence_duration=2.0)
        assert os.path.exists(os.path.dirname(nested))

    def test_hard_duration_cap_stops_recording(self, audio_mgr, mocker, tmp_path):
        # max_duration_seconds=1 → max_duration_chunks=1 with sample_rate=1024
        # Provide many loud chunks — should stop after cap
        chunks = [loud_chunk() for _ in range(50)]
        stream = make_stream(mocker, chunks)
        mocker.patch('audio_manager.sd.InputStream', return_value=stream)
        output = str(tmp_path / 'capped.wav')
        result = audio_mgr.record_audio(
            output_filename=output,
            max_duration_seconds=1,
        )
        # Stops due to cap, returns filename (speech was detected)
        assert result == output

    def test_no_speech_resets_silence_counter_on_speech(self, audio_mgr, mocker, tmp_path):
        # silent, silent, loud, silent, silent, silent → should NOT return None early
        # because speech was detected before max_wait
        chunks = (
            [silent_chunk(), silent_chunk()]
            + [loud_chunk()]
            + [silent_chunk() for _ in range(3)]
        )
        stream = make_stream(mocker, chunks)
        mocker.patch('audio_manager.sd.InputStream', return_value=stream)
        output = str(tmp_path / 'test.wav')
        result = audio_mgr.record_audio(output_filename=output, silence_duration=2.0, max_wait_seconds=8)
        assert result == output

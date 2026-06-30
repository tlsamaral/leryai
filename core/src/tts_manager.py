import os
import re
import time
from abc import ABC, abstractmethod
from typing import List


def _strip_pt_tags(text: str) -> str:
    """Remove [PT]...[/PT] tags, preserving content. Strip markdown symbols."""
    text = re.sub(r"\[PT\](.*?)\[/PT\]", r"\1", text, flags=re.DOTALL)
    text = re.sub(r"[*_]+", "", text)
    return text.strip()


class TTSProvider(ABC):
    @abstractmethod
    def synthesize(self, text: str, output_dir: str = "data/audio") -> List[str]:
        """
        Convert text to audio file(s). Returns list of file paths to play in order.
        text may contain [PT]...[/PT] tags for Portuguese segments.
        """


class Pyttsx3Provider(TTSProvider):
    """
    Offline TTS via pyttsx3 — no network, no rate limits.
    Saves to WAV. Used as fallback when gTTS is rate-limited.
    Does not support per-segment language switching (uses system voice).
    """

    def synthesize(self, text: str, output_dir: str = "data/audio") -> List[str]:
        import pyttsx3
        import subprocess

        clean = _strip_pt_tags(text)
        if not clean:
            return []

        os.makedirs(output_dir, exist_ok=True)
        raw_path = os.path.join(output_dir, "output_offline_raw.wav")
        final_path = os.path.join(output_dir, "output_offline.wav")

        engine = pyttsx3.init()
        engine.setProperty("rate", 165)
        engine.setProperty("volume", 1.0)
        engine.save_to_file(clean, raw_path)
        engine.runAndWait()

        # macOS pyttsx3 saves AIFF — convert to 16-bit PCM WAV via ffmpeg
        proc = subprocess.run(
            ["ffmpeg", "-y", "-i", raw_path,
             "-ar", "44100", "-ac", "1", "-sample_fmt", "s16", final_path],
            capture_output=True,
        )
        if proc.returncode != 0:
            print(f"[pyttsx3] ffmpeg convert failed: {proc.stderr.decode()[:100]}")
            return [raw_path]  # try raw as fallback

        return [final_path]


class GTTSProvider(TTSProvider):
    """
    Google Text-to-Speech (online).
    Splits [PT] segments and renders each in the correct language.
    Falls back to Pyttsx3Provider on rate-limit (429).
    """

    def __init__(self):
        self._offline = Pyttsx3Provider()

    def synthesize(self, text: str, output_dir: str = "data/audio") -> List[str]:
        from gtts import gTTS

        os.makedirs(output_dir, exist_ok=True)
        parts = re.split(r"(\[PT\].*?\[/PT\])", text, flags=re.DOTALL)
        files = []

        for i, part in enumerate(parts):
            if not part.strip():
                continue

            if part.startswith("[PT]") and part.endswith("[/PT]"):
                clean = part.replace("[PT]", "").replace("[/PT]", "").strip()
                lang = "pt"
            else:
                clean = part.strip()
                lang = "en"

            clean = re.sub(r"[*_]+", "", clean)
            if not clean:
                continue

            path = os.path.join(output_dir, f"output_{i}.mp3")
            waits = [5, 15, 30]
            for attempt in range(len(waits) + 1):
                try:
                    gTTS(text=clean, lang=lang).save(path)
                    break
                except Exception as e:
                    if attempt == len(waits):
                        print(f"[gTTS] All retries failed — switching to offline TTS")
                        return self._offline.synthesize(text, output_dir)
                    wait = waits[attempt]
                    print(f"[gTTS] Rate limited, retrying in {wait}s...")
                    time.sleep(wait)
            files.append(path)

        return files


class ElevenLabsProvider(TTSProvider):
    """
    ElevenLabs TTS — eleven_multilingual_v2 handles EN and PT natively.
    Sends the full text (tags stripped) in a single request.
    Falls back to GTTSProvider on any error.
    """

    def __init__(self, api_key: str, voice_id: str):
        self.api_key = api_key
        self.voice_id = voice_id
        self._fallback = GTTSProvider()
        self._offline = Pyttsx3Provider()

    def synthesize(self, text: str, output_dir: str = "data/audio") -> List[str]:
        try:
            from elevenlabs.client import ElevenLabs
            from elevenlabs import save

            clean = _strip_pt_tags(text)
            if not clean:
                return []

            os.makedirs(output_dir, exist_ok=True)
            path = os.path.join(output_dir, "output_0.mp3")

            client = ElevenLabs(api_key=self.api_key)
            audio = client.text_to_speech.convert(
                voice_id=self.voice_id,
                text=clean,
                model_id="eleven_multilingual_v2",
                output_format="mp3_44100_128",
            )
            save(audio, path)
            return [path]

        except Exception as e:
            print(f"[ElevenLabs] Error: {e} — falling back to gTTS")
            return self._fallback.synthesize(text, output_dir)


def create_tts_provider() -> TTSProvider:
    """
    Factory — reads env vars and returns the best available provider.
    Priority: ElevenLabs (if key set) → gTTS (always available).
    """
    api_key = os.getenv("ELEVEN_API_KEY")
    if api_key:
        voice_id = os.getenv("ELEVEN_VOICE_ID", "cgSgspJ2msm6clMCkdW9")
        print(f"[TTS] Using ElevenLabs (voice={voice_id})")
        return ElevenLabsProvider(api_key=api_key, voice_id=voice_id)

    print("[TTS] Using gTTS")
    return GTTSProvider()

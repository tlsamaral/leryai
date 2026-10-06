import asyncio
import glob
import hashlib
import importlib.util
import os
import re
import shutil
import time
from abc import ABC, abstractmethod
from typing import List, Tuple


def _strip_pt_tags(text: str) -> str:
    """Remove [PT]...[/PT] tags, preserving content. Strip markdown symbols."""
    text = re.sub(r"\[PT\](.*?)\[/PT\]", r"\1", text, flags=re.DOTALL)
    text = re.sub(r"[*_]+", "", text)
    return text.strip()


def _split_segments(text: str) -> List[Tuple[str, str]]:
    """Splits text into (lang, clean_text) segments; [PT]...[/PT] marks Portuguese."""
    segments = []
    for part in re.split(r"(\[PT\].*?\[/PT\])", text, flags=re.DOTALL):
        is_pt = part.startswith("[PT]") and part.endswith("[/PT]")
        clean = re.sub(r"[*_]+", "", part.replace("[PT]", "").replace("[/PT]", "")).strip()
        if clean:
            segments.append(("pt" if is_pt else "en", clean))
    return segments


class TTSProvider(ABC):
    # True after a synthesize() that was served by a fallback voice, so callers (the cache) don't
    # keep audio that isn't in the voice that was asked for.
    fell_back = False

    @property
    def cache_id(self) -> str:
        """Identity of the voice — part of the cache key, so changing voice/model invalidates it."""
        return type(self).__name__

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

        self.fell_back = False
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
                        self.fell_back = True
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
        self._fallback = _free_fallback()
        self._offline = Pyttsx3Provider()

    @property
    def cache_id(self) -> str:
        return f"elevenlabs:{self.voice_id}"

    def synthesize(self, text: str, output_dir: str = "data/audio") -> List[str]:
        self.fell_back = False
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
            print(f"[ElevenLabs] Error: {e} — falling back to free voice")
            self.fell_back = True
            return self._fallback.synthesize(text, output_dir)


_DEFAULT_OPENAI_INSTRUCTIONS = (
    "You are a warm, patient English tutor talking to a Brazilian learner. "
    "Speak clearly at a calm, slightly slow pace with natural intonation. "
    "Pronounce English words precisely; read any Portuguese with a natural Brazilian accent."
)


class OpenAITTSProvider(TTSProvider):
    """
    OpenAI TTS — one request per reply, handles EN and PT in the same voice (tags stripped).
    gpt-4o-mini-tts accepts style `instructions`; tts-1 / tts-1-hd don't, so they're only sent
    to gpt-4o* models. Falls back to GTTSProvider on any error.
    """

    def __init__(
        self,
        api_key: str,
        voice: str = "coral",
        model: str = "gpt-4o-mini-tts",
        instructions: str = _DEFAULT_OPENAI_INSTRUCTIONS,
    ):
        self.api_key = api_key
        self.voice = voice
        self.model = model
        self.instructions = instructions
        self._fallback = _free_fallback()

    @property
    def cache_id(self) -> str:
        digest = hashlib.sha256((self.instructions or "").encode()).hexdigest()[:8]
        return f"openai:{self.model}:{self.voice}:{digest}"

    def synthesize(self, text: str, output_dir: str = "data/audio") -> List[str]:
        self.fell_back = False
        clean = _strip_pt_tags(text)
        if not clean:
            return []

        try:
            from openai import OpenAI

            os.makedirs(output_dir, exist_ok=True)
            path = os.path.join(output_dir, "output_0.mp3")

            kwargs = {}
            if self.model.startswith("gpt-4o") and self.instructions:
                kwargs["instructions"] = self.instructions

            client = OpenAI(api_key=self.api_key, timeout=20)
            with client.audio.speech.with_streaming_response.create(
                model=self.model,
                voice=self.voice,
                input=clean,
                response_format="mp3",
                **kwargs,
            ) as response:
                response.stream_to_file(path)
            return [path]

        except Exception as e:
            print(f"[OpenAI TTS] Error: {e} — falling back to free voice")
            self.fell_back = True
            return self._fallback.synthesize(text, output_dir)


class EdgeTTSProvider(TTSProvider):
    """
    Microsoft Edge neural voices via the `edge-tts` package — free, no API key.
    Unofficial endpoint (it can change without notice), so it falls back to gTTS on any error.
    Renders [PT] segments with a Brazilian voice and the rest with the English one.
    """

    DEFAULT_VOICE_EN = "en-US-AvaMultilingualNeural"
    DEFAULT_VOICE_PT = "pt-BR-ThalitaMultilingualNeural"
    DEFAULT_RATE = "-5%"  # slightly slower than natural — easier for learners
    _TIMEOUT_SECONDS = 15

    def __init__(self, voice_en=None, voice_pt=None, rate=None):
        self.voice_en = voice_en or self.DEFAULT_VOICE_EN
        self.voice_pt = voice_pt or self.DEFAULT_VOICE_PT
        self.rate = rate or self.DEFAULT_RATE
        self._fallback = GTTSProvider()

    @property
    def cache_id(self) -> str:
        return f"edge:{self.voice_en}:{self.voice_pt}:{self.rate}"

    async def _render(self, edge_tts, text: str, voice: str, path: str) -> None:
        await asyncio.wait_for(
            edge_tts.Communicate(text, voice, rate=self.rate).save(path),
            timeout=self._TIMEOUT_SECONDS,
        )

    def synthesize(self, text: str, output_dir: str = "data/audio") -> List[str]:
        self.fell_back = False
        segments = _split_segments(text)
        if not segments:
            return []

        try:
            import edge_tts

            os.makedirs(output_dir, exist_ok=True)
            files = []
            for i, (lang, clean) in enumerate(segments):
                path = os.path.join(output_dir, f"output_{i}.mp3")
                voice = self.voice_pt if lang == "pt" else self.voice_en
                asyncio.run(self._render(edge_tts, clean, voice, path))
                files.append(path)
            return files

        except Exception as e:
            print(f"[Edge TTS] Error: {e!r} — falling back to gTTS")
            self.fell_back = True
            return self._fallback.synthesize(text, output_dir)


class CachingTTSProvider(TTSProvider):
    """
    Wraps a provider and keeps the audio of SHORT texts on disk (activation phrases, nudges,
    goodbyes — they repeat in every session). Long replies are unique, so they bypass the cache.
    Audio served by a fallback voice is never cached.
    """

    def __init__(self, inner: TTSProvider, cache_dir: str = "data/audio/cache", max_chars: int = 80):
        self._inner = inner
        self._cache_dir = cache_dir
        self._max_chars = max_chars

    @property
    def cache_id(self) -> str:
        return self._inner.cache_id

    @property
    def fell_back(self) -> bool:
        return self._inner.fell_back

    def synthesize(self, text: str, output_dir: str = "data/audio") -> List[str]:
        if not text.strip() or len(_strip_pt_tags(text)) > self._max_chars:
            return self._inner.synthesize(text, output_dir)

        key = hashlib.sha256(f"{self._inner.cache_id}\n{text}".encode()).hexdigest()[:24]
        hit = sorted(glob.glob(os.path.join(self._cache_dir, f"{key}_*")))
        if hit:
            print(f"[TTS] cache hit: {text[:40]!r}")
            return hit

        files = self._inner.synthesize(text, output_dir)
        if not files or self._inner.fell_back:
            return files

        os.makedirs(self._cache_dir, exist_ok=True)
        cached = []
        for n, src in enumerate(files):
            dest = os.path.join(self._cache_dir, f"{key}_{n:02d}{os.path.splitext(src)[1]}")
            shutil.copyfile(src, dest)
            cached.append(dest)
        return cached


def _edge_available() -> bool:
    return importlib.util.find_spec("edge_tts") is not None


def _free_fallback() -> TTSProvider:
    """What paid providers fall back to: Edge neural voices if installed, else gTTS."""
    return EdgeTTSProvider() if _edge_available() else GTTSProvider()


def _select_provider() -> TTSProvider:
    """
    LERY_TTS_PROVIDER=edge|gtts|openai|elevenlabs forces one (paid ones need their key, else the
    free default is used). Unset: ElevenLabs if ELEVEN_API_KEY is set, else Edge (free) if
    installed, else gTTS.
    """
    choice = (os.getenv("LERY_TTS_PROVIDER") or "").strip().lower()
    eleven_key = os.getenv("ELEVEN_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if choice == "gtts":
        print("[TTS] Using gTTS")
        return GTTSProvider()

    if choice == "edge":
        if _edge_available():
            provider = EdgeTTSProvider(
                voice_en=os.getenv("LERY_EDGE_VOICE_EN"),
                voice_pt=os.getenv("LERY_EDGE_VOICE_PT"),
                rate=os.getenv("LERY_EDGE_RATE"),
            )
            print(f"[TTS] Using Edge TTS (en={provider.voice_en}, pt={provider.voice_pt}, rate={provider.rate})")
            return provider
        print("[TTS] LERY_TTS_PROVIDER=edge but the edge-tts package is not installed")

    elif choice == "openai":
        if openai_key:
            voice = os.getenv("LERY_OPENAI_VOICE", "coral")
            model = os.getenv("LERY_OPENAI_TTS_MODEL", "gpt-4o-mini-tts")
            instructions = os.getenv("LERY_OPENAI_TTS_INSTRUCTIONS", _DEFAULT_OPENAI_INSTRUCTIONS)
            print(f"[TTS] Using OpenAI (model={model}, voice={voice})")
            return OpenAITTSProvider(openai_key, voice=voice, model=model, instructions=instructions)
        print("[TTS] LERY_TTS_PROVIDER=openai but OPENAI_API_KEY is not set")

    elif choice in ("", "elevenlabs") and eleven_key:
        voice_id = os.getenv("ELEVEN_VOICE_ID", "cgSgspJ2msm6clMCkdW9")
        print(f"[TTS] Using ElevenLabs (voice={voice_id})")
        return ElevenLabsProvider(api_key=eleven_key, voice_id=voice_id)

    elif choice == "elevenlabs":
        print("[TTS] LERY_TTS_PROVIDER=elevenlabs but ELEVEN_API_KEY is not set")

    if not choice and _edge_available():
        provider = EdgeTTSProvider(
            voice_en=os.getenv("LERY_EDGE_VOICE_EN"),
            voice_pt=os.getenv("LERY_EDGE_VOICE_PT"),
            rate=os.getenv("LERY_EDGE_RATE"),
        )
        print(f"[TTS] Using Edge TTS (free) — en={provider.voice_en}, pt={provider.voice_pt}")
        return provider

    print("[TTS] Using gTTS")
    return GTTSProvider()


def create_tts_provider() -> TTSProvider:
    """
    Factory used by the app: the selected provider, wrapped in the phrase cache.
    LERY_TTS_CACHE=0 disables the cache; LERY_TTS_CACHE_MAX_CHARS (default 80) sets the longest
    text that gets cached.
    """
    provider = _select_provider()
    if os.getenv("LERY_TTS_CACHE", "1") == "0":
        return provider

    try:
        max_chars = int(os.getenv("LERY_TTS_CACHE_MAX_CHARS", "80"))
    except ValueError:
        max_chars = 80
    return CachingTTSProvider(provider, max_chars=max_chars)

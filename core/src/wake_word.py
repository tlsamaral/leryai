import threading
import numpy as np
import sounddevice as sd


class WakeWordDetector:
    """
    Listens continuously for a wake word using OpenWakeWord.
    Uses sounddevice (already in requirements) — no extra audio lib needed.

    When the wake word is detected, the InputStream is closed before returning,
    so AudioManager can immediately open its own stream on the same mic.

    Fallback: if openwakeword is not installed or model fails to load,
    falls back to input() so development without the library still works.
    """

    CHUNK = 1280        # 80ms at 16kHz — required by openwakeword
    SAMPLE_RATE = 16000
    DEBOUNCE_FRAMES = 2  # consecutive frames above threshold required to activate

    def __init__(self, model_name: str = "hey_jarvis", threshold: float = 0.5, device=None):
        self.model_name = model_name
        self.threshold = threshold
        self.device = device
        self._model = None
        self._available = self._load_model()
        self._consecutive = 0  # frames consecutively above threshold

    def _load_model(self) -> bool:
        try:
            from openwakeword.model import Model
            self._model = Model(wakeword_models=[self.model_name], inference_framework="onnx")
            print(f"[WakeWord] Model loaded: {self.model_name}")
            return True
        except ImportError:
            print("[WakeWord] openwakeword not installed — falling back to Enter key")
            return False
        except Exception as e:
            print(f"[WakeWord] Failed to load model '{self.model_name}': {e} — falling back to Enter key")
            return False

    def wait_for_wake_word(self) -> None:
        """
        Blocks until the wake word is detected (or Enter is pressed in fallback mode).
        Releases the mic before returning.
        """
        if not self._available:
            input("Press Enter to start recording...")
            return

        print(f"[WakeWord] Listening for '{self.model_name}'...")

        detected = threading.Event()

        consecutive = [0]  # mutable for closure

        def callback(indata: np.ndarray, frames: int, time, status) -> None:
            if detected.is_set():
                return
            audio_int16 = (np.squeeze(indata) * 32767).astype(np.int16)
            predictions = self._model.predict(audio_int16)
            for model_name, score in predictions.items():
                if score > 0.2:
                    print(f"[WakeWord] {model_name}: {score:.3f}", flush=True)
                if score >= self.threshold:
                    consecutive[0] += 1
                    if consecutive[0] >= self.DEBOUNCE_FRAMES:
                        print(f"[WakeWord] ✓ ACTIVATED — {model_name} score={score:.3f} "
                              f"({consecutive[0]} consecutive frames, threshold={self.threshold})", flush=True)
                        detected.set()
                else:
                    consecutive[0] = 0  # reset on any frame below threshold

        with sd.InputStream(
            samplerate=self.SAMPLE_RATE,
            channels=1,
            dtype="float32",
            blocksize=self.CHUNK,
            device=self.device,
            callback=callback,
        ):
            detected.wait()

        # Stream closed here — mic is free for AudioManager


def create_wake_word_detector() -> WakeWordDetector:
    """
    Factory that reads LERY_WAKE_WORD_MODEL from environment.
    Default: hey_jarvis (pre-trained, no training required).
    Switch to custom model: set LERY_WAKE_WORD_MODEL=path/to/hey_lery.onnx
    """
    import os
    model = os.getenv("LERY_WAKE_WORD_MODEL", "hey_jarvis")
    threshold = float(os.getenv("LERY_WAKE_WORD_THRESHOLD", "0.5"))
    device = os.getenv("LERY_AUDIO_DEVICE")
    if device:
        try:
            device = int(device)
        except ValueError:
            pass
    return WakeWordDetector(model_name=model, threshold=threshold, device=device)

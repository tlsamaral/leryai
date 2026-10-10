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

    def _instantiate_model(self, model_target: str):
        from openwakeword.model import Model
        candidates = [
            {"wakeword_models": [model_target]},
            {"wakeword_model_paths": [model_target]},
            {"wakeword_models": [model_target], "inference_framework": "onnx"},
            {"wakeword_model_paths": [model_target], "inference_framework": "onnx"},
        ]
        for kwargs in candidates:
            try:
                return Model(**kwargs)
            except (TypeError, Exception):
                continue
        return Model([model_target])

    def _load_model(self) -> bool:
        try:
            self._model = self._instantiate_model(self.model_name)
            print(f"[WakeWord] Model loaded: {self.model_name}")
            return True
        except ImportError:
            print("[WakeWord] openwakeword not installed — falling back to Enter key")
            return False
        except Exception as e:
            if "doesn't exist" in str(e).lower() or "no_suchfile" in str(e).lower():
                try:
                    print(f"[WakeWord] Modelo '{self.model_name}' não encontrado localmente. Baixando modelos padrão...")
                    import openwakeword.utils
                    openwakeword.utils.download_models()
                    self._model = self._instantiate_model(self.model_name)
                    print(f"[WakeWord] Model loaded: {self.model_name}")
                    return True
                except Exception as dl_err:
                    print(f"[WakeWord] Falha ao baixar modelos automaticamente: {dl_err}")
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

        # Determine stream sample rate and block size
        stream_sr = self.SAMPLE_RATE
        needs_resample = False

        try:
            sd.check_input_settings(device=self.device, samplerate=self.SAMPLE_RATE, channels=1, dtype="float32")
        except Exception:
            try:
                mic_info = sd.query_devices(self.device, 'input')
                stream_sr = int(mic_info.get('default_samplerate', 44100))
                needs_resample = (stream_sr != self.SAMPLE_RATE)
            except Exception:
                stream_sr = 44100
                needs_resample = True

        block_size = int(stream_sr * 0.08) if needs_resample else self.CHUNK

        detected = threading.Event()
        consecutive = [0]  # mutable for closure

        def callback(indata: np.ndarray, frames: int, time, status) -> None:
            if detected.is_set():
                return
            audio = np.squeeze(indata)
            if needs_resample:
                import scipy.signal
                audio = scipy.signal.resample(audio, self.CHUNK).astype(np.float32)

            audio_int16 = (audio * 32767).astype(np.int16)
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
            samplerate=stream_sr,
            channels=1,
            dtype="float32",
            blocksize=block_size,
            device=self.device,
            callback=callback,
        ):
            detected.wait()

        # Stream closed here — mic is free for AudioManager


def create_wake_word_detector(device=None) -> WakeWordDetector:
    """
    Factory that reads LERY_WAKE_WORD_MODEL from environment.
    Defaults to hey_lery.onnx if present in config/wake_word/, otherwise hey_jarvis.
    """
    import os
    core_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    default_lery_model = os.path.join(core_dir, "config", "wake_word", "hey_lery.onnx")

    model = os.getenv("LERY_WAKE_WORD_MODEL")
    if not model:
        if os.path.exists(default_lery_model):
            model = default_lery_model
        else:
            model = "hey_jarvis"
    elif not os.path.isabs(model):
        candidate = os.path.normpath(os.path.join(core_dir, model))
        if os.path.exists(candidate):
            model = candidate

    threshold = float(os.getenv("LERY_WAKE_WORD_THRESHOLD", "0.5"))
    if device is None:
        device = os.getenv("LERY_AUDIO_DEVICE")
    if device:
        try:
            device = int(device)
        except ValueError:
            pass
        try:
            sd.query_devices(device, 'input')
        except Exception:
            device = None

    if device is None:
        def_input = sd.default.device[0]
        if def_input is not None:
            try:
                sd.query_devices(def_input, 'input')
                device = def_input
            except Exception:
                pass

    if device is None:
        try:
            for idx in range(len(sd.query_devices())):
                try:
                    sd.query_devices(idx, 'input')
                    device = idx
                    break
                except Exception:
                    continue
        except Exception:
            pass
    return WakeWordDetector(model_name=model, threshold=threshold, device=device)

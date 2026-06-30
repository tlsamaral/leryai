import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import pygame
import os
import time

class AudioManager:
    def __init__(self, sample_rate=None):
        device = os.environ.get("LERY_AUDIO_DEVICE")
        if device is not None:
            try:
                device = int(device)
            except ValueError:
                pass
        self.device = device

        if sample_rate is None:
            info = sd.query_devices(self.device or sd.default.device[0], 'input')
            self.sample_rate = int(info['default_samplerate'])
        else:
            self.sample_rate = sample_rate

        output_device = os.environ.get("LERY_AUDIO_OUTPUT_DEVICE")

        try:
            if output_device:
                pygame.mixer.init(devicename=output_device)
            else:
                pygame.mixer.init()
        except Exception as e:
            print(f"Failed to init pygame mixer with device {output_device}: {e}, falling back to default")
            pygame.mixer.init()

    def record_audio(
        self,
        output_filename="data/audio/input.wav",
        threshold=30,
        silence_duration=2.0,
        max_wait_seconds=8,
        max_duration_seconds=30,
    ):
        """
        Records audio until post-speech silence is detected.

        Returns output_filename on success.
        Returns None if user never spoke within max_wait_seconds — caller
        should treat this as a silence/no-input event.
        """
        print("Listening... (Speak now)")

        recording = []
        silent_chunks = 0
        chunk_size = 1024

        chunks_per_second = self.sample_rate / chunk_size
        silence_chunks_limit = int(chunks_per_second * silence_duration)
        max_wait_chunks = int(chunks_per_second * max_wait_seconds)
        max_duration_chunks = int(chunks_per_second * max_duration_seconds)

        has_spoken = False
        pre_speech_chunks = 0

        with sd.InputStream(samplerate=self.sample_rate, channels=1, dtype='int16', device=self.device) as stream:
            while True:
                data, _ = stream.read(chunk_size)
                recording.append(data)

                volume = np.linalg.norm(data) / chunk_size

                if volume > threshold:
                    silent_chunks = 0
                    has_spoken = True
                else:
                    if has_spoken:
                        silent_chunks += 1
                    else:
                        pre_speech_chunks += 1

                # User spoke then went silent → stop cleanly
                if has_spoken and silent_chunks > silence_chunks_limit:
                    print("Silence detected, stopping...")
                    break

                # User never spoke within the wait window → no input
                if not has_spoken and pre_speech_chunks > max_wait_chunks:
                    print("No speech detected.")
                    return None

                # Hard cap
                if len(recording) > max_duration_chunks:
                    print("Max duration reached.")
                    break

        full_recording = np.concatenate(recording, axis=0)

        output_dir = os.path.dirname(output_filename)
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)

        wav.write(output_filename, self.sample_rate, full_recording)
        print(f"Audio saved to {output_filename}")
        return output_filename

    def play_chime(self):
        """
        Plays a two-tone ascending chime on wake word activation.
        Generated programmatically — no external file needed.
        """
        sr = 44100
        duration = 0.12  # seconds per note
        t = np.linspace(0, duration, int(sr * duration), endpoint=False)

        def note(freq):
            tone = np.sin(2 * np.pi * freq * t)
            # Smooth envelope: quick attack, gentle decay
            env = np.ones_like(t)
            attack = int(0.01 * sr)
            decay = int(0.04 * sr)
            env[:attack] = np.linspace(0, 1, attack)
            env[-decay:] = np.linspace(1, 0, decay)
            return (tone * env * 0.4 * 32767).astype(np.int16)

        # E5 → A5 — bright, friendly ascending interval
        chime = np.concatenate([note(659), np.zeros(int(sr * 0.03), dtype=np.int16), note(880)])
        stereo = np.column_stack([chime, chime])

        try:
            sound = pygame.sndarray.make_sound(stereo)
            sound.play()
            pygame.time.wait(int((duration * 2 + 0.03) * 1000) + 50)
        except Exception as e:
            print(f"[Chime] {e}")

    def play_hmm(self):
        """Soft descending hum — signals retrying a network call."""
        sr = 44100
        duration = 0.6
        t = np.linspace(0, duration, int(sr * duration), endpoint=False)

        freq = np.linspace(280, 220, len(t))
        tone = np.sin(2 * np.pi * np.cumsum(freq) / sr)

        env = np.ones_like(t)
        attack = int(0.1 * sr)
        decay = int(0.2 * sr)
        env[:attack] = np.linspace(0, 1, attack)
        env[-decay:] = np.linspace(1, 0, decay)

        sound_data = (tone * env * 0.35 * 32767).astype(np.int16)
        stereo = np.column_stack([sound_data, sound_data])

        try:
            sound = pygame.sndarray.make_sound(stereo)
            sound.play()
            pygame.time.wait(int(duration * 1000) + 50)
        except Exception as e:
            print(f"[Hmm] {e}")

    def play_error_sound(self):
        """Two-tone descending sound — signals a hard failure."""
        sr = 44100
        duration = 0.15
        t = np.linspace(0, duration, int(sr * duration), endpoint=False)

        def note(freq):
            tone = np.sin(2 * np.pi * freq * t)
            env = np.ones_like(t)
            attack = int(0.01 * sr)
            decay = int(0.05 * sr)
            env[:attack] = np.linspace(0, 1, attack)
            env[-decay:] = np.linspace(1, 0, decay)
            return (tone * env * 0.4 * 32767).astype(np.int16)

        # A5 → C5 descending (inverse of wake chime)
        error = np.concatenate([note(880), np.zeros(int(sr * 0.05), dtype=np.int16), note(523)])
        stereo = np.column_stack([error, error])

        try:
            sound = pygame.sndarray.make_sound(stereo)
            sound.play()
            pygame.time.wait(int((duration * 2 + 0.05) * 1000) + 50)
        except Exception as e:
            print(f"[Error sound] {e}")

    def play_audio(self, file_path):
        """
        Plays an audio file using pygame.
        """
        if not os.path.exists(file_path):
            print(f"Error: File {file_path} not found.")
            return

        try:
            pygame.mixer.music.load(file_path)
            pygame.mixer.music.play()
            while pygame.mixer.music.get_busy():
                time.sleep(0.1)
        except Exception as e:
            print(f"Error playing audio: {e}")

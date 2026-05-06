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

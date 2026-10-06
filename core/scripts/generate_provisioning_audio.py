"""
Pre-renders the Wi-Fi setup prompts with the configured TTS voice into assets/audio/provisioning/.

Lery has no internet while it's being set up, so these files are committed and played locally.
Re-run whenever the wording (SPOKEN_PROMPTS in src/provisioning.py) or the voice changes:

    python scripts/generate_provisioning_audio.py

Uses create_tts_provider() — set LERY_TTS_PROVIDER / LERY_OPENAI_VOICE / ELEVEN_* in core/.env first.
Watch the log: a "falling back to gTTS" line means the files got the gTTS voice.
"""
import os
import shutil
import sys
import tempfile

from dotenv import load_dotenv

CORE = os.path.join(os.path.dirname(__file__), '..')
sys.path.insert(0, os.path.join(CORE, 'src'))
load_dotenv(os.path.join(CORE, '.env'))

from provisioning import SPOKEN_PROMPTS  # noqa: E402
from tts_manager import create_tts_provider  # noqa: E402


def main() -> None:
    out_dir = os.path.join(CORE, 'assets', 'audio', 'provisioning')
    os.makedirs(out_dir, exist_ok=True)
    provider = create_tts_provider()

    with tempfile.TemporaryDirectory() as tmp:
        for event, text in SPOKEN_PROMPTS.items():
            files = provider.synthesize(text, output_dir=tmp)
            if len(files) != 1 or not files[0].endswith('.mp3'):
                sys.exit(f'{event}: expected one mp3, got {files}')
            dest = os.path.join(out_dir, f'{event}.mp3')
            shutil.copyfile(files[0], dest)
            print(f'{event:11s} -> {os.path.relpath(dest, CORE)}  ({os.path.getsize(dest) // 1024} KB)')


if __name__ == '__main__':
    main()

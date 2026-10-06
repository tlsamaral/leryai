"""
Renders the same tutor lines with several voices so you can listen and pick one.
Free by default (Edge neural voices); paid providers only with an explicit flag.

    python scripts/voice_samples.py                        # Edge voices — costs nothing
    python scripts/voice_samples.py --edge-voices en-US-AriaNeural,en-GB-SoniaNeural
    python scripts/voice_samples.py --openai               # also OpenAI voices (spends credits)
    python scripts/voice_samples.py --eleven               # also ELEVEN_VOICE_ID (spends quota)

Files go to data/audio/voice-samples/ (git-ignored). Then set in core/.env:

    LERY_TTS_PROVIDER=edge
    LERY_EDGE_VOICE_EN=<the one you liked>      # optional: LERY_EDGE_VOICE_PT, LERY_EDGE_RATE=-5%
"""
import argparse
import os
import shutil
import sys
import tempfile

from dotenv import load_dotenv

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from tts_manager import (  # noqa: E402
    _DEFAULT_OPENAI_INSTRUCTIONS,
    EdgeTTSProvider,
    ElevenLabsProvider,
    OpenAITTSProvider,
    _strip_pt_tags,
)

DEFAULT_EDGE_VOICES = [
    'en-US-AvaMultilingualNeural',
    'en-US-AriaNeural',
    'en-US-JennyNeural',
    'en-US-EmmaMultilingualNeural',
    'en-US-AndrewMultilingualNeural',
    'en-GB-SoniaNeural',
]
DEFAULT_OPENAI_VOICES = ['coral', 'nova', 'shimmer', 'sage']

# An A1-style opening, a correction with Portuguese, and a longer turn.
DEFAULT_TEXT = (
    "Hello! I'm Lery, your English tutor. Today we can talk about your day. "
    "[PT]Não se preocupe com os erros, eles fazem parte do aprendizado.[/PT] "
    "Great try! We say \"I went to work\", not \"I go to work yesterday\". "
    "Now, tell me: what did you do this morning?"
)


def concat_mp3(files, dest: str) -> None:
    """Joins the per-segment mp3 files into one sample (players handle plain concatenation)."""
    with open(dest, 'wb') as out:
        for f in files:
            with open(f, 'rb') as src:
                shutil.copyfileobj(src, out)


def render(provider, text: str, dest: str) -> bool:
    with tempfile.TemporaryDirectory() as tmp:
        files = provider.synthesize(text, output_dir=tmp)
        if provider.fell_back or not files:
            return False  # a gTTS fallback sample would be misleading
        concat_mp3(files, dest)
        return True


def main() -> None:
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--edge-voices', default=','.join(DEFAULT_EDGE_VOICES))
    parser.add_argument('--rate', default=None, help='Edge speaking rate, e.g. -10%% (default -5%%)')
    parser.add_argument('--openai', action='store_true', help='also render OpenAI voices (spends credits)')
    parser.add_argument('--openai-voices', default=','.join(DEFAULT_OPENAI_VOICES))
    parser.add_argument('--openai-model', default='gpt-4o-mini-tts')
    parser.add_argument('--eleven', action='store_true', help='also render ELEVEN_VOICE_ID (spends quota)')
    parser.add_argument('--text', default=DEFAULT_TEXT)
    parser.add_argument('--out', default='data/audio/voice-samples')
    args = parser.parse_args()

    os.makedirs(args.out, exist_ok=True)
    ok, failed = [], []

    def run(label: str, provider) -> None:
        dest = os.path.join(args.out, f'{label}.mp3')
        try:
            success = render(provider, args.text, dest)
        except Exception as e:  # noqa: BLE001 — report and keep going
            success = False
            print(f'  error: {e}')
        (ok if success else failed).append(label)
        print(f'{"ok     " if success else "FAILED "} {label}')

    for voice in [v.strip() for v in args.edge_voices.split(',') if v.strip()]:
        run(f'edge-{voice}', EdgeTTSProvider(voice_en=voice, rate=args.rate))

    if args.openai:
        key = os.getenv('OPENAI_API_KEY')
        if not key:
            print('OPENAI_API_KEY not set — skipping OpenAI')
        for voice in [v.strip() for v in args.openai_voices.split(',') if v.strip()] if key else []:
            run(f'openai-{args.openai_model}-{voice}',
                OpenAITTSProvider(key, voice=voice, model=args.openai_model,
                                  instructions=os.getenv('LERY_OPENAI_TTS_INSTRUCTIONS', _DEFAULT_OPENAI_INSTRUCTIONS)))

    if args.eleven:
        key = os.getenv('ELEVEN_API_KEY')
        if key:
            run('elevenlabs', ElevenLabsProvider(key, os.getenv('ELEVEN_VOICE_ID', 'cgSgspJ2msm6clMCkdW9')))
        else:
            print('ELEVEN_API_KEY not set — skipping ElevenLabs')

    print(f'\n{len(ok)} sample(s) in {os.path.abspath(args.out)}')
    if failed:
        print(f'Failed: {", ".join(failed)}')


if __name__ == '__main__':
    main()

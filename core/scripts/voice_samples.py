"""
Renders the same tutor sentences with several OpenAI voices so you can listen and pick one.

    python scripts/voice_samples.py                     # default voices, gpt-4o-mini-tts
    python scripts/voice_samples.py --voices coral,nova --model tts-1-hd
    python scripts/voice_samples.py --eleven            # also the ELEVEN_VOICE_ID (spends ElevenLabs quota)

Files go to data/audio/voice-samples/ (git-ignored). Then set in core/.env:

    LERY_TTS_PROVIDER=openai
    LERY_OPENAI_VOICE=<the one you liked>

Needs OPENAI_API_KEY (core/.env). Each voice is one short request (a few cents in total).
"""
import argparse
import os
import sys

from dotenv import load_dotenv

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from tts_manager import _DEFAULT_OPENAI_INSTRUCTIONS, _strip_pt_tags  # noqa: E402

DEFAULT_VOICES = ['coral', 'nova', 'shimmer', 'sage', 'ballad', 'alloy', 'verse']

# A1-style opening, a correction with Portuguese, and a longer B1 turn.
DEFAULT_TEXT = (
    "Hello! I'm Lery, your English tutor. Today we can talk about your day. "
    "[PT]Não se preocupe com os erros, eles fazem parte do aprendizado.[/PT] "
    "Great try! We say \"I went to work\", not \"I go to work yesterday\". "
    "Now, tell me: what did you do this morning?"
)


def render_openai(client, voice: str, model: str, text: str, path: str) -> None:
    kwargs = {}
    if model.startswith('gpt-4o'):
        kwargs['instructions'] = os.getenv('LERY_OPENAI_TTS_INSTRUCTIONS', _DEFAULT_OPENAI_INSTRUCTIONS)
    with client.audio.speech.with_streaming_response.create(
        model=model, voice=voice, input=text, response_format='mp3', **kwargs
    ) as response:
        response.stream_to_file(path)


def render_eleven(text: str, path: str) -> None:
    from elevenlabs import save
    from elevenlabs.client import ElevenLabs

    audio = ElevenLabs(api_key=os.environ['ELEVEN_API_KEY']).text_to_speech.convert(
        voice_id=os.getenv('ELEVEN_VOICE_ID', 'cgSgspJ2msm6clMCkdW9'),
        text=text,
        model_id='eleven_multilingual_v2',
        output_format='mp3_44100_128',
    )
    save(audio, path)


def main() -> None:
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--voices', default=','.join(DEFAULT_VOICES), help='comma-separated OpenAI voices')
    parser.add_argument('--model', default='gpt-4o-mini-tts')
    parser.add_argument('--text', default=DEFAULT_TEXT)
    parser.add_argument('--out', default='data/audio/voice-samples')
    parser.add_argument('--eleven', action='store_true', help='also render the configured ElevenLabs voice')
    args = parser.parse_args()

    if not os.getenv('OPENAI_API_KEY'):
        sys.exit('OPENAI_API_KEY not set (core/.env)')

    from openai import OpenAI

    client = OpenAI(timeout=30)
    text = _strip_pt_tags(args.text)
    os.makedirs(args.out, exist_ok=True)

    written, failed = [], []
    for voice in [v.strip() for v in args.voices.split(',') if v.strip()]:
        path = os.path.join(args.out, f'openai-{args.model}-{voice}.mp3')
        try:
            render_openai(client, voice, args.model, text, path)
            written.append(path)
            print(f'ok      {path}')
        except Exception as e:
            failed.append(voice)
            print(f'FAILED  {voice}: {e}')

    if args.eleven:
        path = os.path.join(args.out, 'elevenlabs.mp3')
        try:
            render_eleven(text, path)
            written.append(path)
            print(f'ok      {path}')
        except Exception as e:
            print(f'FAILED  elevenlabs: {e}')

    print(f'\n{len(written)} sample(s) in {os.path.abspath(args.out)}')
    if failed:
        print(f'Failed: {", ".join(failed)} — see the errors above (quota/credits, or voice name not supported by this model)')


if __name__ == '__main__':
    main()

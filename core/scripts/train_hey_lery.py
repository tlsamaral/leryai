"""
Train a custom "Hey Lery" wake word model using OpenWakeWord embeddings + sklearn.

No speechbrain. No heavy deps. Uses openwakeword's built-in embedding model
to extract features, trains a LogisticRegression, exports to ONNX manually.

The ONNX model matches openwakeword's expected format:
  Input:  [1, 16, 96]  (1 batch, 16 time frames, 96-dim embeddings)
  Output: [1, 1]       (probability of wake word)

Usage:
    cd core
    python3 scripts/train_hey_lery.py

Output:
    config/wake_word/hey_lery.onnx

Then update .env:
    LERY_WAKE_WORD_MODEL=config/wake_word/hey_lery.onnx
"""

import os
import sys
import pathlib
import random
import numpy as np

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT       = pathlib.Path(__file__).parent.parent
OUTPUT_DIR = ROOT / "config" / "wake_word"
DATA_DIR   = OUTPUT_DIR / "training_data"
POS_DIR    = DATA_DIR / "positive"
NEG_DIR    = DATA_DIR / "negative"

PHRASE_VARIATIONS = [
    "hey lery",
    "hey leary",
    "hey larry",    # BR accent common mishearing
    "hey leori",
    "hey leri",
]

SAMPLE_RATE = 16000
N_POSITIVE  = 150   # per variation — ~750 total
N_NOISE     = 300   # silence + noise samples
N_SPEECH    = 700   # gTTS speech (other phrases) — critical to reject human voice

# Phrases that are NOT the wake word — teach the model to reject real speech
NEGATIVE_PHRASES = [
    # English — common assistant interactions
    "what time is it", "set a timer for five minutes", "play some music",
    "turn off the lights", "what is the weather today", "how are you doing",
    "tell me a joke", "what is the news", "call mom", "send a message",
    "open the app", "search the internet", "calculate ten plus five",
    "remind me tomorrow", "navigate to downtown", "add milk to my list",
    "read my emails", "skip this song", "increase the volume", "stop the music",
    # English — conversational
    "hello there", "good morning", "how was your day", "see you later",
    "thank you very much", "I need some help", "can you hear me",
    "what did you say", "let me think about that", "that sounds great",
    "I don't understand", "please repeat that", "one moment please",
    "okay sounds good", "never mind forget it", "actually no thanks",
    # English — similar phonetics (hard negatives)
    "hey jerry", "hey berry", "hey terry", "hey perry", "hey kerry",
    "hey larry come here", "hey mary", "hey harry", "hey cherry",
    "hey there buddy", "hey what's up", "hey listen to me",
    "hey can you help", "hey stop that", "hello lary", "hello larry",
    # Portuguese — student may speak PT
    "como você está", "bom dia tudo bem", "obrigado pela ajuda",
    "não entendi nada", "pode repetir por favor", "qual é o seu nome",
    "eu quero aprender inglês", "me ajuda com isso", "até logo tchau",
    "que horas são agora", "está tudo bem", "muito obrigado mesmo",
    "me faz um favor", "me diz uma coisa", "deixa eu te falar",
    "eu não sei não", "pode falar mais devagar", "isso está correto",
]

# ── Deps check ───────────────────────────────────────────────────────────────

def check_deps():
    missing = []
    for pkg, import_name in [
        ("scipy", "scipy"),
        ("openwakeword", "openwakeword"),
        ("scikit-learn", "sklearn"),
        ("skl2onnx", "skl2onnx"),
        ("onnxruntime", "onnxruntime"),
        ("edge-tts", "edge_tts"),
    ]:
        try:
            __import__(import_name)
        except ImportError:
            missing.append(pkg)
    if missing:
        print(f"Missing: {', '.join(missing)}")
        print(f"Run: pip3 install {' '.join(missing)}")
        sys.exit(1)


# ── edge-tts helper (async → sync wrapper) ───────────────────────────────────

def _edge_tts_to_wav(text: str, voice: str, out_path: pathlib.Path) -> bool:
    """Synthesize text with edge-tts and convert mp3 → wav via ffmpeg."""
    import asyncio
    import subprocess
    import edge_tts

    mp3_path = out_path.with_suffix(".mp3")

    async def _synth():
        comm = edge_tts.Communicate(text, voice)
        await comm.save(str(mp3_path))

    try:
        asyncio.run(_synth())
        proc = subprocess.run(
            ["ffmpeg", "-y", "-i", str(mp3_path),
             "-ar", str(SAMPLE_RATE), "-ac", "1", "-f", "wav", str(out_path)],
            capture_output=True,
        )
        mp3_path.unlink(missing_ok=True)
        return proc.returncode == 0
    except Exception as e:
        mp3_path.unlink(missing_ok=True)
        return False

# ── Step 1: Generate positive samples with edge-tts ──────────────────────────

# Voices with accent variety — all English, different neural voices
POSITIVE_VOICES = [
    "en-US-JennyNeural",
    "en-US-GuyNeural",
    "en-GB-SoniaNeural",
    "en-GB-RyanNeural",
    "en-AU-NatashaNeural",
    "en-AU-WilliamNeural",
    "en-IN-NeerjaNeural",
    "en-IN-PrabhatNeural",
]

def generate_positive_samples():
    POS_DIR.mkdir(parents=True, exist_ok=True)
    count = 0
    per_voice = max(1, N_POSITIVE // len(POSITIVE_VOICES))

    print(f"\n[1/3] Generating positive samples ({len(PHRASE_VARIATIONS)} phrases × "
          f"{len(POSITIVE_VOICES)} voices × {per_voice} reps)...")

    for phrase in PHRASE_VARIATIONS:
        for voice in POSITIVE_VOICES:
            for i in range(per_voice):
                slug = phrase.replace(" ", "_")
                out_path = POS_DIR / f"{slug}_{voice}_{i:03d}.wav"
                if out_path.exists():
                    count += 1
                    continue
                if _edge_tts_to_wav(phrase, voice, out_path):
                    count += 1
                    if count % 50 == 0:
                        print(f"  {count} samples generated...")

    print(f"[1/3] Done — {count} positive samples in {POS_DIR}")
    return count

# ── Step 2: Generate negative samples (noise + speech via edge-tts) ──────────

NEGATIVE_VOICES = [
    "en-US-JennyNeural", "en-US-GuyNeural",
    "en-GB-SoniaNeural", "en-AU-NatashaNeural",
    "pt-BR-FranciscaNeural", "pt-BR-AntonioNeural",
]

def generate_negative_samples():
    import scipy.io.wavfile as wav

    NEG_DIR.mkdir(parents=True, exist_ok=True)
    total = N_NOISE + N_SPEECH
    print(f"\n[2/3] Generating {total} negative samples ({N_NOISE} noise + {N_SPEECH} speech)...")

    duration_samples = int(SAMPLE_RATE * 1.5)

    # ── Noise (silence / white / pink / bursts) ───────────────────────
    for i in range(N_NOISE):
        out_path = NEG_DIR / f"noise_{i:04d}.wav"
        if out_path.exists():
            continue
        kind = i % 4
        if kind == 0:
            audio = np.zeros(duration_samples, dtype=np.int16)
        elif kind == 1:
            audio = (np.random.randn(duration_samples) * 1000).astype(np.int16)
        elif kind == 2:
            audio = (np.cumsum(np.random.randn(duration_samples)) * 50).astype(np.int16)
            audio = np.clip(audio, -32768, 32767)
        else:
            audio = np.zeros(duration_samples, dtype=np.int16)
            for _ in range(random.randint(1, 5)):
                start = random.randint(0, duration_samples - 1000)
                audio[start:start+500] = (np.random.randn(500) * 2000).astype(np.int16)
        wav.write(str(out_path), SAMPLE_RATE, audio)

    # ── Speech negatives (edge-tts — no rate limits) ──────────────────
    speech_count = 0
    for idx in range(N_SPEECH):
        out_path = NEG_DIR / f"speech_{idx:04d}.wav"
        if out_path.exists():
            speech_count += 1
            continue
        phrase = NEGATIVE_PHRASES[idx % len(NEGATIVE_PHRASES)]
        # Portuguese voices for PT phrases
        if any(c in phrase for c in ["ã", "ç", "ê", "á", "é", "você", "por", "bom", "não"]):
            voice = random.choice(["pt-BR-FranciscaNeural", "pt-BR-AntonioNeural"])
        else:
            voice = random.choice(NEGATIVE_VOICES[:4])
        if _edge_tts_to_wav(phrase, voice, out_path):
            speech_count += 1
            if speech_count % 100 == 0:
                print(f"  {speech_count}/{N_SPEECH} speech negatives...")

    print(f"[2/3] Done — {N_NOISE} noise + {speech_count} speech negatives in {NEG_DIR}")

# ── Step 3: Train with openwakeword ──────────────────────────────────────────

def _load_wav(path: pathlib.Path) -> np.ndarray:
    """Load wav as int16 mono at SAMPLE_RATE."""
    import scipy.io.wavfile as wavfile
    sr, data = wavfile.read(str(path))
    if data.ndim > 1:
        data = data[:, 0]
    if sr != SAMPLE_RATE:
        # Simple nearest-neighbour resample (good enough for training)
        ratio = SAMPLE_RATE / sr
        n_out = int(len(data) * ratio)
        data = np.interp(
            np.linspace(0, len(data) - 1, n_out),
            np.arange(len(data)),
            data.astype(np.float32),
        ).astype(np.int16)
    return data.astype(np.int16)


def _extract_embeddings(wav_dir: pathlib.Path, label: int, af) -> tuple:
    """
    Extract openwakeword embeddings for every wav in wav_dir.
    Returns (X, y) where X.shape = (N, 16, 96).

    Strategy: pad/crop each clip to exactly 2 seconds so we always get
    ≥16 embedding frames; take the last 16 (most informative for wake word).
    """
    TARGET_LEN = SAMPLE_RATE * 2  # 2 s → ~6 embedding frames from embed_clips
    # but embed_clips produces ~3 frames per second, so 2s → ~6 frames
    # We need 16 frames — use a longer clip or repeat
    TARGET_LEN = SAMPLE_RATE * 6  # 6 s → ~18 frames, take first 16

    X, y = [], []
    wav_paths = list(wav_dir.glob("*.wav"))
    if not wav_paths:
        return np.array(X), np.array(y)

    batch_size = 64
    for i in range(0, len(wav_paths), batch_size):
        batch_paths = wav_paths[i:i + batch_size]
        batch_audio = []
        for p in batch_paths:
            try:
                audio = _load_wav(p)
                # Pad or tile to TARGET_LEN
                if len(audio) < TARGET_LEN:
                    reps = int(np.ceil(TARGET_LEN / len(audio)))
                    audio = np.tile(audio, reps)
                audio = audio[:TARGET_LEN]
                batch_audio.append(audio)
            except Exception as e:
                print(f"  Warning loading {p.name}: {e}")

        if not batch_audio:
            continue

        batch_np = np.stack(batch_audio)  # (B, TARGET_LEN)
        embeddings = af.embed_clips(batch_np)  # (B, frames, 96)

        for emb in embeddings:
            n_frames = emb.shape[0]
            if n_frames < 16:
                # Pad with zeros
                pad = np.zeros((16 - n_frames, 96), dtype=np.float32)
                emb = np.vstack([pad, emb])
            else:
                emb = emb[-16:]  # last 16 frames
            X.append(emb.astype(np.float32))
            y.append(label)

    return np.array(X), np.array(y)


def _build_onnx_model(weights: np.ndarray, bias: np.ndarray, output_path: str):
    """
    Build an ONNX graph that replicates:
        x: [1, 16, 96]
        → flatten → [1, 1536]
        → linear(1536, 1) + bias
        → sigmoid
        → [1, 1]
    """
    import onnx
    from onnx import helper, TensorProto, numpy_helper

    # Flatten weights to (1536, 1) — column vector
    W = weights.reshape(1, -1).T.astype(np.float32)  # (1536, 1)
    b = bias.reshape(1).astype(np.float32)            # (1,)

    W_init = numpy_helper.from_array(W, name="W")
    b_init = numpy_helper.from_array(b, name="b")

    # Graph nodes
    reshape_shape = numpy_helper.from_array(
        np.array([1, 1536], dtype=np.int64), name="reshape_shape"
    )

    node_reshape = helper.make_node(
        "Reshape", inputs=["x.1", "reshape_shape"], outputs=["x_flat"]
    )
    node_gemm = helper.make_node(
        "Gemm", inputs=["x_flat", "W", "b"], outputs=["logit"],
        transA=0, transB=0, alpha=1.0, beta=1.0,
    )
    node_sigmoid = helper.make_node(
        "Sigmoid", inputs=["logit"], outputs=["53"]
    )

    graph = helper.make_graph(
        nodes=[node_reshape, node_gemm, node_sigmoid],
        name="hey_lery",
        inputs=[helper.make_tensor_value_info("x.1", TensorProto.FLOAT, [1, 16, 96])],
        outputs=[helper.make_tensor_value_info("53", TensorProto.FLOAT, [1, 1])],
        initializer=[reshape_shape, W_init, b_init],
    )

    model = helper.make_model(graph, opset_imports=[helper.make_opsetid("", 11)])
    model.ir_version = 6
    onnx.save(model, output_path)


def train_model():
    from openwakeword.utils import AudioFeatures
    from sklearn.linear_model import LogisticRegression
    from sklearn.preprocessing import StandardScaler
    from sklearn.pipeline import Pipeline

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"\n[3/3] Training model — extracting embeddings + fitting classifier...")

    af = AudioFeatures()

    print("  Extracting positive embeddings...")
    X_pos, y_pos = _extract_embeddings(POS_DIR, 1, af)
    print(f"  {len(X_pos)} positive samples")

    print("  Extracting negative embeddings...")
    X_neg, y_neg = _extract_embeddings(NEG_DIR, 0, af)
    print(f"  {len(X_neg)} negative samples")

    X = np.concatenate([X_pos, X_neg], axis=0)   # (N, 16, 96)
    y = np.concatenate([y_pos, y_neg], axis=0)

    # Flatten for sklearn
    X_flat = X.reshape(len(X), -1)  # (N, 1536)

    print(f"  Fitting LogisticRegression on {len(X_flat)} samples...")
    clf = Pipeline([
        ("scaler", StandardScaler()),
        ("lr", LogisticRegression(C=1.0, max_iter=1000, class_weight="balanced")),
    ])
    clf.fit(X_flat, y)

    acc = clf.score(X_flat, y)
    print(f"  Training accuracy: {acc:.3f}")

    # Extract weights from the pipeline (scaler params baked in)
    scaler = clf.named_steps["scaler"]
    lr     = clf.named_steps["lr"]

    # Bake scaler into weights: w_eff = w / std, b_eff = b - w·mean/std
    w = lr.coef_[0] / scaler.scale_      # (1536,)
    b = lr.intercept_ - np.dot(lr.coef_[0], scaler.mean_ / scaler.scale_)

    out_path = str(OUTPUT_DIR / "hey_lery.onnx")
    _build_onnx_model(w, b, out_path)
    print(f"[3/3] Done — saved {out_path}")

# ── Step 4: Verify ────────────────────────────────────────────────────────────

def verify():
    from openwakeword.model import Model

    candidates = list(OUTPUT_DIR.glob("hey_lery*.onnx"))
    if not candidates:
        print("ERROR: no .onnx file found — training may have failed")
        sys.exit(1)

    model_path = str(candidates[0])
    model = Model(wakeword_models=[model_path], inference_framework="onnx")
    dummy = np.zeros(16000, dtype=np.int16)
    pred = model.predict(dummy)
    print(f"\nModel loads OK. Silence score: {pred} (should be near 0.0)")

    print("\n" + "="*50)
    print("✅ hey_lery.onnx trained!")
    print("="*50)
    print(f"\nUpdate core/.env:")
    print(f"  LERY_WAKE_WORD_MODEL=config/wake_word/{candidates[0].name}")
    print(f"\nIf false positives: increase LERY_WAKE_WORD_THRESHOLD to 0.7")

# ── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--retrain-only", action="store_true",
                        help="Skip sample generation, retrain from existing data")
    args = parser.parse_args()

    print("="*50)
    print("  Hey Lery — Wake Word Training")
    print("="*50)

    os.chdir(ROOT)
    check_deps()

    if not args.retrain_only:
        pos_count = generate_positive_samples()
        if pos_count == 0:
            print("\nERROR: No positive samples generated.")
            print("Make sure ffmpeg is installed: brew install ffmpeg")
            sys.exit(1)
        generate_negative_samples()
    else:
        print("\n[--retrain-only] Skipping sample generation, using existing data...")

    train_model()
    verify()

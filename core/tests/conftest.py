import json
import os
from pathlib import Path

import pytest
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / '.env')


FIXTURES_DIR = Path(__file__).parent / "fixtures"


@pytest.fixture(autouse=True)
def fake_env(monkeypatch):
    """Inject dummy API keys so imports that read env at module level don't fail.
    Real keys already in the environment are preserved so eval tests use them."""
    if not os.environ.get("GOOGLE_API_KEY"):
        monkeypatch.setenv("GOOGLE_API_KEY", "test-google-key")
    if not os.environ.get("OPENAI_API_KEY"):
        monkeypatch.setenv("OPENAI_API_KEY", "test-openai-key")
    monkeypatch.setenv("LERY_SKIP_WIFI_SETUP", "1")
    # A developer .env may set these; unit tests must not depend on it.
    monkeypatch.delenv("LERY_TTS_PROVIDER", raising=False)
    monkeypatch.delenv("LERY_AGENT_URL", raising=False)
    monkeypatch.setenv("LERY_API_URL", os.environ.get("LERY_API_URL", "http://localhost:3333"))
    monkeypatch.setenv("LERY_DEVICE_API_KEY", os.environ.get("LERY_DEVICE_API_KEY", "test-device-key"))


def load_fixture(subdir: str, name: str) -> dict:
    path = FIXTURES_DIR / subdir / name
    with open(path) as f:
        return json.load(f)

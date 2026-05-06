import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types

_RETRYABLE_CODES = {503, 429, 500}
_MAX_RETRIES = 4
_BACKOFF_BASE = 2  # seconds — doubles each attempt (2, 4, 8, 16)


class BrainManager:
    def __init__(self, system_prompt: str = None):
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in .env")

        self.client = genai.Client(api_key=api_key)
        # API-provided prompt takes priority; fall back to local file
        self.system_prompt = system_prompt or self._load_system_prompt()
        self.chat = self.client.chats.create(
            model='gemini-2.5-flash',
            config=types.GenerateContentConfig(
                system_instruction=self.system_prompt
            )
        )

    def _load_system_prompt(self):
        try:
            with open("config/system-prompt.txt", "r") as f:
                return f.read()
        except FileNotFoundError:
            print("Warning: config/system-prompt.txt not found. Using default.")
            return "You are a helpful AI assistant."

    def _is_retryable(self, exc: Exception) -> bool:
        msg = str(exc)
        return any(str(code) in msg for code in _RETRYABLE_CODES)

    def generate_response(self, user_input: str) -> str:
        """
        Sends user input to Gemini and returns response text.
        Retries on 503/429/500 with exponential backoff.
        """
        last_exc = None
        for attempt in range(_MAX_RETRIES):
            try:
                response = self.chat.send_message(message=user_input)
                return response.text
            except Exception as e:
                last_exc = e
                if self._is_retryable(e) and attempt < _MAX_RETRIES - 1:
                    wait = _BACKOFF_BASE ** attempt
                    print(f"[BrainManager] Gemini unavailable (attempt {attempt + 1}/{_MAX_RETRIES}), retrying in {wait}s...")
                    time.sleep(wait)
                else:
                    break

        print(f"[BrainManager] Failed after {_MAX_RETRIES} attempts: {last_exc}")
        return "I'm sorry, I'm having trouble thinking right now."

from __future__ import annotations

import json
import os
import re
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

    def rate_cefr(self, transcript: str) -> str:
        """
        Evaluates a conversation transcript and returns an estimated CEFR level.
        Uses a one-shot generate_content call (not the chat session) to avoid
        polluting the conversation history.
        Returns one of: 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'.
        Falls back to 'A2' on any error.
        """
        _VALID_LEVELS = {'A1', 'A2', 'B1', 'B2', 'C1', 'C2'}
        _FALLBACK = 'A2'

        rater_prompt = f"""You are an expert language evaluator certified in the CEFR framework.
Analyze the student's speech excerpts below and determine their English proficiency level.

Evaluate based on:
1. Lexical complexity — range and sophistication of vocabulary
2. Syntactic complexity — variety and correctness of grammar structures
3. Sentence length and fluency — ability to form complete, connected ideas
4. Error patterns — types and frequency of grammatical mistakes

STUDENT TRANSCRIPT (only the student's lines):
---
{transcript}
---

Respond ONLY with a valid JSON object, no extra text, no markdown:
{{"estimated_cefr": "<A1|A2|B1|B2|C1|C2>", "justification": "<one sentence>"}}"""

        last_exc = None
        for attempt in range(_MAX_RETRIES):
            try:
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=rater_prompt,
                )
                raw = response.text.strip()
                # Strip markdown code fences if present
                raw = re.sub(r'^```(?:json)?\s*|\s*```$', '', raw, flags=re.MULTILINE).strip()
                data = json.loads(raw)
                level = data.get('estimated_cefr', '').upper()
                if level in _VALID_LEVELS:
                    print(f'[BrainManager] CEFR rating: {level} — {data.get("justification", "")}')
                    return level
                print(f'[BrainManager] Unexpected CEFR value "{level}", falling back to {_FALLBACK}')
                return _FALLBACK
            except Exception as e:
                last_exc = e
                if self._is_retryable(e) and attempt < _MAX_RETRIES - 1:
                    wait = _BACKOFF_BASE ** attempt
                    print(f'[BrainManager] CEFR rating failed (attempt {attempt + 1}/{_MAX_RETRIES}), retrying in {wait}s...')
                    time.sleep(wait)
                else:
                    break

        print(f'[BrainManager] CEFR rating failed after {_MAX_RETRIES} attempts: {last_exc}. Falling back to {_FALLBACK}')
        return _FALLBACK

    def evaluate_turn(
        self,
        user_input: str,
        lery_response: str,
        lesson_objectives: str = '',
    ) -> dict | None:
        """
        Evaluates one student turn against 4 CEFR pillars.
        Uses a one-shot generate_content call — does NOT pollute chat history.

        Scores: task_achievement, grammar, vocabulary, fluency — 0–25 each (total 100).
        Also returns grammatical_fixes and reasoning.

        Returns a dict on success, None on failure (caller skips scores gracefully).
        """
        objectives_section = (
            f'LESSON OBJECTIVES:\n{lesson_objectives}\n\n'
            if lesson_objectives
            else ''
        )

        prompt = f"""You are an English language assessment specialist using the CEFR framework.
Evaluate the student's response in this tutoring exchange.

{objectives_section}STUDENT SAID:
"{user_input}"

TUTOR RESPONDED:
"{lery_response}"

Score the student's response on 4 pillars. Each pillar is worth 0–25 points (total 100):

- task_achievement (0–25): Did the student complete the communicative task? Did they respond relevantly and fully?
- grammar (0–25): Accuracy of grammar structures used. Penalize recurring errors, reward correct complex structures.
- vocabulary (0–25): Range and appropriateness of word choice for the student's level.
- fluency (0–25): Naturalness, sentence length, coherence, and absence of excessive hesitation.

Also provide:
- grammatical_fixes: Rewrite the student's sentence with all errors corrected. If no errors, write "No corrections needed."
- reasoning: One sentence summarizing the key strength and main area to improve.

Respond ONLY with valid JSON, no extra text, no markdown fences:
{{"task_achievement": <int>, "grammar": <int>, "vocabulary": <int>, "fluency": <int>, "total_score": <int>, "grammatical_fixes": "<str>", "reasoning": "<str>"}}"""

        last_exc = None
        for attempt in range(_MAX_RETRIES):
            try:
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                )
                raw = response.text.strip()
                raw = re.sub(r'^```(?:json)?\s*|\s*```$', '', raw, flags=re.MULTILINE).strip()
                data = json.loads(raw)

                # Clamp all scores to valid range and compute total
                pillars = ['task_achievement', 'grammar', 'vocabulary', 'fluency']
                for key in pillars:
                    data[key] = max(0, min(25, int(data.get(key, 0))))
                data['total_score'] = sum(data[p] for p in pillars)

                print(
                    f'[BrainManager] Evaluation — '
                    f'task={data["task_achievement"]} grammar={data["grammar"]} '
                    f'vocab={data["vocabulary"]} fluency={data["fluency"]} '
                    f'total={data["total_score"]}'
                )
                return data

            except Exception as e:
                last_exc = e
                if self._is_retryable(e) and attempt < _MAX_RETRIES - 1:
                    wait = _BACKOFF_BASE ** attempt
                    print(f'[BrainManager] evaluate_turn failed (attempt {attempt + 1}/{_MAX_RETRIES}), retrying in {wait}s...')
                    time.sleep(wait)
                else:
                    break

        print(f'[BrainManager] evaluate_turn failed after {_MAX_RETRIES} attempts: {last_exc}. Skipping scores.')
        return None

import os
import time
from enum import Enum
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI

from api_client import create_api_client
from audio_manager import AudioManager
from brain_manager import BrainManager
from led_controller import LEDController
from tts_manager import create_tts_provider

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# How many consecutive no-speech events before Lery ends the session
_MAX_SILENCE_STRIKES = 3

# Keywords that trigger session end
_EXIT_KEYWORDS = {
    "goodbye", "bye", "see you", "see ya", "good night", "i'm done",
    "i am done", "that's all", "that is all", "exit", "quit", "stop",
    "tchau", "até logo", "até mais", "encerrar",
}

_LESSON_TRIGGER_WORDS = {"lesson", "lição", "aula"}
_LESSON_ACTION_WORDS = {"start", "begin", "do", "let's", "lets", "vamos", "quero", "iniciar", "começa", "começar"}


class State(Enum):
    IDLE = "IDLE"
    LISTENING = "LISTENING"
    THINKING = "THINKING"
    SPEAKING = "SPEAKING"
    ERROR = "ERROR"


def _matches_keywords(text: str, keywords: set) -> bool:
    text = text.lower().strip()
    return any(kw in text for kw in keywords)


def _matches_lesson_intent(text: str) -> bool:
    """Detects lesson start intent. Checks for lesson word + action word anywhere in text."""
    text = text.lower()
    has_lesson = any(w in text for w in _LESSON_TRIGGER_WORDS)
    has_action = any(w in text for w in _LESSON_ACTION_WORDS)
    return has_lesson and has_action


def _build_free_talk_prompt(config: Optional[dict]) -> Optional[str]:
    """
    Build a FREE_TALK system prompt enriched with the user's CEFR level and
    profile. Returns None to fall back to config/system-prompt.txt if no
    config is available (offline mode).
    """
    if not config:
        return None

    level = config.get("level", "A1")
    profile = config.get("profile") or {}

    # ── Level-specific language rules ────────────────────────────────────────
    level_rules = {
        "A1": (
            "The student is A1 (complete beginner). "
            "Use ONLY simple present tense and very basic vocabulary (max ~500 common words). "
            "Short sentences — maximum 8 words each. "
            "Never use past perfect, present perfect, conditionals or passive voice. "
            "If you feel the urge to say 'I have done', say 'I did' instead."
        ),
        "A2": (
            "The student is A2 (elementary). "
            "You may use simple past and going-to future. "
            "Keep vocabulary simple. Avoid complex clauses. "
            "Max 2 clauses per sentence."
        ),
        "B1": (
            "The student is B1 (intermediate). "
            "You may use present perfect, simple past, future forms and basic modals. "
            "Introduce new vocabulary in context and explain it briefly."
        ),
        "B2": (
            "The student is B2 (upper-intermediate). "
            "Full range of tenses including conditionals and passive. "
            "Natural pace. Challenge the student with richer vocabulary."
        ),
        "C1": (
            "The student is C1 (advanced). "
            "Use natural, fluent English including idiomatic expressions. "
            "Nuanced vocabulary, complex sentences welcome."
        ),
        "C2": (
            "The student is C2 (mastery). "
            "Speak exactly as you would with a native speaker. "
            "No simplification whatsoever."
        ),
    }

    language_rule = level_rules.get(level, level_rules["A1"])

    # ── Profile context ───────────────────────────────────────────────────────
    profile_lines = []
    if profile.get("occupation"):
        profile_lines.append(f"- Occupation: {profile['occupation']}")
    if profile.get("interests"):
        profile_lines.append(f"- Interests: {', '.join(profile['interests'])}")
    if profile.get("hobbies"):
        profile_lines.append(f"- Hobbies: {', '.join(profile['hobbies'])}")
    if profile.get("learningGoal"):
        profile_lines.append(f"- Learning goal: {profile['learningGoal']}")
    if profile.get("ageGroup"):
        profile_lines.append(f"- Age group: {profile['ageGroup']}")
    if profile.get("nativeLanguage"):
        profile_lines.append(f"- Native language: {profile['nativeLanguage']}")

    profile_section = (
        "STUDENT PROFILE (use this to personalize topics and examples):\n"
        + "\n".join(profile_lines)
        if profile_lines
        else ""
    )

    return f"""You are "Lery", an experienced English tutor embedded in a physical smart speaker device.
You are the LEADER of every conversation — you ask questions, propose topics, give instructions, and guide the student. The student should NEVER feel lost or unsure of what to say next.

CURRENT MODE: FREE TALK
The student can chat freely, ask you to roleplay scenarios, or simply practice conversation.
If the student says "start lesson" or similar, acknowledge it — the system will handle the switch.

STUDENT LEVEL: {level}
{language_rule}

{profile_section}

CORE BEHAVIOR:
- YOU lead. Always end your turn with a question, a challenge, or a clear instruction.
- YOU adapt. Strictly match your vocabulary and grammar to the student's level above.
- YOU personalize. Bring up topics related to the student's interests and occupation when possible.
- YOU encourage. Celebrate progress. Never make the student feel bad about mistakes.
- YOU correct gently. Weave corrections naturally: "Great idea! Just a small note: we say '...' instead of '...'. Now, ..."

LANGUAGE RULES:
- Primary language: English.
- If student is clearly lost or repeating the same error 3+ times, use [PT]...[/PT] tags for a brief Portuguese explanation, then return to English immediately.

CONSTRAINTS:
- Max 3 sentences per response (optimized for Text-to-Speech on speaker hardware).
- Never break character as a tutor.
- Never use grammar structures above the student's level."""


class LeryAI:
    def __init__(self):
        self.state = State.IDLE
        self.audio_manager = AudioManager()
        self.led_controller = LEDController()
        self.led_controller.set_state("IDLE")

        self.tts = create_tts_provider()
        self.api = create_api_client()

        self._config = None
        self._lesson_id = None
        self._lesson_system_prompt = None
        self._session_id = None
        self._silence_strikes = 0

        # Always start FREE_TALK — user opts in to GUIDED_LESSON
        self._session_mode = "FREE_TALK"

        if self.api:
            self._config = self.api.get_session_config()
            if self._config and self._config.get("lesson"):
                lesson = self._config["lesson"]
                self._lesson_id = lesson["id"]
                self._lesson_system_prompt = lesson["systemPrompt"]
                print(f"Lesson ready: [{lesson['title']}] — say 'start lesson' to begin")
            else:
                print("No active lesson found — FREE_TALK only")

        # FREE_TALK prompt with user level + profile injected
        free_talk_prompt = _build_free_talk_prompt(self._config)
        self.brain_manager = BrainManager(system_prompt=free_talk_prompt)

    def set_state(self, new_state: State):
        self.state = new_state
        print(f"State: {self.state.value}")
        self.led_controller.set_state(self.state.value)

    def _ensure_session(self):
        if self._session_id or not self.api:
            return
        self._session_id = self.api.create_session(
            mode=self._session_mode,
            lesson_id=self._lesson_id if self._session_mode == "GUIDED_LESSON" else None,
        )

    def _switch_to_guided_lesson(self):
        """
        Complete current FREE_TALK session, open a GUIDED_LESSON session,
        and reinitialize BrainManager with the lesson system prompt.
        """
        if not self._lesson_id or not self._lesson_system_prompt:
            return False

        print("\n[Lery] Switching to GUIDED_LESSON mode...")

        if self.api and self._session_id:
            self.api.complete_session(self._session_id)

        self._session_id = None
        self._session_mode = "GUIDED_LESSON"

        # Fresh conversation context with lesson prompt
        self.brain_manager = BrainManager(system_prompt=self._lesson_system_prompt)

        if self.api:
            self._session_id = self.api.create_session(
                mode="GUIDED_LESSON",
                lesson_id=self._lesson_id,
            )

        return True

    def transcribe_audio(self, audio_file: str) -> Optional[str]:
        if not os.path.exists(audio_file):
            return None
        try:
            with open(audio_file, "rb") as audio:
                transcription = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio,
                    prompt=(
                        "English language tutoring session. "
                        "The student speaks primarily in English. "
                        "Occasional Portuguese words or sentences may appear."
                    ),
                )
            return transcription.text
        except Exception as e:
            print(f"Error during transcription: {e}")
            return None

    def text_to_speech(self, text: str) -> list:
        return self.tts.synthesize(text)

    def _speak(self, text: str):
        """Generate TTS and play — helper to avoid duplication."""
        self.set_state(State.SPEAKING)
        for f in self.text_to_speech(text):
            self.audio_manager.play_audio(f)
            time.sleep(0.2)
        self.set_state(State.IDLE)

    def run(self):
        print("Lery AI Started. Press Ctrl+C to exit.")

        try:
            while True:
                # ── IDLE → LISTENING ──────────────────────────────────────
                input("Press Enter to start recording...")  # Wake word replaces this (P0)
                self._silence_strikes = 0
                self.set_state(State.LISTENING)

                # ── Record ────────────────────────────────────────────────
                audio_file = self.audio_manager.record_audio(
                    output_filename="data/audio/input.wav"
                )

                # ── No speech detected ────────────────────────────────────
                if audio_file is None:
                    self._silence_strikes += 1
                    remaining = _MAX_SILENCE_STRIKES - self._silence_strikes

                    if self._silence_strikes >= _MAX_SILENCE_STRIKES:
                        print("[Lery] No response — ending session.")
                        self._speak("I haven't heard from you in a while. Let's continue next time. Goodbye!")
                        break

                    # Lery prompts student
                    prompt = (
                        "The student has been silent. Gently check if they are still there "
                        "with a short, encouraging question. Max 1 sentence."
                    )
                    self.set_state(State.THINKING)
                    nudge = self.brain_manager.generate_response(prompt)
                    self._speak(nudge)
                    continue

                # ── THINKING ──────────────────────────────────────────────
                self.set_state(State.THINKING)
                user_text = self.transcribe_audio(audio_file)
                print(f"User: {user_text}")

                if not user_text:
                    self.set_state(State.IDLE)
                    continue

                # ── Exit intent ───────────────────────────────────────────
                if _matches_keywords(user_text, _EXIT_KEYWORDS):
                    self._speak("It was great talking with you! See you next time. Goodbye!")
                    break

                # ── Lesson intent (FREE_TALK → GUIDED_LESSON) ─────────────
                if self._session_mode == "FREE_TALK" and _matches_lesson_intent(user_text):
                    if self._switch_to_guided_lesson():
                        intro = self.brain_manager.generate_response(
                            "The student just asked to start the lesson. "
                            "Greet them and set the scene for the lesson scenario."
                        )
                        self._speak(intro)
                    else:
                        self._speak(
                            "[PT]Ainda não há uma lição disponível para o seu nível.[/PT] "
                            "No lesson is available yet. Let's keep practicing in free talk!"
                        )
                    continue

                # ── Normal turn ───────────────────────────────────────────
                self._ensure_session()
                response_text = self.brain_manager.generate_response(user_text)
                print(f"Lery: {response_text}")

                if response_text == "I'm sorry, I'm having trouble thinking right now.":
                    self.set_state(State.ERROR)
                    time.sleep(2)
                    self.set_state(State.IDLE)
                    continue

                if self.api and self._session_id:
                    self.api.create_log(
                        session_id=self._session_id,
                        user_audio_trans=user_text,
                        lery_response=response_text,
                    )

                self._speak(response_text)

        except KeyboardInterrupt:
            print("\nExiting Lery AI...")
        finally:
            if self.api and self._session_id:
                self.api.complete_session(self._session_id)
            self.led_controller.cleanup()


if __name__ == "__main__":
    app = LeryAI()
    app.run()

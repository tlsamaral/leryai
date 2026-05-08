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
from wake_word import create_wake_word_detector

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


def _build_diagnosis_prompt() -> str:
    """
    System prompt for the icebreaker/diagnosis session.
    Designed to elicit natural speech across a range of complexity so the
    CEFR rater has enough signal to work with.
    """
    return """You are "Lery", a warm and friendly English tutor in a smart speaker device.
This is your FIRST conversation with the student — your goal is to get them talking naturally.

CURRENT MODE: DIAGNOSIS (icebreaker)
You do NOT know the student's level yet. Start simple, then gently escalate complexity
based on how the student responds. This lets you gauge their real proficiency.

CONVERSATION FLOW:
1. Greet warmly and introduce yourself. Ask their name and one simple question about their life.
2. React to their answer, then ask a slightly more open question (hobby, job, travel, goals).
3. Keep the conversation going naturally for 5–8 exchanges.
4. Do NOT correct errors — you are observing, not teaching, in this session.
5. Do NOT mention levels, CEFR, or that you are evaluating them.

CONSTRAINTS:
- Max 2 sentences per response (keep it conversational, not lecture-like).
- Be genuinely curious and warm — the student should feel welcome, not tested.
- Speak naturally — mix simple and slightly richer vocabulary to see how they respond."""


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
        self.wake_detector = create_wake_word_detector()
        self.api = create_api_client()

        self._config = None
        self._lesson_id = None
        self._lesson_system_prompt = None
        self._lesson_objectives = None
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
                self._lesson_objectives = lesson.get("objectives") or ""
                print(f"Lesson ready: [{lesson['title']}] — say 'start lesson' to begin")
            else:
                print("No active lesson found — FREE_TALK only")

        # FREE_TALK prompt with user level + profile injected
        free_talk_prompt = _build_free_talk_prompt(self._config)
        self.brain_manager = BrainManager(system_prompt=free_talk_prompt)

        # Flag: diagnosis needed on first wake word
        self._needs_diagnosis = (
            self.api is not None
            and self._config is not None
            and not self._config.get('diagnosisCompleted', True)
        )

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

    def _run_diagnosis_session(self) -> None:
        """
        Runs the one-time DIAGNOSIS icebreaker session.
        Collects the student's speech, rates it with Gemini, and calls the API
        to update currentLevel + diagnosisCompleted.
        After this returns, the caller should reload config.
        """
        print('\n[Lery] Starting DIAGNOSIS session (first-time level detection)...')

        diagnosis_brain = BrainManager(system_prompt=_build_diagnosis_prompt())

        session_id: Optional[str] = None
        if self.api:
            session_id = self.api.create_session(mode='DIAGNOSIS')

        # Collect all student speech for the rater
        student_lines: list[str] = []

        # Opening line from Lery
        opening = diagnosis_brain.generate_response(
            'Start the icebreaker. Greet the student warmly and ask their first question.'
        )
        self._speak(opening)
        self.set_state(State.LISTENING)

        silence_strikes = 0
        _MAX_DIAGNOSIS_TURNS = 8

        for _ in range(_MAX_DIAGNOSIS_TURNS):
            audio_file = self.audio_manager.record_audio(output_filename='data/audio/input.wav')

            if audio_file is None:
                silence_strikes += 1
                if silence_strikes >= 2:
                    break
                nudge = diagnosis_brain.generate_response(
                    'The student is silent. Gently encourage them to speak with a simple question.'
                )
                self._speak(nudge)
                self.set_state(State.LISTENING)
                continue

            silence_strikes = 0
            self.set_state(State.THINKING)
            user_text = self.transcribe_audio(audio_file)
            if not user_text:
                self.set_state(State.LISTENING)
                continue

            print(f'[Diagnosis] Student: {user_text}')
            student_lines.append(user_text)

            # Exit keywords end diagnosis early
            if _matches_keywords(user_text, _EXIT_KEYWORDS):
                break

            lery_reply = diagnosis_brain.generate_response(user_text)
            print(f'[Diagnosis] Lery: {lery_reply}')

            if self.api and session_id:
                self.api.create_log(
                    session_id=session_id,
                    user_audio_trans=user_text,
                    lery_response=lery_reply,
                )

            self._speak(lery_reply)
            self.set_state(State.LISTENING)

        # Rate the conversation
        self.set_state(State.THINKING)
        self._speak("Thank you for chatting with me! Give me just a moment to get everything ready for you.")

        estimated_level = 'A2'  # safe fallback
        if student_lines:
            transcript = '\n'.join(student_lines)
            estimated_level = diagnosis_brain.rate_cefr(transcript)

        if self.api and session_id:
            result = self.api.complete_diagnosis(session_id, estimated_level)
            if result:
                print(f'[Lery] Diagnosis complete: level set to {result.get("updatedLevel")}')

        self._speak(f"Great news! I've set up your learning journey. Let's get started!")

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
        # Stay in THINKING while synthesizing (may involve retries/network)
        try:
            files = self.text_to_speech(text)
        except Exception as e:
            print(f"[TTS] Failed to synthesize — skipping audio: {e}")
            return

        # Switch to SPEAKING only when audio is ready
        self.set_state(State.SPEAKING)
        for f in files:
            self.audio_manager.play_audio(f)
            time.sleep(0.2)

    def _run_session(self) -> None:
        """
        Runs one conversation session (from wake word to session end).
        Returns when the session ends — caller re-enters IDLE and waits
        for the next wake word.
        """
        self._silence_strikes = 0
        self._session_id = None
        self.set_state(State.LISTENING)

        while True:
            # ── Record ────────────────────────────────────────────────
            audio_file = self.audio_manager.record_audio(
                output_filename="data/audio/input.wav"
            )

            # ── No speech detected ────────────────────────────────────
            if audio_file is None:
                self._silence_strikes += 1

                if self._silence_strikes >= _MAX_SILENCE_STRIKES:
                    print("[Lery] No response — ending session.")
                    self._speak("I haven't heard from you in a while. Let's continue next time. Goodbye!")
                    return

                prompt = (
                    "The student has been silent. Gently check if they are still there "
                    "with a short, encouraging question. Max 1 sentence."
                )
                self.set_state(State.THINKING)
                nudge = self.brain_manager.generate_response(prompt)
                self._speak(nudge)
                self.set_state(State.LISTENING)
                continue

            # ── THINKING ──────────────────────────────────────────────
            self._silence_strikes = 0
            self.set_state(State.THINKING)
            user_text = self.transcribe_audio(audio_file)
            print(f"User: {user_text}")

            if not user_text:
                self.set_state(State.LISTENING)
                continue

            # ── Exit intent ───────────────────────────────────────────
            if _matches_keywords(user_text, _EXIT_KEYWORDS):
                self._speak("It was great talking with you! See you next time. Goodbye!")
                return

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
                self.set_state(State.LISTENING)
                continue

            # ── Normal turn ───────────────────────────────────────────
            self._ensure_session()
            response_text = self.brain_manager.generate_response(user_text)
            print(f"Lery: {response_text}")

            if response_text == "I'm sorry, I'm having trouble thinking right now.":
                self.set_state(State.ERROR)
                time.sleep(2)
                self.set_state(State.LISTENING)
                continue

            if self.api and self._session_id:
                scores: dict | None = None
                if self._session_mode == "GUIDED_LESSON":
                    scores = self.brain_manager.evaluate_turn(
                        user_input=user_text,
                        lery_response=response_text,
                        lesson_objectives=self._lesson_objectives or "",
                    )

                self.api.create_log(
                    session_id=self._session_id,
                    user_audio_trans=user_text,
                    lery_response=response_text,
                    grammatical_fixes=scores.get("grammatical_fixes") if scores else None,
                    task_achievement=scores.get("task_achievement") if scores else None,
                    grammar=scores.get("grammar") if scores else None,
                    vocabulary=scores.get("vocabulary") if scores else None,
                    fluency=scores.get("fluency") if scores else None,
                    total_score=scores.get("total_score") if scores else None,
                    evaluation_reasoning=scores.get("reasoning") if scores else None,
                )

            self._speak(response_text)
            # ── SPEAKING done → back to LISTENING (no wake word needed) ──
            self.set_state(State.LISTENING)

    def run(self):
        print("Lery AI Started. Press Ctrl+C to exit.")

        try:
            while True:
                # ── IDLE: wait for wake word ───────────────────────────
                self.set_state(State.IDLE)
                self.wake_detector.wait_for_wake_word()
                self.audio_manager.play_chime()

                # ── Diagnosis on first ever wake word ─────────────────
                if self._needs_diagnosis:
                    self._needs_diagnosis = False
                    self._run_diagnosis_session()
                    # Reload config so level + diagnosisCompleted are fresh
                    if self.api:
                        self._config = self.api.get_session_config()
                        if self._config and self._config.get('lesson'):
                            lesson = self._config['lesson']
                            self._lesson_id = lesson['id']
                            self._lesson_system_prompt = lesson['systemPrompt']
                            self._lesson_objectives = lesson.get('objectives') or ""
                        free_talk_prompt = _build_free_talk_prompt(self._config)
                        self.brain_manager = BrainManager(system_prompt=free_talk_prompt)
                    # Go back to IDLE — next wake word starts the real session
                    continue

                # ── Session: LISTENING ↔ THINKING ↔ SPEAKING loop ─────
                self._run_session()

                # Session ended — complete API record and reset mode
                if self.api and self._session_id:
                    self.api.complete_session(self._session_id)
                    self._session_id = None

                # Reset to FREE_TALK for next session
                self._session_mode = "FREE_TALK"
                free_talk_prompt = _build_free_talk_prompt(self._config)
                self.brain_manager = BrainManager(system_prompt=free_talk_prompt)

        except KeyboardInterrupt:
            print("\nExiting Lery AI...")
        finally:
            if self.api and self._session_id:
                self.api.complete_session(self._session_id)
            self.led_controller.cleanup()


if __name__ == "__main__":
    app = LeryAI()
    app.run()

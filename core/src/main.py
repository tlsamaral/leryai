import os
import time
from enum import Enum
from dotenv import load_dotenv
from openai import OpenAI
from gtts import gTTS

from audio_manager import AudioManager
from brain_manager import BrainManager
from led_controller import LEDController

# Load environment variables
load_dotenv()

# Initialize OpenAI for Whisper
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class State(Enum):
    IDLE = "IDLE"
    LISTENING = "LISTENING"
    THINKING = "THINKING"
    SPEAKING = "SPEAKING"

class LeryAI:
    def __init__(self):
        self.state = State.IDLE
        self.audio_manager = AudioManager()
        self.brain_manager = BrainManager()
        self.led_controller = LEDController()
        self.led_controller.set_state("IDLE")

    def set_state(self, new_state):
        self.state = new_state
        print(f"State: {self.state.value}")
        self.led_controller.set_state(self.state.value)

    def transcribe_audio(self, audio_file):
        """
        Transcribes audio using OpenAI Whisper.
        """
        if not os.path.exists(audio_file):
            return None
        
        try:
            with open(audio_file, "rb") as audio:
                transcription = client.audio.transcriptions.create(
                    model="whisper-1", 
                    file=audio
                )
            return transcription.text
        except Exception as e:
            print(f"Error during transcription: {e}")
            return None

    def text_to_speech(self, text):
        """
        Converts text to speech using gTTS, handling language switching.
        Returns a list of generated audio file paths.
        """
        try:
            import re
            # Split text by [PT]...[/PT] tags
            # The regex keeps the delimiters to help identify segments, but we process them
            parts = re.split(r'(\[PT\].*?\[/PT\])', text, flags=re.DOTALL)
            
            files = []
            for i, part in enumerate(parts):
                if not part.strip():
                    continue
                    
                if part.startswith("[PT]") and part.endswith("[/PT]"):
                    # Process Portuguese
                    clean_text = part.replace("[PT]", "").replace("[/PT]", "").strip()
                    lang = 'pt'
                else:
                    # Process English
                    clean_text = part.strip()
                    lang = 'en'
                
                # Remove markdown formatting (asterisks, underscores for bold/italic)
                clean_text = re.sub(r'[*_]+', '', clean_text)
                
                if not clean_text:
                    continue
                    
                filename = f"data/audio/output_{i}.mp3"
                tts = gTTS(text=clean_text, lang=lang)
                tts.save(filename)
                files.append(filename)
                
            return files
        except Exception as e:
            print(f"Error during TTS: {e}")
            return []

    def run(self):
        print("Lery AI Started. Press Ctrl+C to exit.")
        
        try:
            while True:
                # 1. IDLE -> LISTENING
                input("Press Enter to start recording...") # Simple trigger for now
                self.set_state(State.LISTENING)
                
                # 2. Record Audio
                audio_file = self.audio_manager.record_audio(output_filename="data/audio/input.wav")
                
                # 3. LISTENING -> THINKING
                self.set_state(State.THINKING)
                
                # 4. Transcribe
                user_text = self.transcribe_audio(audio_file)
                print(f"User: {user_text}")
                
                if user_text:
                    # 5. Get Brain Response
                    response_text = self.brain_manager.generate_response(user_text)
                    print(f"Lery: {response_text}")
                    
                    # 6. THINKING -> SPEAKING
                    self.set_state(State.SPEAKING)
                    
                    # 7. Text to Speech
                    tts_files = self.text_to_speech(response_text)
                    
                    # 8. Play Audio
                    if tts_files:
                        for f in tts_files:
                            self.audio_manager.play_audio(f)
                            # Small pause between segments
                            time.sleep(0.2)
                        
                # 9. SPEAKING -> IDLE
                self.set_state(State.IDLE)
                
        except KeyboardInterrupt:
            print("\nExiting Lery AI...")
        finally:
            self.led_controller.set_state("IDLE")

if __name__ == "__main__":
    app = LeryAI()
    app.run()

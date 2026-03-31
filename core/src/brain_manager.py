from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

class BrainManager:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in .env")

        self.client = genai.Client(api_key=api_key)
        self.system_prompt = self._load_system_prompt()
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

    def generate_response(self, user_input):
        """
        Sends user input to Gemini and returns the response text.
        """
        try:
            response = self.chat.send_message(message=user_input)
            return response.text
        except Exception as e:
            print(f"Error generating response: {e}")
            return "I'm sorry, I'm having trouble thinking right now."

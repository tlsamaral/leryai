import os
from dotenv import load_dotenv
import google.generativeai as genai
from openai import OpenAI

def test_keys():
    load_dotenv()
    
    # 1. Test Google Key
    print("Testing Google API Key...")
    google_key = os.getenv("GOOGLE_API_KEY")
    if not google_key:
        print("❌ GOOGLE_API_KEY is missing!")
    else:
        try:
            genai.configure(api_key=google_key)
            
            # List models to see what is available
            print("Available Models:")
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    print(f"- {m.name}")
            
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content("Say 'Hello' if you can hear me.")
            print(f"✅ Google Gemini works! Response: {response.text.strip()}")
        except Exception as e:
            print(f"❌ Google Gemini Failed: {e}")

    print("-" * 20)

    # 2. Test OpenAI Key
    print("Testing OpenAI API Key...")
    openai_key = os.getenv("OPENAI_API_KEY")
    if not openai_key:
        print("❌ OPENAI_API_KEY is missing!")
    else:
        try:
            client = OpenAI(api_key=openai_key)
            # Simple models list check to verify auth
            client.models.list()
            print("✅ OpenAI works!")
        except Exception as e:
            print(f"❌ OpenAI Failed: {e}")

if __name__ == "__main__":
    test_keys()

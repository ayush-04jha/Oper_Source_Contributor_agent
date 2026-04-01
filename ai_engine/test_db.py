from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_KEY"))

print("--- ALL MODELS AVAILABLE TO YOUR KEY ---")
try:
    for model in client.models.list():
        # This will print the model name and what it can do
        print(f"-> {model.name} | Methods: {model.supported_methods}")
except Exception as e:
    print(f"Error listing models: {e}")
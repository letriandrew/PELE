import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

class Settings:
    openai_api_key: str = os.getenv("OPEN_API_KEY")
    mongo_url: str = os.getenv("MONGODB_CONN_STRING")  # Add MongoDB URI

    def __init__(self):
        if not self.openai_api_key:
            raise RuntimeError("OpenAI API key not found. Ensure it's set in the .env file.")
        if not self.mongo_url:
            raise RuntimeError("MongoDB URI not found. Ensure it's set in the .env file.")

settings = Settings()

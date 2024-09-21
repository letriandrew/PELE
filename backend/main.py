# backend/main.py
from fastapi import FastAPI, HTTPException
import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

#Load OpenAI API Key
openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    raise RuntimeError("OpenAI API key not found. Ensure it's set in the .env file.")

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome!"}

@app.get("/api/generate")
async def generate_text(prompt: str):
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt},]
        )
        return {"generated_text": response.choices[0].message.content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


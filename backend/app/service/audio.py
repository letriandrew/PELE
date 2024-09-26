from fastapi import File, UploadFile
import openai
from app.config import settings
import io
from typing import List
from io import BytesIO


openai.api_key = settings.openai_api_key

def create_transcript(buffer: BytesIO) -> str:
    transcription =  openai.Audio.transcribe(
        model="whisper-1",
        file=buffer,
    )
    return transcription['text']

def produce_questions(transcript: str) -> str:
    response = openai.ChatCompletion.create(model="gpt-3.5-turbo",
    messages=[{
        "role": "system", 
        "content": "You are a diligent and engaged student always looking to learn more by asking questions pertaining to the subject matter. This is because you believe in the idea of true mastery or knowledge of a subject comes with the ability to teach it.",

        "role": "user", 
        "content": f"Generate a question based on what the user is teaching here: \n {transcript}"
    
    }])

    return response['choices'][0]['message']['content']
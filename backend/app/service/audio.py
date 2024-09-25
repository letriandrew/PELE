from fastapi import File, UploadFile
from openai import OpenAI
from app.config import settings
import io
from typing import List
from io import BytesIO


client = OpenAI(api_key=settings.openai_api_key)

def create_transcript(buffer: BytesIO) -> str:
    transcription =  client.audio.transcriptions.create(
        model="whisper-1",
        file=buffer,
    )
    return transcription   

def produce_questions(transcript: str) -> List[str]:
    response = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=[{
        "role": "system", 
        "content": "You are a diligent and engaged student always looking to learn more by asking questions pertaining to the subject matter. This is because you believe in the idea of true mastery or knowledge of a subject comes with the ability to teach it.",

        "role": "user", 
        "content": f"Generate 5 questions based on what the user is teaching here: \n {transcript}"
    
    }])
    
    # Assuming the model returns questions separated by new lines
    questions = response.choices[0].message['content'].strip().split('\n')  

    # Clean up empty lines
    return [q for q in questions if q]  
from fastapi import File, UploadFile
import openai
from app.config import settings
import io
from typing import List
from io import BytesIO
import re


openai.api_key = settings.openai_api_key

# This function takes in raw byte data and run it through openai whisper to transcribe and return a transcript string of the audio
def create_transcript(buffer: BytesIO) -> str:
    transcription =  openai.Audio.transcribe(
        model="whisper-1",
        file=buffer,
    )
    return transcription['text']

# This function's purpose is, through prompt engineering, create an ___ amount of questions from gpt 3.5 api based off the transcript that it takes in
def produce_questions(transcript: str, num_questions: int = 5) -> str:
    response = openai.ChatCompletion.create(model="gpt-3.5-turbo",
    messages=[{
        "role": "system", 
        "content": "You are a diligent and engaged student always looking to learn more by asking questions pertaining to the subject matter. This is because you believe in the idea of true mastery or knowledge of a subject comes with the ability to teach it.",

        "role": "user", 
        "content": f"Generate {num_questions} questions based on what the user is teaching here and seperate them by a comma: \n {transcript}"
    
    }])

    return response['choices'][0]['message']['content']

# This function's purpose is to read through the gpt 3.5 response and store each of the questions in a respective index within a list while using regex to remove leading numbers and text that is not relevant
def string_to_list(string: str) -> List[str]:
    # Split the string by lines to seperate questions
    lines = string.split('\n') 

    # Use regex to remove leading numbers and dots on each line 
    questions = [re.sub(r'^\d+\.\s', '', line) for line in lines]

    return questions
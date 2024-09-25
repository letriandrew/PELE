from fastapi import APIRouter, HTTPException, File, UploadFile
from ..service.audio import create_transcript, produce_questions

from openai import OpenAI
from app.config import settings
import io

router = APIRouter()

@router.post("/process-audio")
async def process_audio(audio: UploadFile = File(...)):
    try:
        audio_content = await audio.read()  # Read the content of the uploaded file

        buffer = io.BytesIO(audio_content)
        buffer.name = "test.mp3"

        transcript = create_transcript(buffer)

        return transcript

        #questions_list = produce_questions(transcript)

        #return questions_list
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

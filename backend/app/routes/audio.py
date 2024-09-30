from fastapi import APIRouter, HTTPException, File, UploadFile
from ..service.audio import create_transcript, produce_questions, string_to_list

from app.config import settings
import io

router = APIRouter()

@router.post("/process-audio")
async def process_audio(audio: UploadFile = File(...)):
    try:
        # Read the content of the uploaded file as raw byte string
        audio_content = await audio.read()  

        # Create in memory stream (buffer) to act like a regular file
        buffer = io.BytesIO(audio_content)
        buffer.name = "test.mp3"

        # Transform audio_content file from audio to text
        transcript = create_transcript(buffer) 

        # Produce questions based off the recording text and store to return in a list
        questions_list = string_to_list(produce_questions(transcript))  

        return {
            "transcript": transcript,
            "questions": questions_list
            }
    
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException, File, UploadFile
from ..service.audio import create_transcript, produce_questions, string_to_list

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

        #return transcript

        questions_list = produce_questions(transcript)
        #print(questions_list)
        
        questions_list = string_to_list(questions_list)


        for i in questions_list:
            print(i)


        return {
            "transcript": transcript,
            "questions": questions_list
            }
    
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

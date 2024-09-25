from fastapi import APIRouter, HTTPException, File, UploadFile
from ..service.audio import process_audio_file

from openai import OpenAI
from app.config import settings
import io

router = APIRouter()

@router.post("/process-audio")
async def process_audio(audio: UploadFile = File(...)):
    try:
        generated_audio = await process_audio_file(audio)
        return {"Recorded Audio in Text": generated_audio}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

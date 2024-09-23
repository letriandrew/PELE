from fastapi import APIRouter, HTTPException, File, UploadFile
from app.process_audio import process_audio

router = APIRouter()

@router.post("/process-audio")
async def process_audio(file: UploadFile = File(...)):
    try:
        transc = await process_audio(file)
        return {"transcription": transc}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

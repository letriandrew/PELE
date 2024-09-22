from fastapi import APIRouter, HTTPException
from app.openai_service import generate_text_from_prompt

router = APIRouter()

@router.get("/api/generate")
async def generate_text(prompt: str):
    try:
        generated_text = await generate_text_from_prompt(prompt)
        return {"generated_text": generated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
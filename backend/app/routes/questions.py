from fastapi import Depends, HTTPException, status, APIRouter, Response, Request
from ..database import schemas
from sqlalchemy.orm import Session
from ..service import question_service, transcript_service
from ..database.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

@router.post("/save-questions")
async def save_questions(
    transcript: schemas.TranscriptCreate, 
    questions: list[schemas.QuestionCreate],
    db: Session = Depends(get_db)
):
    res_transcript = transcript_service.save_transcript(db,transcript)
    
    if not res_transcript:
        raise HTTPException(status_code=500, detail="Database save failed")
    
    for i in questions:
        res_question = question_service.save_question(db,i,res_transcript.id)
        if not res_question:
            raise HTTPException(status_code=500, detail="Database save failed")
        
    return {"message": "Save successful"}

@router.get("/get-questions")
async def get_questions(request: Request, db: Session = Depends(get_db)):
    user_id = request.state.user.id
    transcript_service.get_transcripts(db,user_id)

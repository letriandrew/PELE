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

@router.post("/save-set")
async def save_questions(
    request: Request,
    transcript: schemas.TranscriptCreate, 
    db: Session = Depends(get_db)
):
    
    user_id = request.state.user.id
    res_transcript = transcript_service.save_transcript(db,transcript.transcript,user_id,transcript.title)
    
    if not res_transcript:
        raise HTTPException(status_code=500, detail="Database save failed")
    
    for i in transcript.questions:
        res_question = question_service.save_question(db,i,res_transcript.id,user_id)
        if not res_question:
            raise HTTPException(status_code=500, detail="Database save failed")
        
    return {"message": "Save successful"}

@router.get("/get-sets",response_model=schemas.User)
async def get_questions(request: Request, db: Session = Depends(get_db)):
    user_id = request.state.user.id
    return transcript_service.get_transcripts(db,user_id)

# deletes transcript and all questions related to it
@router.delete("/delete-set/{id}")
async def delete_transcript(request: Request, id: int, db: Session = Depends(get_db)):
    user_id = request.state.user.id
    res = transcript_service.delete_transcript(db,id,user_id)
    return {
        "message": f"deleted transcript with id: {res.id}"
    }

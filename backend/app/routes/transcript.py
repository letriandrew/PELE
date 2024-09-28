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

@router.patch("/change-title")
async def change_title(request: Request, body: schemas.TranscriptTitleChange, db: Session = Depends(get_db)):
    user_id = request.state.user.id
    res = transcript_service.change_transcript_title(db,body.id,user_id,body.title)
    return {
        "message": f"updated transcript title with id: {res.id}"
    }
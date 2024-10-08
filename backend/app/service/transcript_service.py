from sqlalchemy.orm import Session
from ..database import schemas, models
from fastapi import HTTPException, status
from typing import Optional

# saves the audio transcript in the db
def save_transcript(db: Session, transcript: str, user_id: int, title: Optional[str] = None):
    db_transcript = models.Transcript(transcript=transcript, user_id=user_id, title = title)
    db.add(db_transcript)
    db.commit()
    db.refresh(db_transcript)
    return db_transcript

# deletes the audio transcript in the db
def delete_transcript(db: Session, id: int, user_id: int):
    db_transcript = db.query(models.Transcript).filter(models.Transcript.id == id).first()

    if db_transcript is None:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"No transcript with id: {id}")

    if db_transcript.user_id != user_id:
        raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Invalid credentials")
    
    db.delete(db_transcript)
    db.commit()

    return db_transcript  

# simple grab transcript from db
def get_transcripts(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

# changes audio transcript title
def change_transcript_title(db: Session, id: int, user_id: int, title: str):
    db_transcript = db.query(models.Transcript).filter(models.Transcript.id == id).first()

    if db_transcript.user_id != user_id:
        raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Invalid credentials")
    
    if db_transcript is None:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"No transcript with id: {id}")
    
    db_transcript.title = title
    db.commit()

    return db_transcript 
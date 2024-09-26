from sqlalchemy.orm import Session
from ..database import schemas, models

def save_transcript(db: Session, transcript: schemas.TranscriptCreate):
    db_transcript = models.Transcript(transcript=transcript.transcript, user_id=transcript.user_id)
    db.add(db_transcript)
    db.commit()
    db.refresh(db_transcript)
    return db_transcript


def delete_transcript(db: Session, id: int):
    db_transcript = db.query(models.Transcript).filter(models.Transcript.id == id).first()

    if db_transcript is None:
        return None  
    
    db.delete(db_transcript)
    db.commit()

    return db_transcript  

def get_transcripts(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()
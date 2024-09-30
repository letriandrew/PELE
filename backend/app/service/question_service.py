from sqlalchemy.orm import Session
from ..database import schemas, models
from fastapi import HTTPException, status

# save generated questions to db
def save_question(db: Session, question: schemas.QuestionCreate, transcript_id: int, user_id: int):
    db_question = models.Question(question = question.question, answer = question.answer, transcript_id = transcript_id, complete = question.complete)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

# delete generatad question from db
def delete_question(db: Session, id: int, user_id: int):
    db_question = db.query(models.Question).filter(models.Question.id == id).first()
    db_transcript = db.query(models.Transcript).filter(models.Transcript.id == db_question.transcript_id).first()

    if db_question is None:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"No question with id: {id}")  
    
    if db_transcript is None:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"No transcript with id: {db_question.transcript_id}")  

    if db_transcript.user_id != user_id:
        raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Invalid credentials")
    
    db.delete(db_question)
    db.commit()

    return db_question  

# mark question status/completion in the db
def handle_complete(db: Session, id: int, user_id: int):
    db_question = db.query(models.Question).filter(models.Question.id == id).first()
    db_transcript = db.query(models.Transcript).filter(models.Transcript.id == db_question.transcript_id).first()

    if db_question is None:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"No question with id: {id}")  
    
    if db_transcript is None:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"No transcript with id: {db_question.transcript_id}")  

    if db_transcript.user_id != user_id:
        raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Invalid credentials")
    
    db_question.complete = not db_question.complete
    db.commit()
    return db_question
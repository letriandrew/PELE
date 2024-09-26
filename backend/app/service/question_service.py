from sqlalchemy.orm import Session
from ..database import schemas, models

def save_question(db: Session, question: schemas.QuestionCreate):
    db_question = models.Question(question = question.question, answer = question.answer, transcript_id = question.transcript_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def delete_question(db: Session, id: int):
    db_question = db.query(models.Question).filter(models.Question.id == id).first()

    if db_question is None:
        return None  
    
    db.delete(db_question)
    db.commit()

    return db_question  
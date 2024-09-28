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

@router.delete("/delete-question/{id}")
async def delete_question(request: Request, id: int, db: Session = Depends(get_db)):
    # to be implemented
    pass

@router.patch("/handle-complete")
async def handle_complete(request: Request, body : schemas.QuestionHandleComplete, db: Session = Depends(get_db)):
    user_id = request.state.user.id
    for i in body.id_list:
        question_service.handle_complete(db,i,user_id)

    return {
        "message": f"handled complete for questions with id(s): {body.id_list}"
    }

# @router.get("/handle-complete")
# async def handle_complete(request: Request, db: Session = Depends(get_db)):
    

#     return {
#         "message": f"handled complete for questions with id(s): {1}"
#     }

@router.patch("/change-answer/{id}")
async def change_answer(request: Request, id: int, answer: str, db: Session = Depends(get_db)):
    # to be implemented
    pass
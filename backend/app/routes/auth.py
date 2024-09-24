from fastapi import Depends, HTTPException, status, APIRouter, Response
from sqlalchemy.orm import Session
from .. import schemas
from ..service import auth
from ..database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

authRouter = APIRouter()

@authRouter.post("/login")
async def login_for_access_token(
    user: schemas.UserLogin, 
    response: Response, 
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, user)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create the access token
    access_token = auth.create_access_token(
        schemas.UserToken(
            id=user.id,
            email=user.email,
            name=user.name
        )
    )
    
    # Set the access token in a cookie
    response.set_cookie(
        key="token", 
        value=access_token,
        httponly=False,                  
        secure=True,                  
        samesite="lax"                   
    )
    
    
    return {"token": access_token}
from fastapi import Depends, HTTPException, status, APIRouter, Response, Cookie
from sqlalchemy.orm import Session
from ..database import schemas
from ..service import auth
from ..database.database import SessionLocal

# may need to put this somewhere to import, cant just import from main or it causes circular dependency error
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

# route handler to authenticate and login user
@router.post("/login")
async def login_for_access_token(
    user: schemas.UserLogin, 
    response: Response, 
    db: Session = Depends(get_db)
):
    foundUser = auth.authenticate_user(db, user)
    if not foundUser:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create the access token
    access_token = auth.create_access_token(
        schemas.UserToken(
            id=foundUser.id,
            email=foundUser.email,
            name=foundUser.name
        )
    )
    
    # Set the access token in a cookie
    response.set_cookie(
        key="pele-access-token", 
        value=access_token,
        httponly=False,                  
        secure=False,                  
        samesite="lax"                   
    )
    
    
    return {
        "id": foundUser.id,
        "email": foundUser.email,
        "name": foundUser.name
    }

# route handler to logout user
@router.get("/logout")
async def logout(response: Response):
    response.delete_cookie("pele-access-token")
    return {"message":"successfully logged out"}

# verify a user's token and retrieve the user based off the token from the db
@router.get("/verifyToken")
async def logout(token: str = Cookie(alias="pele-access-token"), db: Session = Depends(get_db)):
    await auth.get_current_user(db, token)
    return {"message":"successfully verified"}
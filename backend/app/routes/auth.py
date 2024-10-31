from fastapi import Depends, HTTPException, status, APIRouter, Response, Cookie
from sqlalchemy.orm import Session
from ..database import schemas
from ..service import auth
from ..database.database import SessionLocal
from ..database import crud
import httpx

# may need to put this somewhere to import, cant just import from main or it causes circular dependency error
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

# google OAuth2 token is processed here
@router.post("/login-signup-google")
async def google_login_for_access_token(
    user_token: schemas.UserGoogleToken,
    response: Response,
    db: Session = Depends(get_db)
):
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f'https://www.googleapis.com/oauth2/v1/userinfo?access_token={user_token.token}', 
                headers={
                    'Authorization': f'Bearer {user_token.token}',
                    'Accept': 'application/json'
                }
            )
            res.raise_for_status()
            
            user_info = res.json()

            email = user_info.get('email')
            name = user_info.get('name')

            user = crud.get_user_by_email(db,email)

            # if user has not created an account already then it will create one
            if not user:
                user = crud.create_user(db,schemas.UserCreate(email=email,name=name))
            
            access_token = auth.create_access_token(
                schemas.UserToken(
                    id=user.id,
                    email=user.email,
                    name=user.name
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
                "id": user.id,
                "email": user.email,
                "name": user.name
            }
        
    except httpx.HTTPStatusError as error:
        print("Error fetching google account details:", error)
        response.status_code = error.response.status_code
        return {"error": str(error)}

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
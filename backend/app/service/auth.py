from datetime import datetime, timedelta, timezone

import jwt
from fastapi import HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from ..database import schemas
from ..database import crud
from sqlalchemy.orm import Session
from ..config import settings
import httpx

# initialize hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# helper function to verify password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# helper function that returns hash of given password
def get_password_hash(password):
    return pwd_context.hash(password)

# authenticates user
def authenticate_user(db: Session, user: schemas.UserLogin):
    foundUser = crud.get_user_by_email(db, user.email)
    if not foundUser:
        return False
    if not verify_password(user.password, foundUser.hashed_password):
        return False
    return foundUser

# creates jwt token
def create_access_token(data: schemas.UserToken, expires_delta: timedelta | None = None):
    to_encode = data.model_dump()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

# returns decoded jwt
async def get_current_user(db: Session, token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        id: str = payload.get("id")
        if id is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    user : schemas.UserToken = crud.get_user(db,id)
    if user is None:
        raise credentials_exception
    return user

async def fetch_google_user_info(token: str) -> dict:
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f'https://www.googleapis.com/oauth2/v1/userinfo?access_token={token}', 
            headers={
                'Authorization': f'Bearer {token}',
                'Accept': 'application/json'
            }
        )
        res.raise_for_status()
        return res.json()
    
# make sure to change this on launch day 0_0
def set_access_token_cookie(response: Response, access_token: str):
    response.set_cookie(
        key="pele-access-token", 
        value=access_token,
        httponly=False,                  
        secure=False,                   
        samesite="lax"                 
    )
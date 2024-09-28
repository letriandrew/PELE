from datetime import datetime, timedelta, timezone

import jwt
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from ..database import schemas
from ..database import crud
from sqlalchemy.orm import Session
from ..config import settings

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
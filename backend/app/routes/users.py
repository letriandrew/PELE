from fastapi import APIRouter, HTTPException
from app.models import User
from app.crud import create_user, get_user

router = APIRouter()

@router.post("/api/users")
async def add_user(user: User):
    await create_user(user)
    return {"message": "User created"}

@router.get("/api/users/{username}")
async def read_user(username: str):
    user = await get_user(username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
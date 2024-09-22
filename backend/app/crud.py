from app.database import get_database
from app.models import User

async def create_user(user: User):
    db = get_database()
    user_dict = user.dict()
    await db.users.insert_one(user_dict)  # Save the user document to MongoDB

async def get_user(username: str):
    db = get_database()
    user = await db.users.find_one({"username": username})
    return user
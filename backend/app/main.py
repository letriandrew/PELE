from fastapi import FastAPI
from app.routes import generate, users
from app.database import connect_to_mongo, disconnect_from_mongo

app = FastAPI()

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await disconnect_from_mongo()

@app.get("/")
def read_root():
    return {"message": "Welcome!"}

app.include_router(generate.router)
app.include_router(users.router)
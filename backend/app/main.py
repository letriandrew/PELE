from app.routes import generate, audio

from fastapi import Depends, FastAPI, HTTPException, status, File, UploadFile, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import models

from .database import schemas
from .database.database import SessionLocal, crud, engine
from .routes.auth import authRouter
from .service.auth import get_current_user

import io
from openai import OpenAI
from app.config import settings

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# middleware to secure all routes starting with "/audio/"
@app.middleware("http")
async def secure_path(request: Request, call_next):
    db = SessionLocal()
    try:
        target_paths = ["/audio/"]

        token = request.cookies.get('pele-access-token')
        if any(request.url.path.startswith(path) for path in target_paths):
            try:
                await get_current_user(db, token)
            except HTTPException as e:
                return JSONResponse(status_code=e.status_code, content={"message": e.detail})
        
        response = await call_next(request)
    finally:
        db.close()

    return response


# include different routes here
app.include_router(authRouter, prefix='/auth')
app.include_router(generate.router)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users/", response_model=schemas.User, status_code=status.HTTP_200_OK)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/users/{user_id}/items/", response_model=schemas.Item)
def create_item_for_user(
    user_id: int, item: schemas.ItemCreate, db: Session = Depends(get_db)
):
    return crud.create_user_item(db=db, item=item, user_id=user_id)


@app.get("/items/", response_model=list[schemas.Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_items(db, skip=skip, limit=limit)
    return items

@app.get("/test")
def read_root():
    return {"message": "Welcome!"}

#app.include_router(audio.router)

@app.post("/process-audio")
async def process_audio(audio: UploadFile = File(...)):
    # Save or process the file
    audio_content = await audio.read()  # Read the content of the uploaded file

    buffer = io.BytesIO(audio_content)

    buffer.name = "test.mp3"

    client = OpenAI()
    client.api_key = settings.openai_api_key

    transcription =  client.audio.transcriptions.create(
        model="whisper-1",
        file=buffer,
    )
    return transcription


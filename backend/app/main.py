from app.routes import audio, auth, study_set, question, transcript

from fastapi import Depends, FastAPI, HTTPException, status, File, UploadFile, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import models

from .database import schemas
from .database.database import SessionLocal, engine
from .database import crud
from .service.auth import get_current_user
from starlette.status import HTTP_204_NO_CONTENT
from starlette.responses import Response

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# middleware to secure all routes starting with 'target_paths'
@app.middleware("http")
async def secure_path(request: Request, call_next):
    if request.method == "OPTIONS":
        print(f"OPTIONS request for {request.url.path}")

        response = Response(status_code=HTTP_204_NO_CONTENT)
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,DELETE,PUT,PATCH,OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
            
        return response

    db = SessionLocal()
    try:
        target_paths = ["/audio/","/study-set/","/question/","/transcript/"]

        token = request.cookies.get('pele-access-token')
        
        if any(request.url.path.startswith(path) for path in target_paths):
            try:
                user = await get_current_user(db, token)
                request.state.user = user
            except HTTPException as e:
                print("HERE")
                return JSONResponse(status_code=e.status_code, content={"message": e.detail})
        
        response = await call_next(request)
    finally:
        db.close()

    return response


# include different routes here
app.include_router(auth.router, prefix='/auth')
app.include_router(study_set.router, prefix='/study-set')
app.include_router(question.router, prefix='/question')
app.include_router(transcript.router, prefix='/transcript')
app.include_router(audio.router)


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


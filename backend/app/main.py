from fastapi import FastAPI
from app.routes import generate

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome!"}

# Include the routes from the generate.py file
app.include_router(generate.router)

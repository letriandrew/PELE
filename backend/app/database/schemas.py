from typing import Union

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Schema for Question
class QuestionBase(BaseModel):
    question: str
    answer: Optional[str] = None
    complete: Optional[bool] = False

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    date_created: datetime

    class Config:
        from_attributes = True

class QuestionHandleComplete(BaseModel):
    id_list: list[int]


# Schema for Transcript

class TranscriptBase(BaseModel):
    transcript: str
    title: Optional[str] = None

class TranscriptCreate(TranscriptBase):
    questions: list[QuestionCreate]

class Transcript(TranscriptBase):
    id: int
    date_created: datetime
    questions: list[Question] = []  

    class Config:
        from_attributes = True
    
class TranscriptTitleChange(BaseModel):
    id: int
    title: str

# need to remove this schema

class ItemBase(BaseModel):
    title: str
    description: Union[str, None] = None


class ItemCreate(ItemBase):
    pass


class Item(ItemBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True


# User schema

class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    name: str
    password: str


class User(UserBase):
    id: int
    name: str
    is_active: bool
    transcripts: list[Transcript] = []

    class Config:
        from_attributes = True

class UserLogin(UserBase):
    password: str

class UserToken(UserBase):
    id: int
    email:str
    name: str




class Token(BaseModel):
    token: str
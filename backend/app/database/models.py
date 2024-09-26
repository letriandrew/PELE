from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    date_created = Column(DateTime, default = func.now())
    is_active = Column(Boolean, default=True)

    items = relationship("Item", back_populates="owner")

    transcripts = relationship("Transcript", cascade="all,delete", back_populates="owner")


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")

class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True, nullable=True)
    transcript = Column(String)
    date_created = Column(DateTime, default = func.now())
    user_id = Column(Integer, ForeignKey("users.id"))

    questions = relationship("Question", cascade="all,delete", back_populates="owner")

    owner = relationship("User", back_populates="transcripts")



class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    question = Column(String)
    answer = Column(String, nullable=True)
    complete = Column(Boolean, default=False)
    date_created = Column(DateTime, default = func.now())
    transcript_id = Column(Integer, ForeignKey("transcripts.id"))

    owner = relationship("Transcript", back_populates="questions")
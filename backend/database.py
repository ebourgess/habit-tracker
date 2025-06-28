import os
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# Use environment variable or default to data directory
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/habits.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Habit(Base):
    __tablename__ = "habits"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to track entries
    entries = relationship("HabitEntry", back_populates="habit", cascade="all, delete-orphan")

class HabitEntry(Base):
    __tablename__ = "habit_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    completed = Column(Boolean, default=False)
    notes = Column(String, nullable=True)
    
    # Relationship back to habit
    habit = relationship("Habit", back_populates="entries")

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

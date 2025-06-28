from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date
from dateutil.relativedelta import relativedelta

from database import get_db, Habit as HabitModel, HabitEntry as HabitEntryModel
from schemas import Habit, HabitCreate, HabitEntry, HabitEntryCreate, HabitWithEntries, HabitStats

app = FastAPI(title="Habit Tracker API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React and Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Habit endpoints
@app.post("/habits/", response_model=Habit)
def create_habit(habit: HabitCreate, db: Session = Depends(get_db)):
    db_habit = HabitModel(name=habit.name, description=habit.description)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

@app.get("/habits/", response_model=List[Habit])
def get_habits(db: Session = Depends(get_db)):
    return db.query(HabitModel).all()

@app.get("/habits/{habit_id}", response_model=HabitWithEntries)
def get_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(HabitModel).filter(HabitModel.id == habit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit

@app.put("/habits/{habit_id}", response_model=Habit)
def update_habit(habit_id: int, habit: HabitCreate, db: Session = Depends(get_db)):
    db_habit = db.query(HabitModel).filter(HabitModel.id == habit_id).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    db_habit.name = habit.name
    db_habit.description = habit.description
    db.commit()
    db.refresh(db_habit)
    return db_habit

@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    db_habit = db.query(HabitModel).filter(HabitModel.id == habit_id).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    db.delete(db_habit)
    db.commit()
    return {"message": "Habit deleted successfully"}

# Habit entry endpoints
@app.post("/habit-entries/", response_model=HabitEntry)
def create_habit_entry(entry: HabitEntryCreate, db: Session = Depends(get_db)):
    # Check if habit exists
    habit = db.query(HabitModel).filter(HabitModel.id == entry.habit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    # Check if entry for this date already exists
    existing_entry = db.query(HabitEntryModel).filter(
        HabitEntryModel.habit_id == entry.habit_id,
        HabitEntryModel.date == entry.date
    ).first()
    
    if existing_entry:
        raise HTTPException(status_code=400, detail="Entry for this date already exists")
    
    db_entry = HabitEntryModel(
        habit_id=entry.habit_id,
        date=entry.date,
        completed=entry.completed,
        notes=entry.notes
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.put("/habit-entries/{entry_id}", response_model=HabitEntry)
def update_habit_entry(entry_id: int, entry: HabitEntryCreate, db: Session = Depends(get_db)):
    db_entry = db.query(HabitEntryModel).filter(HabitEntryModel.id == entry_id).first()
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Habit entry not found")
    
    db_entry.completed = entry.completed
    db_entry.notes = entry.notes
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.get("/habits/{habit_id}/entries", response_model=List[HabitEntry])
def get_habit_entries(habit_id: int, db: Session = Depends(get_db)):
    return db.query(HabitEntryModel).filter(HabitEntryModel.habit_id == habit_id).all()

@app.get("/habits/{habit_id}/stats", response_model=HabitStats)
def get_habit_stats(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(HabitModel).filter(HabitModel.id == habit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    entries = db.query(HabitEntryModel).filter(HabitEntryModel.habit_id == habit_id).all()
    
    total_days = len(entries)
    completed_days = len([e for e in entries if e.completed])
    completion_rate = (completed_days / total_days * 100) if total_days > 0 else 0
    
    # Calculate current streak
    current_streak = 0
    entries_sorted = sorted(entries, key=lambda x: x.date, reverse=True)
    for entry in entries_sorted:
        if entry.completed:
            current_streak += 1
        else:
            break
    
    # Calculate longest streak
    longest_streak = 0
    temp_streak = 0
    for entry in sorted(entries, key=lambda x: x.date):
        if entry.completed:
            temp_streak += 1
            longest_streak = max(longest_streak, temp_streak)
        else:
            temp_streak = 0
    
    return HabitStats(
        habit_id=habit_id,
        habit_name=habit.name,
        total_days=total_days,
        completed_days=completed_days,
        completion_rate=round(completion_rate, 2),
        current_streak=current_streak,
        longest_streak=longest_streak
    )

@app.get("/")
def read_root():
    return {"message": "Habit Tracker API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

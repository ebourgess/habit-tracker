from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class HabitBase(BaseModel):
    name: str
    description: Optional[str] = None

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class HabitEntryBase(BaseModel):
    date: datetime
    completed: bool = False
    notes: Optional[str] = None

class HabitEntryCreate(HabitEntryBase):
    habit_id: int

class HabitEntry(HabitEntryBase):
    id: int
    habit_id: int
    
    class Config:
        from_attributes = True

class HabitWithEntries(Habit):
    entries: List[HabitEntry] = []

class HabitStats(BaseModel):
    habit_id: int
    habit_name: str
    total_days: int
    completed_days: int
    completion_rate: float
    current_streak: int
    longest_streak: int

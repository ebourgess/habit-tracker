export interface Habit {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface HabitEntry {
  id: number;
  habit_id: number;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface HabitWithEntries extends Habit {
  entries: HabitEntry[];
}

export interface HabitStats {
  habit_id: number;
  habit_name: string;
  total_days: number;
  completed_days: number;
  completion_rate: number;
  current_streak: number;
  longest_streak: number;
}

export interface CreateHabitRequest {
  name: string;
  description?: string;
}

export interface CreateHabitEntryRequest {
  habit_id: number;
  date: string;
  completed: boolean;
  notes?: string;
}

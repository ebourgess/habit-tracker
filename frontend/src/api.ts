import axios from 'axios';
import { Habit, HabitEntry, HabitStats, CreateHabitRequest, CreateHabitEntryRequest } from './types';

// Use /api for production (proxied by nginx) or localhost for development
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const habitApi = {
  // Habits
  getHabits: async (): Promise<Habit[]> => {
    const response = await api.get('/habits/');
    return response.data;
  },

  createHabit: async (habit: CreateHabitRequest): Promise<Habit> => {
    const response = await api.post('/habits/', habit);
    return response.data;
  },

  updateHabit: async (id: number, habit: CreateHabitRequest): Promise<Habit> => {
    const response = await api.put(`/habits/${id}`, habit);
    return response.data;
  },

  deleteHabit: async (id: number): Promise<void> => {
    await api.delete(`/habits/${id}`);
  },

  getHabitStats: async (id: number): Promise<HabitStats> => {
    const response = await api.get(`/habits/${id}/stats`);
    return response.data;
  },

  // Habit Entries
  getHabitEntries: async (habitId: number): Promise<HabitEntry[]> => {
    const response = await api.get(`/habits/${habitId}/entries`);
    return response.data;
  },

  createHabitEntry: async (entry: CreateHabitEntryRequest): Promise<HabitEntry> => {
    const response = await api.post('/habit-entries/', entry);
    return response.data;
  },

  updateHabitEntry: async (id: number, entry: CreateHabitEntryRequest): Promise<HabitEntry> => {
    const response = await api.put(`/habit-entries/${id}`, entry);
    return response.data;
  },
};

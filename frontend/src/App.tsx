import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import HabitCard from './components/HabitCard';
import { habitApi } from './api';
import { Habit, CreateHabitRequest } from './types';

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CreateHabitRequest>({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const data = await habitApi.getHabits();
      setHabits(data);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      await habitApi.createHabit(formData);
      setFormData({ name: '', description: '' });
      await loadHabits();
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const handleDelete = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your habits...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Habit Tracker</h1>
        <p>Build better habits, one day at a time</p>
      </div>

      <form onSubmit={handleSubmit} className="add-habit-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Habit Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Drink 8 glasses of water"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Why is this habit important to you?"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Plus size={20} />
            Add Habit
          </button>
        </div>
      </form>

      {habits.length === 0 ? (
        <div className="habit-card">
          <h3 className="habit-title">No habits yet!</h3>
          <p className="habit-description">
            Start building better habits by adding your first one above.
          </p>
        </div>
      ) : (
        <div className="habits-grid">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onDelete={handleDelete}
              onUpdate={loadHabits}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Trash2, Calendar, TrendingUp } from 'lucide-react';
import { habitApi } from '../api';
import { Habit, HabitEntry, HabitStats } from '../types';

interface HabitCardProps {
  habit: Habit;
  onDelete: (id: number) => void;
  onUpdate: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onDelete, onUpdate }) => {
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [loading, setLoading] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = entries.find(entry => 
    format(new Date(entry.date), 'yyyy-MM-dd') === today
  );

  useEffect(() => {
    loadHabitData();
  }, [habit.id]);

  const loadHabitData = async () => {
    try {
      setLoading(true);
      const [entriesData, statsData] = await Promise.all([
        habitApi.getHabitEntries(habit.id),
        habitApi.getHabitStats(habit.id)
      ]);
      setEntries(entriesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading habit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async () => {
    try {
      if (todayEntry) {
        // Update existing entry
        await habitApi.updateHabitEntry(todayEntry.id, {
          habit_id: habit.id,
          date: todayEntry.date,
          completed: !todayEntry.completed,
          notes: todayEntry.notes
        });
      } else {
        // Create new entry for today
        await habitApi.createHabitEntry({
          habit_id: habit.id,
          date: new Date().toISOString(),
          completed: true
        });
      }
      await loadHabitData();
      onUpdate();
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await habitApi.deleteHabit(habit.id);
        onDelete(habit.id);
      } catch (error) {
        console.error('Error deleting habit:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="habit-card">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="habit-card">
      <div className="habit-header">
        <div>
          <h3 className="habit-title">{habit.name}</h3>
          {habit.description && (
            <p className="habit-description">{habit.description}</p>
          )}
        </div>
      </div>

      <div className="habit-actions">
        <button
          className="btn btn-danger btn-small"
          onClick={handleDelete}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      <button
        className={`completion-button ${todayEntry?.completed ? 'completed' : ''}`}
        onClick={toggleCompletion}
      >
        <Calendar size={20} style={{ marginRight: '0.5rem' }} />
        {todayEntry?.completed ? 'Completed Today!' : 'Mark as Done Today'}
      </button>

      {stats && (
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{stats.completion_rate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.current_streak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.longest_streak}</div>
            <div className="stat-label">Longest Streak</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.completed_days}/{stats.total_days}</div>
            <div className="stat-label">Days Completed</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCard;

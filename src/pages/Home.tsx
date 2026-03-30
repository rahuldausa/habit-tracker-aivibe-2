import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Flame, RotateCcw, X } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  completedDates: string[];
  createdAt: string;
}

const STORAGE_KEY = 'aivibe_habits';
const today = () => new Date().toISOString().split('T')[0];

function getStreak(habit: Habit): number {
  let streak = 0;
  const d = new Date();
  while (true) {
    const dateStr = d.toISOString().split('T')[0];
    if (habit.completedDates.includes(dateStr)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

const EMOJIS = ['💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '✍️', '🎯', '🌱'];

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('💪');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const todayStr = today();

  function addHabit() {
    if (!newName.trim()) return;
    setHabits(prev => [...prev, {
      id: Date.now().toString(),
      name: newName.trim(),
      emoji: newEmoji,
      completedDates: [],
      createdAt: todayStr,
    }]);
    setNewName('');
    setNewEmoji('💪');
    setShowAdd(false);
  }

  function toggleToday(id: string) {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const done = h.completedDates.includes(todayStr);
      return {
        ...h,
        completedDates: done
          ? h.completedDates.filter(d => d !== todayStr)
          : [...h.completedDates, todayStr],
      };
    }));
  }

  function deleteHabit(id: string) {
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  const completedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const progress = habits.length ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-900">Habit Tracker</h1>
          <p className="text-indigo-400 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Progress card */}
        {habits.length > 0 && (
          <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">Today's Progress</span>
              <span className="text-sm font-bold text-indigo-600">{completedToday}/{habits.length}</span>
            </div>
            <div className="w-full bg-indigo-100 rounded-full h-3">
              <div
                className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {progress === 100 && (
              <p className="text-center text-sm text-indigo-600 font-semibold mt-3">
                🎉 All habits done! Amazing work!
              </p>
            )}
          </div>
        )}

        {/* Habits list */}
        <div className="space-y-3 mb-6">
          {habits.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-5xl mb-3">🌱</p>
              <p className="font-medium">No habits yet</p>
              <p className="text-sm">Add your first habit below</p>
            </div>
          )}
          {habits.map(habit => {
            const doneToday = habit.completedDates.includes(todayStr);
            const streak = getStreak(habit);
            return (
              <div
                key={habit.id}
                className={`bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 transition-all ${doneToday ? 'ring-2 ring-indigo-300' : ''}`}
              >
                <button
                  onClick={() => toggleToday(habit.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    doneToday
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200'
                      : 'bg-gray-100 text-gray-300 hover:bg-indigo-100'
                  }`}
                >
                  <Check size={18} />
                </button>

                <span className="text-2xl">{habit.emoji}</span>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${doneToday ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {habit.name}
                  </p>
                  {streak > 0 && (
                    <div className="flex items-center gap-1 text-orange-500 text-xs mt-0.5">
                      <Flame size={12} />
                      <span>{streak} day streak</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add habit form */}
        {showAdd ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">New Habit</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addHabit()}
              placeholder="e.g. Drink 8 glasses of water"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3"
              autoFocus
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => setNewEmoji(e)}
                  className={`w-9 h-9 rounded-xl text-lg transition-all ${newEmoji === e ? 'bg-indigo-100 ring-2 ring-indigo-400 scale-110' : 'hover:bg-gray-100'}`}
                >
                  {e}
                </button>
              ))}
            </div>
            <button
              onClick={addHabit}
              disabled={!newName.trim()}
              className="w-full bg-indigo-500 text-white rounded-xl py-3 font-semibold disabled:opacity-40 hover:bg-indigo-600 transition-colors"
            >
              Add Habit
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full bg-indigo-500 text-white rounded-2xl py-4 flex items-center justify-center gap-2 font-semibold hover:bg-indigo-600 active:scale-95 transition-all shadow-md shadow-indigo-200"
          >
            <Plus size={20} />
            Add Habit
          </button>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Circle, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
}

const priorityColors = {
  low: 'text-green-400 border-green-400/30',
  medium: 'text-yellow-400 border-yellow-400/30',
  high: 'text-red-400 border-red-400/30',
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: 'Complete LeetCode daily challenge', isCompleted: false, priority: 'high' },
    { id: 2, title: 'Review job applications', isCompleted: true, priority: 'medium' },
    { id: 3, title: 'Update portfolio project', isCompleted: false, priority: 'medium' },
    { id: 4, title: 'Practice system design', isCompleted: false, priority: 'low' },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), title: newTodo, isCompleted: false, priority },
    ]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((t) => t.isCompleted).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold gradient-text">Daily Tasks</h3>
        <span className="text-sm text-white/60">
          {completedCount}/{todos.length} completed
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        />
      </div>

      {/* Add todo input */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 min-w-0 glass-input text-sm"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="glass-select text-sm flex-1 sm:flex-none sm:w-24"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={addTodo}
            className="glass-button-primary p-3 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Todo list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 border ${
                todo.isCompleted ? 'border-white/10' : priorityColors[todo.priority]
              } group`}
            >
              <button onClick={() => toggleTodo(todo.id)} className="flex-shrink-0">
                {todo.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-white/40 hover:text-white/60" />
                )}
              </button>
              <span
                className={`flex-1 text-sm ${
                  todo.isCompleted ? 'line-through text-white/40' : 'text-white/80'
                }`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}

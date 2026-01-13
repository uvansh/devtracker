'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Check,
  Circle,
  CheckCircle2,
  Trash2,
  Filter,
  Calendar,
  Tag,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import Modal from '@/components/ui/Modal';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

interface Todo {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  category: string | null;
  created_at: string;
}

const priorityColors = {
  low: 'text-green-400 border-green-400/30 bg-green-500/10',
  medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10',
  high: 'text-red-400 border-red-400/30 bg-red-500/10',
};

const categoryColors: Record<string, string> = {
  Work: 'bg-blue-500/20 text-blue-400',
  Learning: 'bg-purple-500/20 text-purple-400',
  Health: 'bg-green-500/20 text-green-400',
  Personal: 'bg-pink-500/20 text-pink-400',
  Other: 'bg-gray-500/20 text-gray-400',
};

// Mock data
const mockTodos: Todo[] = [
  {
    id: 1,
    title: 'Complete LeetCode daily challenge',
    description: 'Solve the problem of the day',
    is_completed: false,
    priority: 'high',
    due_date: new Date().toISOString().split('T')[0],
    category: 'Learning',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Review job applications',
    description: 'Check responses from Google, Meta, Amazon',
    is_completed: true,
    priority: 'high',
    due_date: new Date().toISOString().split('T')[0],
    category: 'Work',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Update portfolio with new project',
    description: 'Add DevTracker project to portfolio',
    is_completed: false,
    priority: 'medium',
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    category: 'Work',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Practice system design',
    description: 'Design URL shortener',
    is_completed: false,
    priority: 'medium',
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    category: 'Learning',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'Morning workout',
    description: '30 minutes cardio',
    is_completed: true,
    priority: 'low',
    due_date: new Date().toISOString().split('T')[0],
    category: 'Health',
    created_at: new Date().toISOString(),
  },
];

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: '',
    category: '',
  });

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || todo.category === categoryFilter;
    const matchesCompleted = showCompleted || !todo.is_completed;
    return matchesSearch && matchesPriority && matchesCategory && matchesCompleted;
  });

  // Group by date
  const groupedTodos = filteredTodos.reduce((acc, todo) => {
    let group = 'No Due Date';
    if (todo.due_date) {
      const date = parseISO(todo.due_date);
      if (isToday(date)) {
        group = 'Today';
      } else if (isTomorrow(date)) {
        group = 'Tomorrow';
      } else if (isPast(date)) {
        group = 'Overdue';
      } else {
        group = format(date, 'EEEE, MMM d');
      }
    }
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);

  // Sort groups
  const groupOrder = ['Overdue', 'Today', 'Tomorrow'];
  const sortedGroups = Object.entries(groupedTodos).sort(([a], [b]) => {
    const aIndex = groupOrder.indexOf(a);
    const bIndex = groupOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  const handleAddTodo = () => {
    const todo: Todo = {
      id: Date.now(),
      ...newTodo,
      is_completed: false,
      due_date: newTodo.due_date || null,
      category: newTodo.category || null,
      created_at: new Date().toISOString(),
    };
    setTodos([...todos, todo]);
    setIsAddModalOpen(false);
    setNewTodo({
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
      category: '',
    });
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.is_completed).length,
    today: todos.filter((t) => t.due_date && isToday(parseISO(t.due_date))).length,
    todayCompleted: todos.filter(
      (t) => t.due_date && isToday(parseISO(t.due_date)) && t.is_completed
    ).length,
  };

  const categories = [...new Set(todos.map((t) => t.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Todos</h1>
          <p className="text-white/60 mt-1">Manage your daily tasks and goals</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="glass-button-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Todo
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-white/60">Total Tasks</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
          <p className="text-sm text-white/60">Completed</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{stats.today}</p>
          <p className="text-sm text-white/60">Due Today</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <p className="text-2xl font-bold text-cyan-400">{stats.todayCompleted}</p>
            <p className="text-2xl text-white/40">/</p>
            <p className="text-2xl text-white/40">{stats.today}</p>
          </div>
          <p className="text-sm text-white/60">Today&apos;s Progress</p>
        </GlassCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-12"
            />
          </div>
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="glass-select"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="glass-select"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat!}>
              {cat}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className={`glass-button flex items-center gap-2 ${
            showCompleted ? 'bg-purple-500/20 border-purple-400/30' : ''
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {showCompleted ? 'Hide Completed' : 'Show Completed'}
        </button>
      </div>

      {/* Todos by Date Group */}
      <div className="space-y-6">
        {sortedGroups.map(([group, groupTodos]) => (
          <motion.div
            key={group}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3
              className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
                group === 'Overdue' ? 'text-red-400' : ''
              }`}
            >
              <Calendar className="w-5 h-5" />
              {group}
              <span className="text-sm text-white/40">({groupTodos.length})</span>
            </h3>
            <div className="space-y-2">
              <AnimatePresence>
                {groupTodos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`glass-card p-4 flex items-center gap-4 group ${
                      todo.is_completed ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="flex-shrink-0"
                    >
                      {todo.is_completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      ) : (
                        <Circle className="w-6 h-6 text-white/40 hover:text-white/60" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          todo.is_completed ? 'line-through text-white/40' : ''
                        }`}
                      >
                        {todo.title}
                      </p>
                      {todo.description && (
                        <p className="text-sm text-white/40 truncate">{todo.description}</p>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2">
                      {todo.category && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            categoryColors[todo.category] || categoryColors['Other']
                          }`}
                        >
                          {todo.category}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs border ${
                          priorityColors[todo.priority]
                        }`}
                      >
                        {todo.priority}
                      </span>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTodos.length === 0 && (
        <div className="glass-card p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No todos found</h3>
          <p className="text-white/60 mb-6">
            {todos.length === 0
              ? "You're all caught up! Add a new todo to get started."
              : 'Try adjusting your filters'}
          </p>
          {todos.length === 0 && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="glass-button-primary"
            >
              Add Your First Todo
            </button>
          )}
        </div>
      )}

      {/* Add Todo Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Todo"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Title</label>
            <input
              type="text"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="w-full glass-input"
              placeholder="What do you need to do?"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Description (optional)</label>
            <textarea
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="w-full glass-input h-20 resize-none"
              placeholder="Additional details..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Priority</label>
              <select
                value={newTodo.priority}
                onChange={(e) =>
                  setNewTodo({
                    ...newTodo,
                    priority: e.target.value as 'low' | 'medium' | 'high',
                  })
                }
                className="w-full glass-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Category</label>
              <select
                value={newTodo.category}
                onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
                className="w-full glass-select"
              >
                <option value="">No Category</option>
                <option value="Work">Work</option>
                <option value="Learning">Learning</option>
                <option value="Health">Health</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Due Date</label>
            <input
              type="date"
              value={newTodo.due_date}
              onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
              className="w-full glass-input"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setIsAddModalOpen(false)} className="glass-button">
              Cancel
            </button>
            <button onClick={handleAddTodo} className="glass-button-primary">
              Add Todo
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

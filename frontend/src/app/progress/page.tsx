'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Target,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Check,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import Modal from '@/components/ui/Modal';
import { format, differenceInDays, isPast } from 'date-fns';

interface DailyGoal {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  due_date: string;
}

interface OngoingProject {
  id: number;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  priority: 'low' | 'medium' | 'high';
  daily_goals: DailyGoal[];
}

const priorityColors = {
  low: 'text-green-400 border-green-400/30 bg-green-500/10',
  medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10',
  high: 'text-red-400 border-red-400/30 bg-red-500/10',
};

// Mock data
const mockProjects: OngoingProject[] = [
  {
    id: 1,
    title: 'DevTracker MVP',
    description: 'Build the minimum viable product for the job tracker application',
    deadline: '2024-02-15',
    progress: 65,
    priority: 'high',
    daily_goals: [
      { id: 1, title: 'Complete dashboard UI', description: '', is_completed: true, due_date: '2024-01-15' },
      { id: 2, title: 'Implement job tracker API', description: '', is_completed: true, due_date: '2024-01-16' },
      { id: 3, title: 'Add LeetCode integration', description: '', is_completed: false, due_date: '2024-01-17' },
      { id: 4, title: 'Deploy to production', description: '', is_completed: false, due_date: '2024-01-18' },
    ],
  },
  {
    id: 2,
    title: 'Learn System Design',
    description: 'Complete system design fundamentals course and practice problems',
    deadline: '2024-03-01',
    progress: 40,
    priority: 'medium',
    daily_goals: [
      { id: 5, title: 'Read about load balancing', description: '', is_completed: true, due_date: '2024-01-15' },
      { id: 6, title: 'Practice URL shortener design', description: '', is_completed: false, due_date: '2024-01-16' },
      { id: 7, title: 'Study database sharding', description: '', is_completed: false, due_date: '2024-01-17' },
    ],
  },
  {
    id: 3,
    title: 'Portfolio Redesign',
    description: 'Redesign personal portfolio with modern animations and new projects',
    deadline: '2024-02-28',
    progress: 20,
    priority: 'low',
    daily_goals: [
      { id: 8, title: 'Create wireframes', description: '', is_completed: true, due_date: '2024-01-20' },
      { id: 9, title: 'Design hero section', description: '', is_completed: false, due_date: '2024-01-21' },
    ],
  },
];

export default function ProgressPage() {
  const [projects, setProjects] = useState<OngoingProject[]>(mockProjects);
  const [expandedProject, setExpandedProject] = useState<number | null>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    due_date: '',
  });

  const handleAddProject = () => {
    const project: OngoingProject = {
      id: Date.now(),
      ...newProject,
      progress: 0,
      daily_goals: [],
    };
    setProjects([...projects, project]);
    setIsAddModalOpen(false);
    setNewProject({ title: '', description: '', deadline: '', priority: 'medium' });
  };

  const handleAddGoal = () => {
    if (!selectedProjectId) return;
    const goal: DailyGoal = {
      id: Date.now(),
      ...newGoal,
      is_completed: false,
    };
    setProjects(
      projects.map((p) =>
        p.id === selectedProjectId
          ? { ...p, daily_goals: [...p.daily_goals, goal] }
          : p
      )
    );
    setIsAddGoalModalOpen(false);
    setNewGoal({ title: '', description: '', due_date: '' });
  };

  const toggleGoal = (projectId: number, goalId: number) => {
    setProjects(
      projects.map((project) => {
        if (project.id !== projectId) return project;
        
        const updatedGoals = project.daily_goals.map((goal) =>
          goal.id === goalId ? { ...goal, is_completed: !goal.is_completed } : goal
        );
        
        const completedCount = updatedGoals.filter((g) => g.is_completed).length;
        const progress = updatedGoals.length > 0
          ? Math.round((completedCount / updatedGoals.length) * 100)
          : 0;
        
        return { ...project, daily_goals: updatedGoals, progress };
      })
    );
  };

  const updateProgress = (projectId: number, progress: number) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, progress: Math.min(100, Math.max(0, progress)) } : p
      )
    );
  };

  const deleteProject = (projectId: number) => {
    setProjects(projects.filter((p) => p.id !== projectId));
  };

  const getDaysRemaining = (deadline: string) => {
    const days = differenceInDays(new Date(deadline), new Date());
    if (days < 0) return { text: 'Overdue', isOverdue: true };
    if (days === 0) return { text: 'Due today', isOverdue: false };
    if (days === 1) return { text: '1 day left', isOverdue: false };
    return { text: `${days} days left`, isOverdue: false };
  };

  const openAddGoalModal = (projectId: number) => {
    setSelectedProjectId(projectId);
    setIsAddGoalModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Progress Tracker</h1>
          <p className="text-white/60 mt-1">Track ongoing projects and daily goals</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="glass-button-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </motion.div>

      {/* Projects List */}
      <div className="space-y-4">
        <AnimatePresence>
          {projects.map((project) => {
            const deadline = getDaysRemaining(project.deadline);
            const isExpanded = expandedProject === project.id;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card overflow-hidden"
              >
                {/* Project Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs border ${
                            priorityColors[project.priority]
                          }`}
                        >
                          {project.priority}
                        </span>
                        {deadline.isOverdue && (
                          <span className="flex items-center gap-1 text-red-400 text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-white/60 text-sm mb-4">{project.description}</p>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            className={`h-full rounded-full ${
                              project.progress === 100
                                ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                                : 'bg-gradient-to-r from-purple-500 to-pink-500'
                            }`}
                          />
                        </div>
                        <span className="text-sm font-medium w-12">{project.progress}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(project.deadline), 'MMM d, yyyy')}
                        </div>
                        <div
                          className={`text-sm mt-1 ${
                            deadline.isOverdue ? 'text-red-400' : 'text-white/60'
                          }`}
                        >
                          {deadline.text}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-white/40" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/40" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content - Daily Goals */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-white/60">Daily Goals</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openAddGoalModal(project.id);
                            }}
                            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Add Goal
                          </button>
                        </div>

                        {project.daily_goals.length === 0 ? (
                          <p className="text-white/40 text-sm text-center py-4">
                            No goals yet. Add your first daily goal!
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {project.daily_goals.map((goal) => (
                              <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 border ${
                                  goal.is_completed
                                    ? 'border-green-400/20'
                                    : 'border-white/10'
                                }`}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleGoal(project.id, goal.id);
                                  }}
                                  className={`p-1 rounded-lg ${
                                    goal.is_completed
                                      ? 'bg-green-500/20 text-green-400'
                                      : 'bg-white/5 text-white/40 hover:bg-white/10'
                                  }`}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <div className="flex-1">
                                  <p
                                    className={`text-sm ${
                                      goal.is_completed
                                        ? 'line-through text-white/40'
                                        : 'text-white/80'
                                    }`}
                                  >
                                    {goal.title}
                                  </p>
                                </div>
                                {goal.due_date && (
                                  <span className="text-xs text-white/40 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {format(new Date(goal.due_date), 'MMM d')}
                                  </span>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {/* Quick Progress Update */}
                        <div className="pt-4 border-t border-white/10">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-white/60">Quick update:</span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={project.progress}
                              onChange={(e) =>
                                updateProgress(project.id, parseInt(e.target.value))
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 accent-purple-500"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProject(project.id);
                              }}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Target className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No ongoing projects</h3>
          <p className="text-white/60 mb-6">Start tracking your projects and goals</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="glass-button-primary"
          >
            Add Your First Project
          </button>
        </div>
      )}

      {/* Add Project Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Project"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Title</label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="w-full glass-input"
              placeholder="Project name"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="w-full glass-input h-20 resize-none"
              placeholder="Brief description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Deadline</label>
              <input
                type="date"
                value={newProject.deadline}
                onChange={(e) =>
                  setNewProject({ ...newProject, deadline: e.target.value })
                }
                className="w-full glass-input"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Priority</label>
              <select
                value={newProject.priority}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
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
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setIsAddModalOpen(false)} className="glass-button">
              Cancel
            </button>
            <button onClick={handleAddProject} className="glass-button-primary">
              Add Project
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        title="Add Daily Goal"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Goal Title</label>
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              className="w-full glass-input"
              placeholder="What do you want to achieve?"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Description (optional)</label>
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              className="w-full glass-input h-20 resize-none"
              placeholder="Additional details..."
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Due Date</label>
            <input
              type="date"
              value={newGoal.due_date}
              onChange={(e) => setNewGoal({ ...newGoal, due_date: e.target.value })}
              className="w-full glass-input"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsAddGoalModalOpen(false)}
              className="glass-button"
            >
              Cancel
            </button>
            <button onClick={handleAddGoal} className="glass-button-primary">
              Add Goal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

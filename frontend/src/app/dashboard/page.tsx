'use client';

import { motion } from 'framer-motion';
import {
  Briefcase,
  Code2,
  FolderKanban,
  CheckCircle,
  Flame,
  Target,
} from 'lucide-react';
import { StatCard } from '@/components/ui/GlassCard';
import TimeDisplay from '@/components/dashboard/TimeDisplay';
import TodoList from '@/components/dashboard/TodoList';
import ContributionHeatmap from '@/components/dashboard/ContributionHeatmap';
import { useAuth } from '@/context/AuthContext';

// Mock data - in production, fetch from API
const stats = {
  totalJobs: 24,
  activeApplications: 8,
  problemsSolved: 156,
  projectsCount: 12,
  currentStreak: 15,
  todosToday: 6,
  todosCompleted: 4,
};

const recentActivity = [
  { type: 'job', text: 'Applied to Google - SWE II', time: '2 hours ago' },
  { type: 'leetcode', text: 'Solved "Two Sum" (Easy)', time: '4 hours ago' },
  { type: 'project', text: 'Updated Portfolio website', time: '1 day ago' },
  { type: 'job', text: 'Interview scheduled with Meta', time: '2 days ago' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-white/60 mt-1">
            Welcome{user?.name ? `, ${user.name}` : ''}! Here&apos;s your overview.
          </p>
        </div>
      </motion.div>

      {/* Time Display */}
      <TimeDisplay />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Job Applications"
          value={stats.totalJobs}
          icon={Briefcase}
          color="purple"
          trend="+3 this week"
          trendUp
        />
        <StatCard
          title="Active Applications"
          value={stats.activeApplications}
          icon={Target}
          color="pink"
        />
        <StatCard
          title="Problems Solved"
          value={stats.problemsSolved}
          icon={Code2}
          color="cyan"
          trend="+12 this week"
          trendUp
        />
        <StatCard
          title="Projects"
          value={stats.projectsCount}
          icon={FolderKanban}
          color="green"
        />
        <StatCard
          title="Current Streak"
          value={`${stats.currentStreak} days`}
          icon={Flame}
          color="orange"
        />
        <StatCard
          title="Tasks Today"
          value={`${stats.todosCompleted}/${stats.todosToday}`}
          icon={CheckCircle}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contribution Heatmap */}
        <div className="lg:col-span-2">
          <ContributionHeatmap />
        </div>

        {/* Todo List */}
        <div>
          <TodoList />
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4 gradient-text">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div
                className={`p-2 rounded-lg ${
                  activity.type === 'job'
                    ? 'bg-purple-500/20 text-purple-400'
                    : activity.type === 'leetcode'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-green-500/20 text-green-400'
                }`}
              >
                {activity.type === 'job' ? (
                  <Briefcase className="w-4 h-4" />
                ) : activity.type === 'leetcode' ? (
                  <Code2 className="w-4 h-4" />
                ) : (
                  <FolderKanban className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-white/80">{activity.text}</p>
              </div>
              <span className="text-sm text-white/40">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

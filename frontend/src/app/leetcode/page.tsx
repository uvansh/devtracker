'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  ExternalLink,
  Check,
  X,
  Filter,
  BarChart3,
  Clock,
  Trophy,
} from 'lucide-react';
import { GlassCard, StatCard } from '@/components/ui/GlassCard';
import Modal from '@/components/ui/Modal';

interface Problem {
  id: number;
  problem_number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  link: string;
  notes: string;
  solution_approach: string;
  time_complexity: string;
  space_complexity: string;
  is_solved: boolean;
  times_solved: number;
  last_solved: string | null;
}

const difficultyColors = {
  Easy: 'bg-green-500/20 text-green-400 border-green-400/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
  Hard: 'bg-red-500/20 text-red-400 border-red-400/30',
};

// Mock data
const mockProblems: Problem[] = [
  {
    id: 1,
    problem_number: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays, Hash Table',
    link: 'https://leetcode.com/problems/two-sum',
    notes: 'Use hashmap for O(n) solution',
    solution_approach: 'Hash Table approach - store complement',
    time_complexity: 'O(n)',
    space_complexity: 'O(n)',
    is_solved: true,
    times_solved: 3,
    last_solved: '2024-01-12',
  },
  {
    id: 2,
    problem_number: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'Sliding Window, Hash Table',
    link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters',
    notes: 'Sliding window technique',
    solution_approach: 'Two pointers with set',
    time_complexity: 'O(n)',
    space_complexity: 'O(min(m,n))',
    is_solved: true,
    times_solved: 2,
    last_solved: '2024-01-10',
  },
  {
    id: 3,
    problem_number: 42,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topic: 'Two Pointers, Stack, DP',
    link: 'https://leetcode.com/problems/trapping-rain-water',
    notes: 'Multiple approaches possible',
    solution_approach: 'Two pointers from both ends',
    time_complexity: 'O(n)',
    space_complexity: 'O(1)',
    is_solved: true,
    times_solved: 1,
    last_solved: '2024-01-08',
  },
  {
    id: 4,
    problem_number: 121,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    topic: 'Arrays, DP',
    link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock',
    notes: 'Track minimum price and max profit',
    solution_approach: 'Single pass with min tracking',
    time_complexity: 'O(n)',
    space_complexity: 'O(1)',
    is_solved: false,
    times_solved: 0,
    last_solved: null,
  },
];

export default function LeetCodePage() {
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [solvedFilter, setSolvedFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [newProblem, setNewProblem] = useState({
    problem_number: '',
    title: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    topic: '',
    link: '',
    notes: '',
    solution_approach: '',
    time_complexity: '',
    space_complexity: '',
  });

  const stats = {
    total: problems.length,
    solved: problems.filter((p) => p.is_solved).length,
    easy: problems.filter((p) => p.difficulty === 'Easy' && p.is_solved).length,
    medium: problems.filter((p) => p.difficulty === 'Medium' && p.is_solved).length,
    hard: problems.filter((p) => p.difficulty === 'Hard' && p.is_solved).length,
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.problem_number.toString().includes(searchQuery);
    const matchesDifficulty =
      difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesSolved =
      solvedFilter === 'all' ||
      (solvedFilter === 'solved' && problem.is_solved) ||
      (solvedFilter === 'unsolved' && !problem.is_solved);
    return matchesSearch && matchesDifficulty && matchesSolved;
  });

  const handleAddProblem = () => {
    const problem: Problem = {
      id: Date.now(),
      problem_number: parseInt(newProblem.problem_number),
      title: newProblem.title,
      difficulty: newProblem.difficulty,
      topic: newProblem.topic,
      link: newProblem.link,
      notes: newProblem.notes,
      solution_approach: newProblem.solution_approach,
      time_complexity: newProblem.time_complexity,
      space_complexity: newProblem.space_complexity,
      is_solved: false,
      times_solved: 0,
      last_solved: null,
    };
    setProblems([...problems, problem]);
    setIsAddModalOpen(false);
    setNewProblem({
      problem_number: '',
      title: '',
      difficulty: 'Easy',
      topic: '',
      link: '',
      notes: '',
      solution_approach: '',
      time_complexity: '',
      space_complexity: '',
    });
  };

  const toggleSolved = (id: number) => {
    setProblems(
      problems.map((p) =>
        p.id === id
          ? {
              ...p,
              is_solved: !p.is_solved,
              times_solved: !p.is_solved ? p.times_solved + 1 : p.times_solved,
              last_solved: !p.is_solved ? new Date().toISOString().split('T')[0] : p.last_solved,
            }
          : p
      )
    );
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
          <h1 className="text-3xl font-bold gradient-text">LeetCode Tracker</h1>
          <p className="text-white/60 mt-1">Track your problem-solving progress</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="glass-button-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Problem
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Problems"
          value={stats.total}
          icon={BarChart3}
          color="purple"
        />
        <StatCard
          title="Solved"
          value={stats.solved}
          icon={Trophy}
          color="green"
        />
        <div className="glass-card p-4">
          <p className="text-sm text-white/60">Easy</p>
          <p className="text-2xl font-bold text-green-400">{stats.easy}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-white/60">Medium</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.medium}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-white/60">Hard</p>
          <p className="text-2xl font-bold text-red-400">{stats.hard}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-12"
            />
          </div>
        </div>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="glass-select"
        >
          <option value="all">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={solvedFilter}
          onChange={(e) => setSolvedFilter(e.target.value)}
          className="glass-select"
        >
          <option value="all">All Status</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
        </select>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredProblems.map((problem) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedProblem(problem)}
              className="glass-card p-5 cursor-pointer hover:border-purple-400/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white/40">#{problem.problem_number}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs border ${
                      difficultyColors[problem.difficulty]
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSolved(problem.id);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    problem.is_solved
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {problem.is_solved ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </button>
              </div>

              <h3 className="font-semibold mb-2 line-clamp-1">{problem.title}</h3>
              <p className="text-sm text-white/40 mb-3 line-clamp-1">{problem.topic}</p>

              <div className="flex items-center justify-between text-xs text-white/40">
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {problem.times_solved}x solved
                </div>
                {problem.last_solved && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {problem.last_solved}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Problem Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Problem"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Problem Number</label>
              <input
                type="number"
                value={newProblem.problem_number}
                onChange={(e) =>
                  setNewProblem({ ...newProblem, problem_number: e.target.value })
                }
                className="w-full glass-input"
                placeholder="e.g., 1"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Difficulty</label>
              <select
                value={newProblem.difficulty}
                onChange={(e) =>
                  setNewProblem({
                    ...newProblem,
                    difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard',
                  })
                }
                className="w-full glass-select"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Title</label>
            <input
              type="text"
              value={newProblem.title}
              onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
              className="w-full glass-input"
              placeholder="e.g., Two Sum"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Topic/Tags</label>
            <input
              type="text"
              value={newProblem.topic}
              onChange={(e) => setNewProblem({ ...newProblem, topic: e.target.value })}
              className="w-full glass-input"
              placeholder="e.g., Arrays, Hash Table"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">LeetCode Link</label>
            <input
              type="url"
              value={newProblem.link}
              onChange={(e) => setNewProblem({ ...newProblem, link: e.target.value })}
              className="w-full glass-input"
              placeholder="https://leetcode.com/problems/..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Time Complexity</label>
              <input
                type="text"
                value={newProblem.time_complexity}
                onChange={(e) =>
                  setNewProblem({ ...newProblem, time_complexity: e.target.value })
                }
                className="w-full glass-input"
                placeholder="e.g., O(n)"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Space Complexity</label>
              <input
                type="text"
                value={newProblem.space_complexity}
                onChange={(e) =>
                  setNewProblem({ ...newProblem, space_complexity: e.target.value })
                }
                className="w-full glass-input"
                placeholder="e.g., O(1)"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Solution Approach</label>
            <textarea
              value={newProblem.solution_approach}
              onChange={(e) =>
                setNewProblem({ ...newProblem, solution_approach: e.target.value })
              }
              className="w-full glass-input h-20 resize-none"
              placeholder="Describe your approach..."
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Notes</label>
            <textarea
              value={newProblem.notes}
              onChange={(e) => setNewProblem({ ...newProblem, notes: e.target.value })}
              className="w-full glass-input h-20 resize-none"
              placeholder="Any additional notes..."
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setIsAddModalOpen(false)} className="glass-button">
              Cancel
            </button>
            <button onClick={handleAddProblem} className="glass-button-primary">
              Add Problem
            </button>
          </div>
        </div>
      </Modal>

      {/* Problem Detail Modal */}
      <Modal
        isOpen={!!selectedProblem}
        onClose={() => setSelectedProblem(null)}
        title={`#${selectedProblem?.problem_number} - ${selectedProblem?.title}`}
        size="lg"
      >
        {selectedProblem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm border ${
                  difficultyColors[selectedProblem.difficulty]
                }`}
              >
                {selectedProblem.difficulty}
              </span>
              {selectedProblem.is_solved && (
                <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 border border-green-400/30">
                  Solved
                </span>
              )}
            </div>

            <div>
              <h4 className="text-sm text-white/60 mb-1">Topics</h4>
              <p className="text-white/80">{selectedProblem.topic}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-white/60 mb-1">Time Complexity</h4>
                <p className="text-cyan-400 font-mono">{selectedProblem.time_complexity}</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Space Complexity</h4>
                <p className="text-pink-400 font-mono">{selectedProblem.space_complexity}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-white/60 mb-1">Solution Approach</h4>
              <p className="text-white/80">{selectedProblem.solution_approach}</p>
            </div>

            <div>
              <h4 className="text-sm text-white/60 mb-1">Notes</h4>
              <p className="text-white/80">{selectedProblem.notes}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-sm text-white/40">
                Solved {selectedProblem.times_solved} times
                {selectedProblem.last_solved && ` • Last: ${selectedProblem.last_solved}`}
              </div>
              <a
                href={selectedProblem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button-primary flex items-center gap-2"
              >
                Open on LeetCode
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  ExternalLink,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  ChevronDown,
  Trash2,
  Edit,
  FolderOpen,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import Modal from '@/components/ui/Modal';

interface Job {
  id: number;
  company_name: string;
  position: string;
  status: string;
  careers_link: string;
  location: string;
  salary_range: string;
  notes: string;
  applied_date: string;
}

const statusColors: Record<string, string> = {
  wishlist: 'bg-gray-500/20 text-gray-400 border-gray-400/30',
  applied: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
  phone_screen: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
  technical: 'bg-orange-500/20 text-orange-400 border-orange-400/30',
  onsite: 'bg-purple-500/20 text-purple-400 border-purple-400/30',
  offer: 'bg-green-500/20 text-green-400 border-green-400/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-400/30',
  accepted: 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30',
  withdrawn: 'bg-slate-500/20 text-slate-400 border-slate-400/30',
};

const statusLabels: Record<string, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  phone_screen: 'Phone Screen',
  technical: 'Technical',
  onsite: 'Onsite',
  offer: 'Offer',
  rejected: 'Rejected',
  accepted: 'Accepted',
  withdrawn: 'Withdrawn',
};

// Mock data
const mockJobs: Job[] = [
  {
    id: 1,
    company_name: 'Google',
    position: 'Software Engineer II',
    status: 'technical',
    careers_link: 'https://careers.google.com',
    location: 'Mountain View, CA',
    salary_range: '$150k - $200k',
    notes: 'Scheduled for technical interview next week',
    applied_date: '2024-01-10',
  },
  {
    id: 2,
    company_name: 'Meta',
    position: 'Frontend Engineer',
    status: 'applied',
    careers_link: 'https://careers.facebook.com',
    location: 'Menlo Park, CA',
    salary_range: '$140k - $180k',
    notes: 'Applied through referral',
    applied_date: '2024-01-12',
  },
  {
    id: 3,
    company_name: 'Amazon',
    position: 'SDE II',
    status: 'phone_screen',
    careers_link: 'https://amazon.jobs',
    location: 'Seattle, WA',
    salary_range: '$160k - $220k',
    notes: 'Phone screen scheduled for Friday',
    applied_date: '2024-01-08',
  },
  {
    id: 4,
    company_name: 'Microsoft',
    position: 'Software Engineer',
    status: 'offer',
    careers_link: 'https://careers.microsoft.com',
    location: 'Redmond, WA',
    salary_range: '$145k - $190k',
    notes: 'Received offer, negotiating',
    applied_date: '2024-01-05',
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState({
    company_name: '',
    position: '',
    status: 'wishlist',
    careers_link: '',
    location: '',
    salary_range: '',
    notes: '',
  });

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddJob = () => {
    const job: Job = {
      id: Date.now(),
      ...newJob,
      applied_date: new Date().toISOString().split('T')[0],
    };
    setJobs([...jobs, job]);
    setIsAddModalOpen(false);
    setNewJob({
      company_name: '',
      position: '',
      status: 'wishlist',
      careers_link: '',
      location: '',
      salary_range: '',
      notes: '',
    });
  };

  const handleDeleteJob = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === id ? { ...job, status: newStatus } : job
      )
    );
  };

  const openResources = (job: Job) => {
    setSelectedJob(job);
    setIsResourcesModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Job Tracker</h1>
          <p className="text-white/60 mt-1 text-sm sm:text-base">
            Track and manage your job applications
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="glass-button-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add Job
        </button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search companies or positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-12"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="glass-select w-full sm:w-auto"
        >
          <option value="all">All Status</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Status Summary */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {Object.entries(statusLabels).map(([status, label]) => {
          const count = jobs.filter((j) => j.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm border whitespace-nowrap ${statusColors[status]} hover:opacity-80 transition-opacity`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Jobs Table - Desktop */}
      <GlassCard className="overflow-hidden p-0 hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 font-medium">Company</th>
                <th className="text-left p-4 text-white/60 font-medium">Position</th>
                <th className="text-left p-4 text-white/60 font-medium">Status</th>
                <th className="text-left p-4 text-white/60 font-medium">Location</th>
                <th className="text-left p-4 text-white/60 font-medium">Salary</th>
                <th className="text-left p-4 text-white/60 font-medium">Applied</th>
                <th className="text-left p-4 text-white/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredJobs.map((job) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium">{job.company_name}</p>
                          {job.careers_link && (
                            <a
                              href={job.careers_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                            >
                              Careers <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white/80">{job.position}</td>
                    <td className="p-4">
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm border ${statusColors[job.status]} bg-transparent cursor-pointer`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value} className="bg-slate-800">
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <MapPin className="w-4 h-4" />
                        {job.location || 'Remote'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <DollarSign className="w-4 h-4" />
                        {job.salary_range || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <Calendar className="w-4 h-4" />
                        {job.applied_date}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openResources(job)}
                          className="p-2 rounded-lg hover:bg-white/10 text-purple-400 transition-colors"
                          title="Resources"
                        >
                          <FolderOpen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 rounded-lg hover:bg-white/10 text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Jobs Cards - Mobile */}
      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold">{job.company_name}</p>
                      <p className="text-sm text-white/70">{job.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openResources(job)}
                      className="p-2 rounded-lg hover:bg-white/10 text-purple-400 transition-colors"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 rounded-lg hover:bg-white/10 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm border ${statusColors[job.status]} bg-transparent cursor-pointer`}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value} className="bg-slate-800">
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{job.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{job.salary_range || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{job.applied_date}</span>
                  </div>
                  {job.careers_link && (
                    <a
                      href={job.careers_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      <span>Careers</span>
                    </a>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Job Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Job Application"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Company Name</label>
              <input
                type="text"
                value={newJob.company_name}
                onChange={(e) => setNewJob({ ...newJob, company_name: e.target.value })}
                className="w-full glass-input"
                placeholder="e.g., Google"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Position</label>
              <input
                type="text"
                value={newJob.position}
                onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                className="w-full glass-input"
                placeholder="e.g., Software Engineer"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Status</label>
              <select
                value={newJob.status}
                onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
                className="w-full glass-select"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Location</label>
              <input
                type="text"
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className="w-full glass-input"
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Careers Link</label>
              <input
                type="url"
                value={newJob.careers_link}
                onChange={(e) => setNewJob({ ...newJob, careers_link: e.target.value })}
                className="w-full glass-input"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Salary Range</label>
              <input
                type="text"
                value={newJob.salary_range}
                onChange={(e) => setNewJob({ ...newJob, salary_range: e.target.value })}
                className="w-full glass-input"
                placeholder="e.g., $150k - $200k"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Notes</label>
            <textarea
              value={newJob.notes}
              onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
              className="w-full glass-input h-24 resize-none"
              placeholder="Any additional notes..."
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="glass-button"
            >
              Cancel
            </button>
            <button onClick={handleAddJob} className="glass-button-primary">
              Add Job
            </button>
          </div>
        </div>
      </Modal>

      {/* Resources Modal */}
      <Modal
        isOpen={isResourcesModalOpen}
        onClose={() => setIsResourcesModalOpen(false)}
        title={`Resources - ${selectedJob?.company_name || ''}`}
        size="xl"
      >
        {selectedJob && (
          <div className="space-y-6">
            {/* Company Problems */}
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Interview Problems
              </h4>
              <div className="space-y-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/80">Two Sum - Arrays</p>
                  <p className="text-sm text-white/40 mt-1">Asked frequently in phone screens</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/80">LRU Cache - Design</p>
                  <p className="text-sm text-white/40 mt-1">Common system design question</p>
                </div>
                <button className="text-sm text-purple-400 hover:text-purple-300">
                  + Add Problem
                </button>
              </div>
            </div>

            {/* Past Experiences */}
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                Past Experiences
              </h4>
              <div className="space-y-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/80">Interview was behavioral focused</p>
                  <p className="text-sm text-white/40 mt-1">From: John Doe - 2023</p>
                </div>
                <button className="text-sm text-pink-400 hover:text-pink-300">
                  + Add Experience
                </button>
              </div>
            </div>

            {/* Goals */}
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Goals & Achievements
              </h4>
              <div className="space-y-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/80">Prepare for system design interview</p>
                  <p className="text-sm text-white/40 mt-1">Deadline: Next week</p>
                </div>
                <button className="text-sm text-cyan-400 hover:text-cyan-300">
                  + Add Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

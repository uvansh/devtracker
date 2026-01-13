'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  ExternalLink,
  Github,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import Modal from '@/components/ui/Modal';

interface Project {
  id: number;
  title: string;
  description: string;
  brief_description: string;
  demo_link: string;
  github_link: string;
  image_url: string;
  tech_stack: string[];
  is_featured: boolean;
  status: 'completed' | 'in_progress' | 'planned';
}

const statusColors = {
  completed: 'bg-green-500/20 text-green-400 border-green-400/30',
  in_progress: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
  planned: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
};

const statusLabels = {
  completed: 'Completed',
  in_progress: 'In Progress',
  planned: 'Planned',
};

// Mock data
const mockProjects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with user authentication, product management, shopping cart, payment integration with Stripe, and admin dashboard. Features include real-time inventory tracking, order management, and email notifications.',
    brief_description: 'Full-stack e-commerce with payments and admin dashboard',
    demo_link: 'https://ecommerce-demo.com',
    github_link: 'https://github.com/user/ecommerce',
    image_url: 'https://via.placeholder.com/600x400/8b5cf6/ffffff?text=E-Commerce',
    tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'TailwindCSS'],
    is_featured: true,
    status: 'completed',
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, team workspaces, and deadline tracking. Includes Kanban boards, calendar view, and productivity analytics.',
    brief_description: 'Collaborative task management with real-time updates',
    demo_link: 'https://tasks-demo.com',
    github_link: 'https://github.com/user/tasks',
    image_url: 'https://via.placeholder.com/600x400/ec4899/ffffff?text=Task+App',
    tech_stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Socket.io', 'Prisma'],
    is_featured: true,
    status: 'completed',
  },
  {
    id: 3,
    title: 'AI Chat Assistant',
    description: 'An AI-powered chat assistant using GPT-4 API with custom knowledge base integration. Features conversation history, context awareness, and custom personality settings.',
    brief_description: 'AI chat with custom knowledge base integration',
    demo_link: 'https://ai-chat-demo.com',
    github_link: 'https://github.com/user/ai-chat',
    image_url: 'https://via.placeholder.com/600x400/06b6d4/ffffff?text=AI+Chat',
    tech_stack: ['Python', 'FastAPI', 'React', 'OpenAI', 'Redis'],
    is_featured: false,
    status: 'in_progress',
  },
  {
    id: 4,
    title: 'Portfolio Website',
    description: 'Personal portfolio website showcasing projects, skills, and experience. Features dark mode, animations, and contact form integration.',
    brief_description: 'Personal portfolio with animations and dark mode',
    demo_link: 'https://portfolio-demo.com',
    github_link: 'https://github.com/user/portfolio',
    image_url: 'https://via.placeholder.com/600x400/22c55e/ffffff?text=Portfolio',
    tech_stack: ['Next.js', 'TailwindCSS', 'Framer Motion', 'Vercel'],
    is_featured: false,
    status: 'completed',
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    brief_description: '',
    demo_link: '',
    github_link: '',
    image_url: '',
    tech_stack: '',
    is_featured: false,
    status: 'in_progress' as 'completed' | 'in_progress' | 'planned',
  });

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.brief_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech_stack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddProject = () => {
    const project: Project = {
      id: Date.now(),
      ...newProject,
      tech_stack: newProject.tech_stack.split(',').map((t) => t.trim()),
    };
    setProjects([...projects, project]);
    setIsAddModalOpen(false);
    setNewProject({
      title: '',
      description: '',
      brief_description: '',
      demo_link: '',
      github_link: '',
      image_url: '',
      tech_stack: '',
      is_featured: false,
      status: 'in_progress',
    });
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
          <h1 className="text-3xl font-bold gradient-text">Projects</h1>
          <p className="text-white/60 mt-1">Showcase your personal projects</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="glass-button-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search projects or technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-12"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="glass-select"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In Progress</option>
          <option value="planned">Planned</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedProject(project)}
              className="glass-card overflow-hidden cursor-pointer group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 overflow-hidden">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-white/20" />
                  </div>
                )}
                {/* Featured Badge */}
                {project.is_featured && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
                {/* Status Badge */}
                <div
                  className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs border ${
                    statusColors[project.status]
                  }`}
                >
                  {statusLabels[project.status]}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">
                  {project.brief_description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-white/5 rounded-lg text-xs text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 4 && (
                    <span className="px-2 py-1 bg-white/5 rounded-lg text-xs text-white/40">
                      +{project.tech_stack.length - 4}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {project.demo_link && (
                    <a
                      href={project.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 glass-button-primary flex items-center justify-center gap-2 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </a>
                  )}
                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 glass-button flex items-center justify-center gap-2 text-sm"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Project Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Project"
        size="lg"
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
            <label className="block text-sm text-white/60 mb-2">Brief Description</label>
            <input
              type="text"
              value={newProject.brief_description}
              onChange={(e) =>
                setNewProject({ ...newProject, brief_description: e.target.value })
              }
              className="w-full glass-input"
              placeholder="Short description for card view"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Full Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="w-full glass-input h-24 resize-none"
              placeholder="Detailed project description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Demo Link</label>
              <input
                type="url"
                value={newProject.demo_link}
                onChange={(e) =>
                  setNewProject({ ...newProject, demo_link: e.target.value })
                }
                className="w-full glass-input"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">GitHub Link</label>
              <input
                type="url"
                value={newProject.github_link}
                onChange={(e) =>
                  setNewProject({ ...newProject, github_link: e.target.value })
                }
                className="w-full glass-input"
                placeholder="https://github.com/..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Image URL</label>
              <input
                type="url"
                value={newProject.image_url}
                onChange={(e) =>
                  setNewProject({ ...newProject, image_url: e.target.value })
                }
                className="w-full glass-input"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Status</label>
              <select
                value={newProject.status}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    status: e.target.value as 'completed' | 'in_progress' | 'planned',
                  })
                }
                className="w-full glass-select"
              >
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="planned">Planned</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">
              Tech Stack (comma separated)
            </label>
            <input
              type="text"
              value={newProject.tech_stack}
              onChange={(e) =>
                setNewProject({ ...newProject, tech_stack: e.target.value })
              }
              className="w-full glass-input"
              placeholder="React, Node.js, MongoDB..."
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={newProject.is_featured}
              onChange={(e) =>
                setNewProject({ ...newProject, is_featured: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="featured" className="text-sm text-white/60">
              Mark as Featured
            </label>
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

      {/* Project Detail Modal */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.title || ''}
        size="xl"
      >
        {selectedProject && (
          <div className="space-y-6">
            {/* Image */}
            {selectedProject.image_url && (
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img
                  src={selectedProject.image_url}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Status and Featured */}
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm border ${
                  statusColors[selectedProject.status]
                }`}
              >
                {statusLabels[selectedProject.status]}
              </span>
              {selectedProject.is_featured && (
                <span className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-purple-500 to-pink-500">
                  Featured
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm text-white/60 mb-2">Description</h4>
              <p className="text-white/80 leading-relaxed">{selectedProject.description}</p>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-sm text-white/60 mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-4 pt-4 border-t border-white/10">
              {selectedProject.demo_link && (
                <a
                  href={selectedProject.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 glass-button-primary flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  View Live Demo
                </a>
              )}
              {selectedProject.github_link && (
                <a
                  href={selectedProject.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 glass-button flex items-center justify-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

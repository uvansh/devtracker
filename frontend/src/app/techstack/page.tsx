'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Star } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import Modal from '@/components/ui/Modal';
import Image from 'next/image';

interface TechItem {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon: string; // slug for devicon
  color: string;
}

// Icon component that fetches from Devicon CDN
const TechIcon = ({ icon, name, color }: { icon: string; name: string; color: string }) => {
  const iconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-original.svg`;
  const fallbackUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-plain.svg`;
  
  return (
    <div 
      className="w-10 h-10 rounded-lg flex items-center justify-center p-2"
      style={{ backgroundColor: `${color}20` }}
    >
      <img
        src={iconUrl}
        alt={name}
        className="w-full h-full object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src === iconUrl) {
            target.src = fallbackUrl;
          } else {
            // Final fallback to a colored placeholder
            target.style.display = 'none';
            target.parentElement!.innerHTML = `<span class="text-lg font-bold" style="color: ${color}">${name.charAt(0)}</span>`;
          }
        }}
      />
    </div>
  );
};

const categories = [
  'Languages',
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Tools',
  'Cloud',
  'Other',
];

const categoryColors: Record<string, string> = {
  Languages: 'from-blue-500/20 to-blue-600/20 border-blue-400/30',
  Frontend: 'from-purple-500/20 to-purple-600/20 border-purple-400/30',
  Backend: 'from-green-500/20 to-green-600/20 border-green-400/30',
  Database: 'from-yellow-500/20 to-yellow-600/20 border-yellow-400/30',
  DevOps: 'from-orange-500/20 to-orange-600/20 border-orange-400/30',
  Tools: 'from-pink-500/20 to-pink-600/20 border-pink-400/30',
  Cloud: 'from-cyan-500/20 to-cyan-600/20 border-cyan-400/30',
  Other: 'from-gray-500/20 to-gray-600/20 border-gray-400/30',
};

const proficiencyLabels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];

// Available tech icons (devicon slugs)
const availableTechIcons: Record<string, { slug: string; color: string }> = {
  'TypeScript': { slug: 'typescript', color: '#3178c6' },
  'JavaScript': { slug: 'javascript', color: '#f7df1e' },
  'Python': { slug: 'python', color: '#3776ab' },
  'Java': { slug: 'java', color: '#007396' },
  'C++': { slug: 'cplusplus', color: '#00599c' },
  'C#': { slug: 'csharp', color: '#239120' },
  'Go': { slug: 'go', color: '#00add8' },
  'Rust': { slug: 'rust', color: '#000000' },
  'Ruby': { slug: 'ruby', color: '#cc342d' },
  'PHP': { slug: 'php', color: '#777bb4' },
  'Swift': { slug: 'swift', color: '#fa7343' },
  'Kotlin': { slug: 'kotlin', color: '#7f52ff' },
  'React': { slug: 'react', color: '#61dafb' },
  'Next.js': { slug: 'nextjs', color: '#000000' },
  'Vue.js': { slug: 'vuejs', color: '#4fc08d' },
  'Angular': { slug: 'angularjs', color: '#dd0031' },
  'Svelte': { slug: 'svelte', color: '#ff3e00' },
  'TailwindCSS': { slug: 'tailwindcss', color: '#38bdf8' },
  'Bootstrap': { slug: 'bootstrap', color: '#7952b3' },
  'Sass': { slug: 'sass', color: '#cc6699' },
  'Node.js': { slug: 'nodejs', color: '#339933' },
  'Express': { slug: 'express', color: '#000000' },
  'FastAPI': { slug: 'fastapi', color: '#009688' },
  'Django': { slug: 'django', color: '#092e20' },
  'Flask': { slug: 'flask', color: '#000000' },
  'Spring': { slug: 'spring', color: '#6db33f' },
  'NestJS': { slug: 'nestjs', color: '#e0234e' },
  'GraphQL': { slug: 'graphql', color: '#e10098' },
  'PostgreSQL': { slug: 'postgresql', color: '#336791' },
  'MySQL': { slug: 'mysql', color: '#4479a1' },
  'MongoDB': { slug: 'mongodb', color: '#47a248' },
  'Redis': { slug: 'redis', color: '#dc382d' },
  'SQLite': { slug: 'sqlite', color: '#003b57' },
  'Firebase': { slug: 'firebase', color: '#ffca28' },
  'Docker': { slug: 'docker', color: '#2496ed' },
  'Kubernetes': { slug: 'kubernetes', color: '#326ce5' },
  'Jenkins': { slug: 'jenkins', color: '#d24939' },
  'GitHub Actions': { slug: 'github', color: '#181717' },
  'Terraform': { slug: 'terraform', color: '#7b42bc' },
  'Git': { slug: 'git', color: '#f05032' },
  'GitHub': { slug: 'github', color: '#181717' },
  'VS Code': { slug: 'vscode', color: '#007acc' },
  'Figma': { slug: 'figma', color: '#f24e1e' },
  'Postman': { slug: 'postman', color: '#ff6c37' },
  'Jira': { slug: 'jira', color: '#0052cc' },
  'AWS': { slug: 'amazonwebservices', color: '#ff9900' },
  'Azure': { slug: 'azure', color: '#0078d4' },
  'GCP': { slug: 'googlecloud', color: '#4285f4' },
  'Vercel': { slug: 'vercel', color: '#000000' },
  'Netlify': { slug: 'netlify', color: '#00c7b7' },
  'Heroku': { slug: 'heroku', color: '#430098' },
  'Linux': { slug: 'linux', color: '#fcc624' },
  'Nginx': { slug: 'nginx', color: '#009639' },
  'Apache': { slug: 'apache', color: '#d22128' },
};

// Mock data with proper icon slugs
const mockTechStack: TechItem[] = [
  { id: 1, name: 'TypeScript', category: 'Languages', proficiency: 4, icon: 'typescript', color: '#3178c6' },
  { id: 2, name: 'Python', category: 'Languages', proficiency: 4, icon: 'python', color: '#3776ab' },
  { id: 3, name: 'JavaScript', category: 'Languages', proficiency: 5, icon: 'javascript', color: '#f7df1e' },
  { id: 4, name: 'React', category: 'Frontend', proficiency: 5, icon: 'react', color: '#61dafb' },
  { id: 5, name: 'Next.js', category: 'Frontend', proficiency: 4, icon: 'nextjs', color: '#000000' },
  { id: 6, name: 'TailwindCSS', category: 'Frontend', proficiency: 5, icon: 'tailwindcss', color: '#38bdf8' },
  { id: 7, name: 'Node.js', category: 'Backend', proficiency: 4, icon: 'nodejs', color: '#339933' },
  { id: 8, name: 'FastAPI', category: 'Backend', proficiency: 3, icon: 'fastapi', color: '#009688' },
  { id: 9, name: 'PostgreSQL', category: 'Database', proficiency: 4, icon: 'postgresql', color: '#336791' },
  { id: 10, name: 'MongoDB', category: 'Database', proficiency: 3, icon: 'mongodb', color: '#47a248' },
  { id: 11, name: 'Docker', category: 'DevOps', proficiency: 3, icon: 'docker', color: '#2496ed' },
  { id: 12, name: 'Git', category: 'Tools', proficiency: 5, icon: 'git', color: '#f05032' },
  { id: 13, name: 'AWS', category: 'Cloud', proficiency: 3, icon: 'amazonwebservices', color: '#ff9900' },
  { id: 14, name: 'Vercel', category: 'Cloud', proficiency: 4, icon: 'vercel', color: '#000000' },
];

export default function TechStackPage() {
  const [techStack, setTechStack] = useState<TechItem[]>(mockTechStack);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTech, setNewTech] = useState({
    name: '',
    category: 'Languages',
    proficiency: 3,
    icon: 'javascript',
    color: '#f7df1e',
  });

  const filteredTechStack = techStack.filter((tech) => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tech.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Group by category
  const groupedTechStack = filteredTechStack.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, TechItem[]>);

  const handleAddTech = () => {
    const tech: TechItem = {
      id: Date.now(),
      ...newTech,
    };
    setTechStack([...techStack, tech]);
    setIsAddModalOpen(false);
    setNewTech({
      name: '',
      category: 'Languages',
      proficiency: 3,
      icon: 'javascript',
      color: '#f7df1e',
    });
  };

  const handleDeleteTech = (id: number) => {
    setTechStack(techStack.filter((tech) => tech.id !== id));
  };

  const handleUpdateProficiency = (id: number, proficiency: number) => {
    setTechStack(
      techStack.map((tech) =>
        tech.id === id ? { ...tech, proficiency } : tech
      )
    );
  };

  const getStats = () => {
    const byCategory: Record<string, number> = {};
    techStack.forEach((tech) => {
      byCategory[tech.category] = (byCategory[tech.category] || 0) + 1;
    });
    const avgProficiency =
      techStack.reduce((sum, tech) => sum + tech.proficiency, 0) / techStack.length || 0;
    return { total: techStack.length, byCategory, avgProficiency: avgProficiency.toFixed(1) };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Tech Stack</h1>
          <p className="text-white/60 mt-1">Manage your skills and proficiency levels</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="glass-button-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Technology
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">{stats.total}</p>
          <p className="text-sm text-white/60">Total Skills</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.avgProficiency}</p>
          <p className="text-sm text-white/60">Avg Proficiency</p>
        </div>
        {Object.entries(stats.byCategory).slice(0, 4).map(([category, count]) => (
          <div key={category} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">{count}</p>
            <p className="text-sm text-white/60">{category}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-12"
            />
          </div>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="glass-select"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Tech Stack by Category */}
      <div className="space-y-8">
        {Object.entries(groupedTechStack).map(([category, techs]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                  categoryColors[category]?.replace('from-', 'from-').replace('/20', '') || 'from-gray-500'
                }`}
              />
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {techs.map((tech) => (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    className={`glass-card p-5 border ${categoryColors[tech.category]} group`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <TechIcon icon={tech.icon} name={tech.name} color={tech.color} />
                        <div>
                          <h4 className="font-semibold">{tech.name}</h4>
                          <p className="text-xs text-white/40">{tech.category}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTech(tech.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Proficiency Stars */}
                    <div className="mb-3">
                      <p className="text-xs text-white/40 mb-2">
                        {proficiencyLabels[tech.proficiency - 1]}
                      </p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => handleUpdateProficiency(tech.id, level)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                level <= tech.proficiency
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-white/20'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Proficiency Bar */}
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(tech.proficiency / 5) * 100}%` }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${tech.color}, ${tech.color}88)`,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {Object.keys(groupedTechStack).length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Plus className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No technologies found</h3>
          <p className="text-white/60 mb-6">
            {searchQuery || categoryFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Start building your tech stack'}
          </p>
          {!searchQuery && categoryFilter === 'all' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="glass-button-primary"
            >
              Add Your First Technology
            </button>
          )}
        </div>
      )}

      {/* Add Tech Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Technology"
        size="lg"
      >
        <div className="space-y-4">
          {/* Tech Selector */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Select Technology</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-white/5 rounded-xl">
              {Object.entries(availableTechIcons).map(([name, { slug, color }]) => (
                <button
                  key={name}
                  onClick={() => setNewTech({ ...newTech, name, icon: slug, color })}
                  className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                    newTech.name === name
                      ? 'bg-purple-500/30 border border-purple-400/50'
                      : 'hover:bg-white/10 border border-transparent'
                  }`}
                  title={name}
                >
                  <img
                    src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`}
                    alt={name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-plain.svg`;
                    }}
                  />
                  <span className="text-[10px] text-white/60 truncate w-full text-center">{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Tech Preview */}
          {newTech.name && (
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <TechIcon icon={newTech.icon} name={newTech.name} color={newTech.color} />
              <div>
                <p className="font-medium">{newTech.name}</p>
                <p className="text-xs text-white/40">Selected technology</p>
              </div>
            </div>
          )}

          {/* Or Custom Name */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Or enter custom name</label>
            <input
              type="text"
              value={newTech.name}
              onChange={(e) => {
                const name = e.target.value;
                const techInfo = availableTechIcons[name];
                if (techInfo) {
                  setNewTech({ ...newTech, name, icon: techInfo.slug, color: techInfo.color });
                } else {
                  setNewTech({ ...newTech, name });
                }
              }}
              className="w-full glass-input"
              placeholder="e.g., React, Python, Docker"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Category</label>
              <select
                value={newTech.category}
                onChange={(e) => setNewTech({ ...newTech, category: e.target.value })}
                className="w-full glass-select"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newTech.color}
                  onChange={(e) => setNewTech({ ...newTech, color: e.target.value })}
                  className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={newTech.color}
                  onChange={(e) => setNewTech({ ...newTech, color: e.target.value })}
                  className="flex-1 glass-input"
                  placeholder="#8b5cf6"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">
              Proficiency Level: {proficiencyLabels[newTech.proficiency - 1]}
            </label>
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setNewTech({ ...newTech, proficiency: level })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      level <= newTech.proficiency
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-white/20 hover:text-white/40'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setIsAddModalOpen(false)} className="glass-button">
              Cancel
            </button>
            <button 
              onClick={handleAddTech} 
              className="glass-button-primary"
              disabled={!newTech.name}
            >
              Add Technology
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

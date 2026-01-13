'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Code2,
  FolderKanban,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleTryNow = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const features = [
    {
      icon: Briefcase,
      title: 'Job Tracking',
      description: 'Track applications, interviews, and offers with detailed company insights',
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-400/30',
    },
    {
      icon: Code2,
      title: 'LeetCode Insights',
      description: 'Monitor your problem-solving progress with difficulty tracking',
      color: 'from-pink-500/20 to-pink-600/20',
      borderColor: 'border-pink-400/30',
    },
    {
      icon: FolderKanban,
      title: 'Project Showcase',
      description: 'Build and display your portfolio with featured projects',
      color: 'from-cyan-500/20 to-cyan-600/20',
      borderColor: 'border-cyan-400/30',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Visualize your growth with contribution heatmaps and stats',
      color: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-400/30',
    },
    {
      icon: Zap,
      title: 'Daily Goals',
      description: 'Set and track daily todos with priority management',
      color: 'from-orange-500/20 to-orange-600/20',
      borderColor: 'border-orange-400/30',
    },
    {
      icon: Star,
      title: 'Tech Stack Builder',
      description: 'Showcase your skills with categorized technology proficiency',
      color: 'from-yellow-500/20 to-yellow-600/20',
      borderColor: 'border-yellow-400/30',
    },
  ];

  const stats = [
    { number: '1000+', label: 'Active Developers' },
    { number: '50K+', label: 'Applications Tracked' },
    { number: '100K+', label: 'Problems Solved' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6"
      >
        <div className="flex items-center space-x-2">
          <Zap className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            DevTracker
          </span>
        </div>
        <button
          onClick={handleTryNow}
          className="glass-button-primary"
        >
          Try Now!
          <ArrowRight className="w-4 h-4 ml-2 inline" />
        </button>
      </motion.nav>

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-6 md:px-12 py-20 md:py-32"
      >
        {/* Main Hero */}
        <div className="max-w-5xl mx-auto">
          <motion.div variants={itemVariants} className="text-center space-y-6 mb-12">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="block">Your Career</span>
              <span className="gradient-text">In One Place</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              DevTracker is the ultimate platform for developers to manage job applications,
              track coding progress, showcase projects, and achieve their career goals.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 justify-center mb-20">
            <button
              onClick={handleTryNow}
              className="glass-button-primary px-8 py-4 text-lg"
            >
              Try Now!
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
            <button className="glass-button px-8 py-4 text-lg hover:border-purple-400/50">
              Watch Demo
            </button>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="glass-card text-center p-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 px-6 md:px-12 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Powerful tools designed specifically for developer career growth
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08, duration: 0.45, ease: 'easeOut' }}
                  whileHover={{ scale: 1.02 }}
                  className={`glass-card p-8 border ${feature.borderColor} bg-gradient-to-br ${feature.color} group cursor-pointer`}
                >
                  <div className="mb-4">
                    <Icon className="w-10 h-10 text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 px-6 md:px-12 py-20"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why DevTracker?
            </h2>
          </motion.div>

          <div className="grid gap-6">
            {[
              'Centralize all your career activities in one beautiful dashboard',
              'Get real-time insights into your job search and progress',
              'Built with modern tech: Next.js, FastAPI, TailwindCSS',
              'Glassmorphism design with smooth animations',
              'Track unlimited applications, problems, and projects',
              'Beautiful contribution heatmaps and statistics',
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.45, ease: 'easeOut' }}
                className="glass-card p-6 flex items-start space-x-4 border border-white/10"
              >
                <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-white/80">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 px-6 md:px-12 py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="glass-card border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-12 md:p-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Track Your Success?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Join developers worldwide who are tracking their career growth with DevTracker.
            Start for free today.
          </p>
          <motion.button
            onClick={handleTryNow}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button-primary px-8 py-4 text-lg"
          >
            Try Now!
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 px-6 md:px-12 py-12 border-t border-white/10 mt-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-bold">DevTracker</span>
              </div>
              <p className="text-white/60">Track your career growth</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Blog'] },
              { title: 'Company', links: ['About', 'Contact', 'Careers'] },
              { title: 'Resources', links: ['Docs', 'Support', 'GitHub'] },
            ].map((col, idx) => (
              <div key={idx}>
                <h3 className="font-bold mb-3">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white/60 hover:text-purple-400 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/60">
            <p>&copy; 2026 DevTracker. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

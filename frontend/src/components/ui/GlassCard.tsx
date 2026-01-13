'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hover = false, onClick }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02 } : undefined}
      onClick={onClick}
      className={`glass-card p-6 ${hover ? 'cursor-pointer glass-card-hover' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'purple' | 'pink' | 'cyan' | 'green' | 'orange';
}

const colorClasses = {
  purple: 'from-purple-500/20 to-purple-600/20 border-purple-400/30',
  pink: 'from-pink-500/20 to-pink-600/20 border-pink-400/30',
  cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-400/30',
  green: 'from-green-500/20 to-green-600/20 border-green-400/30',
  orange: 'from-orange-500/20 to-orange-600/20 border-orange-400/30',
};

const iconColorClasses = {
  purple: 'text-purple-400',
  pink: 'text-pink-400',
  cyan: 'text-cyan-400',
  green: 'text-green-400',
  orange: 'text-orange-400',
};

export function StatCard({ title, value, icon: Icon, trend, trendUp, color = 'purple' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl border rounded-2xl p-6 shadow-xl`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-white/5 ${iconColorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Cloud, Sunrise, Sunset } from 'lucide-react';
import { format } from 'date-fns';

export default function TimeDisplay() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 relative overflow-hidden h-[140px]"
      />
    );
  }

  const hour = time.getHours();
  const getGreeting = () => {
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getIcon = () => {
    if (hour < 6) return Moon;
    if (hour < 8) return Sunrise;
    if (hour < 17) return Sun;
    if (hour < 20) return Sunset;
    return Moon;
  };

  const Icon = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      {/* Background gradient based on time */}
      <div
        className={`absolute inset-0 opacity-30 ${
          hour < 6 || hour > 20
            ? 'bg-gradient-to-br from-indigo-900 to-purple-900'
            : hour < 12
            ? 'bg-gradient-to-br from-orange-400 to-yellow-400'
            : hour < 17
            ? 'bg-gradient-to-br from-cyan-400 to-blue-500'
            : 'bg-gradient-to-br from-orange-500 to-pink-500'
        }`}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm">{getGreeting()}</p>
          <h2 className="text-4xl font-bold mt-2 gradient-text">
            {format(time, 'hh:mm a')}
          </h2>
          <p className="text-white/80 mt-2">
            {format(time, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/10">
          <Icon className="w-12 h-12 text-yellow-400" />
        </div>
      </div>
    </motion.div>
  );
}

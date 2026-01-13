'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

// Generate mock data for demonstration
const generateMockData = (): ContributionDay[] => {
  const data: ContributionDay[] = [];
  const today = new Date();
  
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random contribution count
    const count = Math.floor(Math.random() * 8);
    const level = count === 0 ? 0 : Math.min(Math.ceil(count / 2), 4);
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      count,
      level,
    });
  }
  
  return data;
};

export default function ContributionHeatmap() {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  useEffect(() => {
    // In production, fetch from API
    setContributions(generateMockData());
  }, []);

  // Group contributions by week
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];
  
  contributions.forEach((day, index) => {
    const date = new Date(day.date);
    if (date.getDay() === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
    if (index === contributions.length - 1) {
      weeks.push(currentWeek);
    }
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Contribution Activity</h3>
      
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 text-xs text-white/40 mr-2">
            {days.map((day, i) => (
              <div key={day} className="h-3 flex items-center" style={{ display: i % 2 === 0 ? 'none' : 'flex' }}>
                {day}
              </div>
            ))}
          </div>
          
          {/* Contribution grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day) => (
                  <motion.div
                    key={day.date}
                    whileHover={{ scale: 1.3 }}
                    className={`w-3 h-3 rounded-sm cursor-pointer contribution-${day.level}`}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    title={`${day.count} contributions on ${format(new Date(day.date), 'MMM d, yyyy')}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="mt-4 h-6 flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          {hoveredDay ? (
            <motion.p
              key={hoveredDay.date}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="text-sm text-white/80"
            >
              <span className="font-semibold text-purple-400">{hoveredDay.count} contributions</span>
              <span className="text-white/60"> on {format(new Date(hoveredDay.date), 'EEEE, MMM d, yyyy')}</span>
            </motion.p>
          ) : (
            <motion.p
              key="default"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="text-sm text-white/40"
            >
              Hover over a day to see details
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-white/40">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div key={level} className={`w-3 h-3 rounded-sm contribution-${level}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

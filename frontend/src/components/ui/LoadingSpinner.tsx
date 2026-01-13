'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function LoadingSpinner({
  size = 'md',
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-purple-400`} />
      {text && <p className="text-white/60 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
}

// Skeleton loader for cards
export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card p-6 animate-pulse"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10" />
            <div className="flex-1">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-5/6" />
          </div>
        </div>
      ))}
    </>
  );
}

// Skeleton loader for table rows
export function TableRowSkeleton({ columns = 5, rows = 3 }: { columns?: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-white/5">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="p-4">
              <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// Skeleton for stats
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-4 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/2 mx-auto mb-2" />
          <div className="h-3 bg-white/10 rounded w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  );
}

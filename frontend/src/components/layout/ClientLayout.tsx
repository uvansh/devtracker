'use client';

import { ReactNode } from 'react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/layout/Sidebar';
import BackgroundOrbs from '@/components/ui/BackgroundOrbs';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <BackgroundOrbs />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 pb-24 md:pt-8 md:pb-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </>
  );
}

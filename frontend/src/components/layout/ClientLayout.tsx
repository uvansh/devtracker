'use client';

import { ReactNode, useMemo, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/layout/Sidebar';
import BackgroundOrbs from '@/components/ui/BackgroundOrbs';
import { useAuth } from '@/context/AuthContext';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const showSidebar = useMemo(
    () => pathname !== '/landing' && pathname !== '/' && pathname !== '/login',
    [pathname]
  );
  const mainPadding = showSidebar
    ? 'flex-1 md:ml-64 p-4 md:p-8 pt-20 pb-24 md:pt-8 md:pb-8'
    : 'flex-1 p-4 md:p-8 pt-20 pb-24 md:pt-8 md:pb-8';

  const isPublicRoute = pathname === '/landing' || pathname === '/' || pathname === '/login';


  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/landing');
    }
  }, [isAuthenticated, isLoading, isPublicRoute, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="glass-card p-6">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <BackgroundOrbs />
      <div className="flex min-h-screen">
        {showSidebar && <Sidebar />}
        <main className={mainPadding}>
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

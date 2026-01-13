import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: 'DevTracker - Personal Job & Progress Tracker',
  description: 'A modern tracker for developers to manage job applications, LeetCode problems, projects, and daily goals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-900 text-white antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

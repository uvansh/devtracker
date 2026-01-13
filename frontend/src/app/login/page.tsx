'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  const isSignup = mode === 'signup';

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6"
      >
        <button
          onClick={() => router.push('/landing')}
          className="flex items-center space-x-2"
        >
          <Zap className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            DevTracker
          </span>
        </button>
        <button
          onClick={() => router.push('/landing')}
          className="glass-button"
        >
          Back
          <ArrowRight className="w-4 h-4 ml-2 inline" />
        </button>
      </motion.nav>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mt-20 md:mt-0"
      >
        <form onSubmit={handleAuth} className="glass-card p-8 space-y-4 border border-white/10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 gradient-text">
              {isSignup ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p className="text-white/70 text-sm">
              {isSignup
                ? 'Sign up to start tracking your career'
                : 'Log in to your DevTracker account'}
            </p>
          </div>

          {isSignup && (
            <div className="space-y-2">
              <label className="text-sm text-white/70">Full Name</label>
              <input
                className="glass-input w-full"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-white/70">Email Address</label>
            <input
              type="email"
              className="glass-input w-full"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Password</label>
            <input
              type="password"
              className="glass-input w-full"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-300 bg-red-500/10 p-3 rounded-lg border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="glass-button-primary w-full py-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? 'Processing...' : isSignup ? 'Sign Up' : 'Log In'}
            {!submitting && <ArrowRight className="w-4 h-4 ml-2 inline" />}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-white/60">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleMode}
            className="glass-button w-full py-3 text-lg"
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>

          <p className="text-xs text-white/50 text-center mt-4">
            🔒 Demo: Use any email/password. Data stored locally.
          </p>
        </form>
      </motion.div>
    </div>
  );
}

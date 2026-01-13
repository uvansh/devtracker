'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type User = {
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'devtracker_auth_user';
const STORAGE_PASSWORD_KEY = 'devtracker_auth_password';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate user from localStorage (client-side only)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Failed to load auth from storage', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistUser = useCallback((nextUser: User) => {
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const savedUserRaw = localStorage.getItem(STORAGE_KEY);
    const savedPassword = localStorage.getItem(STORAGE_PASSWORD_KEY);

    if (!savedUserRaw || !savedPassword) {
      throw new Error('No account found. Please sign up first.');
    }

    const savedUser = JSON.parse(savedUserRaw) as User;
    if (savedUser.email !== email || savedPassword !== password) {
      throw new Error('Invalid email or password');
    }

    persistUser(savedUser);
  }, [persistUser]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      throw new Error('All fields are required');
    }

    const newUser: User = { name: name.trim(), email: email.trim() };
    localStorage.setItem(STORAGE_PASSWORD_KEY, password);
    persistUser(newUser);
  }, [persistUser]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_PASSWORD_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
    }),
    [user, isLoading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

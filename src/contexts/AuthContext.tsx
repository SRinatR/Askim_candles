
// src/contexts/AuthContext.tsx
"use client";

import type { User } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, name?: string) => Promise<void>; // Name is optional, useful for registration
  register: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER_STORAGE_KEY = 'scentSationalUser';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load user from localStorage on initial mount
    try {
      const storedUser = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(MOCK_USER_STORAGE_KEY); // Clear corrupted data
    }
    setLoading(false);
  }, []);

  const login = async (email: string, name: string = "User") => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const user: User = { id: Date.now().toString(), email, name: name || `User-${Date.now().toString().slice(-4)}` };
    setCurrentUser(user);
    localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user));
  };

  const register = async (name: string, email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // For MVP, registration is similar to login, just sets the user
    const user: User = { id: Date.now().toString(), email, name };
    setCurrentUser(user); // Or you might want to auto-login, or just indicate success
    localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user)); // Simulate auto-login after registration
  };

  const logout = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentUser(null);
    localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    router.push('/login'); // Redirect to login after logout
  };

  // Prevent rendering children until loading is false to avoid hydration issues with localStorage
  if (loading && typeof window !== 'undefined') {
     // On the client, if still loading, you might show a loader or nothing
     // For simplicity, we'll return null, but a proper app might have a loading screen
     return null; 
  }


  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

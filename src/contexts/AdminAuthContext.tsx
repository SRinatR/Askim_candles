
"use client";

import type { AdminUser } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';

type AdminRole = 'ADMIN' | 'MANAGER';

interface AdminAuthContextType {
  currentAdminUser: AdminUser | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  role: AdminRole | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'scentSationalAdminUser';

const predefinedUsers: Record<string, AdminUser> = {
  'admin@scentsational.com': {
    id: 'admin001',
    email: 'admin@scentsational.com',
    name: 'Store Administrator',
    role: 'ADMIN',
    password: 'adminpass', // In a real app, this would be hashed and checked on a server
  },
  'manager@scentsational.com': {
    id: 'manager001',
    email: 'manager@scentsational.com',
    name: 'Store Manager',
    role: 'MANAGER',
    password: 'managerpass', // In a real app, this would be hashed and checked on a server
  },
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser: AdminUser = JSON.parse(storedUser);
        // Basic validation of stored user
        if (parsedUser && parsedUser.email && parsedUser.role) {
           setCurrentAdminUser(parsedUser);
        } else {
          localStorage.removeItem(ADMIN_STORAGE_KEY); // Clear invalid stored user
        }
      } catch (error) {
        console.error("Failed to parse admin user from localStorage", error);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const userToLogin = predefinedUsers[email.toLowerCase()];

    if (userToLogin && userToLogin.password === pass) {
      setCurrentAdminUser(userToLogin);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(userToLogin));
      toast({ title: "Admin Login Successful", description: `Welcome, ${userToLogin.name}!` });
      setIsLoading(false);
      router.push('/admin/dashboard');
      return true;
    } else {
      toast({ title: "Admin Login Failed", description: "Invalid email or password.", variant: "destructive" });
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setCurrentAdminUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    toast({ title: "Logged Out", description: "You have been successfully logged out from the admin panel." });
    router.push('/admin/login');
  };
  
  const role = currentAdminUser?.role || null;
  const isAdmin = role === 'ADMIN';
  const isManager = role === 'MANAGER' || role === 'ADMIN'; // Admin can do everything a manager can

  // Protection for admin routes
  useEffect(() => {
    if (!isLoading && !currentAdminUser && pathname.startsWith('/admin') && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isLoading, currentAdminUser, pathname, router]);


  return (
    <AdminAuthContext.Provider value={{ currentAdminUser, login, logout, isLoading, isAdmin, isManager, role }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

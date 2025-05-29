
"use client";

import type { AdminUser, AdminRole } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';
import { logAdminAction } from '@/admin/lib/admin-logger';

interface AdminAuthContextType {
  currentAdminUser: AdminUser | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  role: AdminRole | null;
  predefinedUsers: Record<string, AdminUser>; 
  dynamicallyAddedManagers: AdminUser[]; 
  addManager: (name: string, email: string, pass: string) => Promise<boolean>; 
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'askimAdminUser';
const DYNAMIC_MANAGERS_STORAGE_KEY = 'askimDynamicManagers';

const initialPredefinedUsers: Record<string, AdminUser> = {
  'admin@askim.com': { 
    id: 'admin001',
    email: 'admin@askim.com',
    name: 'Store Administrator',
    role: 'ADMIN',
    password: 'adminpass', 
  },
  'manager@askim.com': { 
    id: 'manager001',
    email: 'manager@askim.com',
    name: 'Store Manager',
    role: 'MANAGER',
    password: 'managerpass', 
  },
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  
  const [predefinedUsers, setPredefinedUsers] = useState<Record<string, AdminUser>>(initialPredefinedUsers);
  const [dynamicallyAddedManagers, setDynamicallyAddedManagers] = useState<AdminUser[]>([]);


  useEffect(() => {
    const storedUser = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser: AdminUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email && parsedUser.role) {
           setCurrentAdminUser(parsedUser);
        } else {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      } catch (error) {
        console.error("Failed to parse admin user from localStorage", error);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    }

    const storedDynamicManagers = localStorage.getItem(DYNAMIC_MANAGERS_STORAGE_KEY);
    if (storedDynamicManagers) {
        try {
            const parsedManagers: AdminUser[] = JSON.parse(storedDynamicManagers);
            if (Array.isArray(parsedManagers)) {
                setDynamicallyAddedManagers(parsedManagers);
            }
        } catch (error) {
            console.error("Failed to parse dynamic managers from localStorage", error);
            localStorage.removeItem(DYNAMIC_MANAGERS_STORAGE_KEY);
        }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); 

    const lowerEmail = email.toLowerCase();
    let userToLogin = predefinedUsers[lowerEmail];

    if (!userToLogin) { 
        userToLogin = dynamicallyAddedManagers.find(manager => manager.email.toLowerCase() === lowerEmail);
    }

    if (userToLogin && userToLogin.password === pass) {
      setCurrentAdminUser(userToLogin);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(userToLogin));
      logAdminAction(userToLogin.email, "Admin Login Success");
      toast({ title: "Admin Login Successful", description: `Welcome, ${userToLogin.name}!` });
      setIsLoading(false);
      router.push('/admin/dashboard');
      return true;
    } else {
      logAdminAction(email, "Admin Login Failed", { reason: "Invalid credentials" });
      toast({ 
        title: "Admin Login Failed", 
        description: "Invalid email or password. Please check your credentials and try again.", 
        variant: "destructive",
        duration: 5000
      });
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    if (currentAdminUser?.email) {
      logAdminAction(currentAdminUser.email, "Admin Logout");
    }
    setCurrentAdminUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    toast({ title: "Logged Out", description: "You have been successfully logged out from the admin panel." });
    router.push('/admin/login'); 
  };

  const addManager = async (name: string, email: string, pass: string): Promise<boolean> => {
    const lowerEmail = email.toLowerCase();
    if (predefinedUsers[lowerEmail] || dynamicallyAddedManagers.some(m => m.email.toLowerCase() === lowerEmail)) {
        toast({ 
          title: "Failed to Add Manager", 
          description: "An account with this email address already exists. Please use a different email.", 
          variant: "destructive",
          duration: 5000 
        });
        if (currentAdminUser?.email) {
          logAdminAction(currentAdminUser.email, "Add Manager Failed", { managerEmail: email, reason: "Email exists" });
        }
        return false;
    }
    const newManager: AdminUser = {
        id: `manager-${Date.now()}`,
        name,
        email,
        password: pass, 
        role: 'MANAGER',
    };
    const updatedManagers = [...dynamicallyAddedManagers, newManager];
    setDynamicallyAddedManagers(updatedManagers);
    localStorage.setItem(DYNAMIC_MANAGERS_STORAGE_KEY, JSON.stringify(updatedManagers));
    toast({
        title: "Manager Added (Simulated)",
        description: `${name} (${email}) has been 'added' as a manager. This change is client-side (localStorage).`,
    });
    if (currentAdminUser?.email) {
      logAdminAction(currentAdminUser.email, "Manager Added (Simulated)", { managerEmail: email, managerName: name });
    }
    return true;
  };
  
  const role = currentAdminUser?.role || null;
  const isAdmin = role === 'ADMIN';
  const isManager = role === 'MANAGER' || role === 'ADMIN'; 

  useEffect(() => {
    if (!isLoading && !currentAdminUser && pathname.startsWith('/admin') && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isLoading, currentAdminUser, pathname, router]);


  return (
    <AdminAuthContext.Provider value={{ 
        currentAdminUser, 
        login, 
        logout, 
        isLoading, 
        isAdmin, 
        isManager, 
        role,
        predefinedUsers, 
        dynamicallyAddedManagers, 
        addManager 
    }}>
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

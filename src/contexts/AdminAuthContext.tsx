
"use client";

import type { AdminUser, AdminRole } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';
import { logAdminAction } from '@/admin/lib/admin-logger';
import type { AdminLocale } from '@/admin/lib/i18n-config-admin';
import { i18nAdmin } from '@/admin/lib/i18n-config-admin';
import { getAdminDictionary } from '@/admin/lib/getAdminDictionary';
import type enAdminMessages from '@/admin/dictionaries/en.json';

type AdminLoginStrings = typeof enAdminMessages.adminLoginPage;
type AdminContextToastStrings = typeof enAdminMessages.adminContextToasts;

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
  toggleBlockManagerStatus: (email: string) => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'askimAdminUser';
const DYNAMIC_MANAGERS_STORAGE_KEY = 'askimDynamicManagers';

const initialPredefinedUsers: Record<string, AdminUser> = {
  'admin@scentsational.com': {
    id: 'admin001',
    email: 'admin@scentsational.com',
    name: 'Store Administrator',
    role: 'ADMIN',
    password: 'adminpass',
    isBlocked: false,
  },
  'manager@scentsational.com': {
    id: 'manager001',
    email: 'manager@scentsational.com',
    name: 'Store Manager',
    role: 'MANAGER',
    password: 'managerpass',
    isBlocked: false,
  },
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [predefinedUsers] = useState<Record<string, AdminUser>>(initialPredefinedUsers);
  const [dynamicallyAddedManagers, setDynamicallyAddedManagers] = useState<AdminUser[]>([]);
  const [currentAdminLocale, setCurrentAdminLocale] = useState<AdminLocale>(i18nAdmin.defaultLocale);
  const [authStrings, setAuthStrings] = useState<{ login: AdminLoginStrings | null, contextToasts: AdminContextToastStrings | null }>({ login: null, contextToasts: null });

  useEffect(() => {
    const storedLocale = localStorage.getItem('admin-lang') as AdminLocale | null;
    const localeToLoad = storedLocale && i18nAdmin.locales.includes(storedLocale) ? storedLocale : i18nAdmin.defaultLocale;
    setCurrentAdminLocale(localeToLoad);

    async function loadTranslations() {
      const dict = await getAdminDictionary(localeToLoad);
      setAuthStrings({ login: dict.adminLoginPage, contextToasts: dict.adminContextToasts });
    }
    loadTranslations();

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

  useEffect(() => {
    async function loadTranslations() {
      const dict = await getAdminDictionary(currentAdminLocale);
      setAuthStrings({ login: dict.adminLoginPage, contextToasts: dict.adminContextToasts });
    }
    if (!isLoading) { 
      loadTranslations();
    }
  }, [currentAdminLocale, isLoading]);


  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const lowerEmail = email.toLowerCase();
    let userToLogin = predefinedUsers[lowerEmail];

    if (!userToLogin) {
        userToLogin = dynamicallyAddedManagers.find(manager => manager.email.toLowerCase() === lowerEmail);
    }

    if (userToLogin && userToLogin.password === pass) {
      if (userToLogin.isBlocked) {
        logAdminAction(email, "Admin Login Failed", { reason: "Account blocked" });
        toast({
          title: authStrings.login?.loginErrorTitle || "Admin Login Failed",
          description: authStrings.contextToasts?.accountBlockedErrorDesc || "This account is blocked. Please contact an administrator.",
          variant: "destructive",
          duration: 5000
        });
        setIsLoading(false);
        return false;
      }
      setCurrentAdminUser(userToLogin);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(userToLogin));
      logAdminAction(userToLogin.email, "Admin Login Success");
      toast({
        title: authStrings.login?.loginSuccessTitle || "Admin Login Successful",
        description: (authStrings.login?.loginWelcomeMessage || "Welcome, {name}!").replace('{name}', userToLogin.name || 'Admin')
      });
      setIsLoading(false);
      router.push('/admin/dashboard');
      return true;
    } else {
      logAdminAction(email, "Admin Login Failed", { reason: "Invalid credentials" });
      toast({
        title: authStrings.login?.loginErrorTitle || "Admin Login Failed",
        description: authStrings.login?.loginErrorDescInvalid || "Invalid email or password. Please check your credentials and try again.",
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
    toast({
        title: authStrings.contextToasts?.logoutSuccessTitle || "Logged Out",
        description: authStrings.contextToasts?.logoutSuccessDesc || "You have been successfully logged out from the admin panel."
    });
    router.push('/admin/login');
  };

  const addManager = async (name: string, email: string, pass: string): Promise<boolean> => {
    const lowerEmail = email.toLowerCase();
    if (predefinedUsers[lowerEmail] || dynamicallyAddedManagers.some(m => m.email.toLowerCase() === lowerEmail)) {
        toast({
          title: authStrings.contextToasts?.addManagerErrorEmailExistsTitle || "Failed to Add Manager",
          description: authStrings.contextToasts?.addManagerErrorEmailExistsDesc || "An account with this email address already exists. Please use a different email.",
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
        isBlocked: false, // Initialize as not blocked
    };
    const updatedManagers = [...dynamicallyAddedManagers, newManager];
    setDynamicallyAddedManagers(updatedManagers);
    localStorage.setItem(DYNAMIC_MANAGERS_STORAGE_KEY, JSON.stringify(updatedManagers));
    toast({
        title: authStrings.contextToasts?.addManagerSuccessTitle || "Manager Added (Simulated)",
        description: (authStrings.contextToasts?.addManagerSuccessDesc || "{name} ({email}) has been 'added' as a manager. This change is client-side (localStorage).")
                        .replace('{name}', name)
                        .replace('{email}', email),
    });
    if (currentAdminUser?.email) {
      logAdminAction(currentAdminUser.email, "Manager Added (Simulated)", { managerEmail: email, managerName: name });
    }
    return true;
  };

  const toggleBlockManagerStatus = async (emailToToggle: string): Promise<void> => {
    const updatedManagers = dynamicallyAddedManagers.map(manager => {
        if (manager.email.toLowerCase() === emailToToggle.toLowerCase()) {
            return { ...manager, isBlocked: !manager.isBlocked };
        }
        return manager;
    });
    setDynamicallyAddedManagers(updatedManagers);
    localStorage.setItem(DYNAMIC_MANAGERS_STORAGE_KEY, JSON.stringify(updatedManagers));

    const manager = updatedManagers.find(m => m.email.toLowerCase() === emailToToggle.toLowerCase());
    if (manager && currentAdminUser) {
        const action = manager.isBlocked ? "Manager Blocked (Simulated)" : "Manager Unblocked (Simulated)";
        logAdminAction(currentAdminUser.email, action, { managerEmail: manager.email, managerName: manager.name });
        toast({
            title: manager.isBlocked ? (authStrings.contextToasts?.managerBlockedToastTitle || "Manager Blocked") 
                                     : (authStrings.contextToasts?.managerUnblockedToastTitle || "Manager Unblocked"),
            description: (authStrings.contextToasts?.managerStatusUpdatedToastDesc || "{name} status updated to {status}.")
                            .replace('{name}', manager.name)
                            .replace('{status}', manager.isBlocked ? 'Blocked' : 'Active'),
        });
    }
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
        addManager,
        toggleBlockManagerStatus
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

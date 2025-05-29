
"use client";

import type { SimulatedUser } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: SimulatedUser | null;
  login: (email: string, pass: string) => Promise<boolean>;
  registerStep1: (email: string, pass: string) => Promise<boolean>;
  registerStep2: (firstName: string, lastName: string) => Promise<boolean>;
  confirmAccount: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  registrationData: Partial<SimulatedUser> | null; // To hold data between registration steps
  setRegistrationData: React.Dispatch<React.SetStateAction<Partial<SimulatedUser> | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS_STORAGE_KEY = 'scentSationalSimulatedUsers';
const CURRENT_USER_STORAGE_KEY = 'scentSationalSimulatedCurrentUser';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<SimulatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationData, setRegistrationData] = useState<Partial<SimulatedUser> | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const getStoredUsers = (): Record<string, SimulatedUser> => {
    const users = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : {};
  };

  const saveStoredUsers = (users: Record<string, SimulatedUser>) => {
    localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    const users = getStoredUsers();
    const user = users[email.toLowerCase()];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (user && user.password === pass && user.isConfirmed) { // Check password and confirmation
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      toast({ title: "Login Successful", description: `Welcome back, ${user.name || user.email}!` });
      setIsLoading(false);
      return true;
    } else if (user && user.password === pass && !user.isConfirmed) {
      toast({ title: "Login Failed", description: "Account not confirmed. Please check your email or complete registration.", variant: "destructive" });
    } else {
      toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
    }
    setIsLoading(false);
    return false;
  };

  const registerStep1 = async (email: string, pass: string): Promise<boolean> => {
    const users = getStoredUsers();
    if (users[email.toLowerCase()]) {
      toast({ title: "Registration Failed", description: "Email already exists.", variant: "destructive" });
      return false;
    }
    setRegistrationData({ email: email.toLowerCase(), password: pass, id: Date.now().toString() });
    return true;
  };

  const registerStep2 = async (firstName: string, lastName: string): Promise<boolean> => {
    if (!registrationData || !registrationData.email || !registrationData.password) {
      toast({ title: "Registration Error", description: "Previous step data missing.", variant: "destructive" });
      return false;
    }
    const updatedRegData = { ...registrationData, firstName, lastName, name: `${firstName} ${lastName}`, isRegistered: true, isConfirmed: false };
    setRegistrationData(updatedRegData);
    
    // Store partially registered user (so they can confirm later)
    const users = getStoredUsers();
    users[updatedRegData.email!] = updatedRegData as SimulatedUser; // email is checked above
    saveStoredUsers(users);
    
    return true;
  };
  
  const confirmAccount = async (): Promise<boolean> => {
    if (!registrationData || !registrationData.email || !registrationData.isRegistered) {
       toast({ title: "Confirmation Error", description: "No pending registration found to confirm or registration incomplete.", variant: "destructive" });
       return false;
    }
    const users = getStoredUsers();
    const userToConfirm = users[registrationData.email];

    if (userToConfirm) {
      userToConfirm.isConfirmed = true;
      users[registrationData.email] = userToConfirm;
      saveStoredUsers(users);
      setRegistrationData(null); // Clear registration data
      toast({ title: "Account Confirmed!", description: "You can now log in." });
      router.push('/login');
      return true;
    }
    toast({ title: "Confirmation Failed", description: "Could not find user to confirm.", variant: "destructive" });
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setRegistrationData(null); // Clear any pending registration data on logout
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    // router.push('/'); // Or /login
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, registerStep1, registerStep2, confirmAccount, logout, isLoading, registrationData, setRegistrationData }}>
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

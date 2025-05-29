
"use client";

import type { SimulatedUser } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation'; // Added useParams
import type { Locale } from '@/lib/i1n-config';

interface AuthContextType {
  currentUser: SimulatedUser | null;
  login: (email: string, pass: string) => Promise<boolean>;
  registerStep1: (email: string, pass: string) => Promise<boolean>;
  registerStep2: (firstName: string, lastName: string) => Promise<boolean>;
  confirmAccount: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  registrationData: Partial<SimulatedUser> | null; 
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
  const params = useParams();
  const locale = params.locale as Locale || 'uz'; // Get locale for redirects

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    const storedRegData = localStorage.getItem('scentSationalSimulatedRegData'); // Persist reg data
    if (storedRegData) {
      setRegistrationData(JSON.parse(storedRegData));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { // Persist registration data
    if (registrationData) {
        localStorage.setItem('scentSationalSimulatedRegData', JSON.stringify(registrationData));
    } else {
        localStorage.removeItem('scentSationalSimulatedRegData');
    }
  }, [registrationData]);


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
    await new Promise(resolve => setTimeout(resolve, 500));

    if (user && user.password === pass && user.isConfirmed) { 
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      toast({ title: "Login Successful", description: `Welcome back, ${user.name || user.email}!` });
      setIsLoading(false);
      // router.push(`/${locale}/account`); // Redirect handled by LoginPage useEffect
      return true;
    } else if (user && user.password === pass && !user.isConfirmed) {
      toast({ title: "Login Failed", description: "Account not confirmed. Please complete registration.", variant: "destructive" });
    } else {
      toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
    }
    setIsLoading(false);
    return false;
  };

  const registerStep1 = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    const users = getStoredUsers();
    if (users[email.toLowerCase()]) {
      toast({ title: "Registration Failed", description: "Email already exists.", variant: "destructive" });
      setIsLoading(false);
      return false;
    }
    setRegistrationData({ email: email.toLowerCase(), password: pass, id: Date.now().toString() });
    setIsLoading(false);
    return true;
  };

  const registerStep2 = async (firstName: string, lastName: string): Promise<boolean> => {
    setIsLoading(true);
    if (!registrationData || !registrationData.email || !registrationData.password) {
      toast({ title: "Registration Error", description: "Previous step data missing.", variant: "destructive" });
      setIsLoading(false);
      return false;
    }
    const updatedRegData = { ...registrationData, firstName, lastName, name: `${firstName} ${lastName}`, isRegistered: true, isConfirmed: false };
    setRegistrationData(updatedRegData);
    
    const users = getStoredUsers();
    users[updatedRegData.email!] = updatedRegData as SimulatedUser; 
    saveStoredUsers(users);
    setIsLoading(false);
    return true;
  };
  
  const confirmAccount = async (): Promise<boolean> => {
    setIsLoading(true);
    if (!registrationData || !registrationData.email || !registrationData.isRegistered) {
       toast({ title: "Confirmation Error", description: "No pending registration found or incomplete.", variant: "destructive" });
       setIsLoading(false);
       return false;
    }
    const users = getStoredUsers();
    const userToConfirm = users[registrationData.email];

    if (userToConfirm) {
      userToConfirm.isConfirmed = true;
      users[registrationData.email] = userToConfirm;
      saveStoredUsers(users);
      setRegistrationData(null); 
      localStorage.removeItem('scentSationalSimulatedRegData'); // Clean up
      toast({ title: "Account Confirmed!", description: "You can now log in." });
      router.push(`/${locale}/login`);
      setIsLoading(false);
      return true;
    }
    toast({ title: "Confirmation Failed", description: "Could not find user to confirm.", variant: "destructive" });
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setRegistrationData(null); 
    localStorage.removeItem('scentSationalSimulatedRegData');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push(`/${locale}/`); // Redirect to localized home
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


"use client";

import type { SimulatedUser } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation'; 
import type { Locale } from '@/lib/i1n-config';

// Import main dictionaries
import enMessages from '@/dictionaries/en.json';
import ruMessages from '@/dictionaries/ru.json';
import uzMessages from '@/dictionaries/uz.json';

type Dictionary = typeof enMessages;
type AuthContextToastsDictionary = Dictionary['authContextToasts'];


const dictionaries: Record<Locale, Dictionary> = {
  en: enMessages,
  ru: ruMessages,
  uz: uzMessages,
};

const getAuthContextToastsDictionary = (locale: Locale): AuthContextToastsDictionary => {
  return dictionaries[locale]?.authContextToasts || dictionaries.en.authContextToasts;
};

interface AuthContextType {
  currentUser: SimulatedUser | null;
  login: (email: string, pass: string) => Promise<boolean>;
  registerStep1: (email: string, pass: string, confirmPass: string) => Promise<boolean>;
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
const REG_DATA_STORAGE_KEY = 'scentSationalSimulatedRegData';


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<SimulatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationData, setRegistrationData] = useState<Partial<SimulatedUser> | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale || 'uz'; 
  const dictionary = getAuthContextToastsDictionary(locale);


  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    const storedRegData = localStorage.getItem(REG_DATA_STORAGE_KEY); 
    if (storedRegData) {
      setRegistrationData(JSON.parse(storedRegData));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { 
    if (registrationData) {
        localStorage.setItem(REG_DATA_STORAGE_KEY, JSON.stringify(registrationData));
    } else {
        localStorage.removeItem(REG_DATA_STORAGE_KEY);
    }
  }, [registrationData]);


  const getStoredUsers = (): Record<string, SimulatedUser> => {
    if (typeof window === 'undefined') return {};
    const users = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : {};
  };

  const saveStoredUsers = (users: Record<string, SimulatedUser>) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    const users = getStoredUsers();
    const user = users[email.toLowerCase()];
    await new Promise(resolve => setTimeout(resolve, 500));

    if (user && user.password === pass && user.isConfirmed) { 
      setCurrentUser(user);
      if (typeof window !== 'undefined') localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      toast({ title: dictionary.loginSuccessful, description: dictionary.welcomeBack.replace('{name}', user.name || user.email) });
      setIsLoading(false);
      return true;
    } else if (user && user.password === pass && !user.isConfirmed) {
      toast({ title: dictionary.loginFailed, description: dictionary.accountNotConfirmed, variant: "destructive" });
    } else {
      toast({ title: dictionary.loginFailed, description: dictionary.invalidEmailPassword, variant: "destructive" });
    }
    setIsLoading(false);
    return false;
  };

  const registerStep1 = async (email: string, pass: string, confirmPass: string): Promise<boolean> => {
    setIsLoading(true);
     if (pass !== confirmPass) {
      toast({ title: dictionary.registrationError, description: dictionary.errorPasswordsDontMatch, variant: "destructive" });
      setIsLoading(false);
      return false;
    }
    const users = getStoredUsers();
    if (users[email.toLowerCase()]) {
      toast({ title: dictionary.registrationFailed, description: dictionary.emailExists, variant: "destructive" });
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
      toast({ title: dictionary.registrationError, description: dictionary.prevStepDataMissing, variant: "destructive" });
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
       toast({ title: dictionary.confirmationError, description: dictionary.noPendingReg, variant: "destructive" });
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
      if (typeof window !== 'undefined') localStorage.removeItem(REG_DATA_STORAGE_KEY); 
      toast({ title: dictionary.accountConfirmed, description: dictionary.youCanNowLogin });
      router.push(`/${locale}/login`);
      setIsLoading(false);
      return true;
    }
    toast({ title: dictionary.confirmationError, description: dictionary.confirmFailedUserNotFound, variant: "destructive" });
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setRegistrationData(null); 
    if (typeof window !== 'undefined') localStorage.removeItem(REG_DATA_STORAGE_KEY);
    toast({ title: dictionary.loggedOut, description: dictionary.loggedOutSuccess });
    router.push(`/${locale}/login`); 
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

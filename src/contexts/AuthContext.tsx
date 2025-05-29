
"use client";

import type { SimulatedUser } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation'; 
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

// Placeholder dictionary for AuthContext toasts
const getAuthContextDictionary = (locale: Locale) => {
  // This is a simplified version. In a real app, you might get these from a global i18n provider.
  if (locale === 'uz') {
    return {
      loginSuccessful: "Muvaffaqiyatli kirildi",
      welcomeBack: (name: string) => `Xush kelibsiz, ${name}!`,
      loginFailed: "Kirish muvaffaqiyatsiz",
      accountNotConfirmed: "Hisob tasdiqlanmagan. Ro'yxatdan o'tishni yakunlang.",
      invalidEmailPassword: "Noto'g'ri email yoki parol.",
      registrationFailed: "Ro'yxatdan o'tish muvaffaqiyatsiz",
      emailExists: "Email allaqachon mavjud.",
      registrationError: "Ro'yxatdan o'tishda xatolik",
      prevStepDataMissing: "Oldingi qadam ma'lumotlari yo'q.",
      confirmationError: "Tasdiqlashda xatolik",
      noPendingReg: "Tasdiqlash uchun kutilayotgan ro'yxatdan o'tish topilmadi.",
      confirmFailedUserNotFound: "Tasdiqlash uchun foydalanuvchi topilmadi.",
      accountConfirmed: "Hisob tasdiqlandi!",
      youCanNowLogin: "Endi tizimga kirishingiz mumkin.",
      loggedOut: "Chiqib ketildi",
      loggedOutSuccess: "Siz tizimdan muvaffaqiyatli chiqdingiz."
    };
  }
  if (locale === 'ru') {
    return {
      loginSuccessful: "Вход выполнен",
      welcomeBack: (name: string) => `С возвращением, ${name}!`,
      loginFailed: "Ошибка входа",
      accountNotConfirmed: "Аккаунт не подтвержден. Пожалуйста, завершите регистрацию.",
      invalidEmailPassword: "Неверный email или пароль.",
      registrationFailed: "Ошибка регистрации",
      emailExists: "Email уже существует.",
      registrationError: "Ошибка регистрации",
      prevStepDataMissing: "Отсутствуют данные предыдущего шага.",
      confirmationError: "Ошибка подтверждения",
      noPendingReg: "Ожидающая подтверждения регистрация не найдена.",
      confirmFailedUserNotFound: "Не удалось найти пользователя для подтверждения.",
      accountConfirmed: "Аккаунт подтвержден!",
      youCanNowLogin: "Теперь вы можете войти.",
      loggedOut: "Выход выполнен",
      loggedOutSuccess: "Вы успешно вышли из системы."
    };
  }
  return { // en
    loginSuccessful: "Login Successful",
    welcomeBack: (name: string) => `Welcome back, ${name}!`,
    loginFailed: "Login Failed",
    accountNotConfirmed: "Account not confirmed. Please complete registration.",
    invalidEmailPassword: "Invalid email or password.",
    registrationFailed: "Registration Failed",
    emailExists: "Email already exists.",
    registrationError: "Registration Error",
    prevStepDataMissing: "Previous step data missing.",
    confirmationError: "Confirmation Error",
    noPendingReg: "No pending registration found to confirm.",
    confirmFailedUserNotFound: "Could not find user to confirm.",
    accountConfirmed: "Account Confirmed!",
    youCanNowLogin: "You can now log in.",
    loggedOut: "Logged Out",
    loggedOutSuccess: "You have been successfully logged out."
  };
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<SimulatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationData, setRegistrationData] = useState<Partial<SimulatedUser> | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale || 'uz'; 
  const dictionary = getAuthContextDictionary(locale);


  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    const storedRegData = localStorage.getItem('scentSationalSimulatedRegData'); 
    if (storedRegData) {
      setRegistrationData(JSON.parse(storedRegData));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { 
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
      toast({ title: dictionary.loginSuccessful, description: dictionary.welcomeBack(user.name || user.email) });
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

  const registerStep1 = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
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
      localStorage.removeItem('scentSationalSimulatedRegData'); 
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
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setRegistrationData(null); 
    localStorage.removeItem('scentSationalSimulatedRegData');
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

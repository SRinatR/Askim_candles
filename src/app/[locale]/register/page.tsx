
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; // Not used by FormField
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation"; // Added useParams
import Link from "next/link";
import { Mail, KeyRound, User as UserIcon, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import type { Locale } from '@/lib/i1n-config';

// Placeholder dictionary
const getRegisterDictionary = (locale: Locale) => {
  if (locale === 'uz') {
    return {
      createAccountTitle: "Hisob Yaratish",
      createAccountDesc: "Bugunoq ScentSational Showcase'ga qo'shiling!",
      step: (current: number, total: number) => `Qadam ${current} / ${total}`,
      emailLabel: "Elektron pochta manzili",
      emailPlaceholder: "siz@misol.com",
      passwordLabel: "Parol",
      passwordCreatePlaceholder: "Parol yarating",
      confirmPasswordLabel: "Parolni tasdiqlang",
      confirmPasswordPlaceholder: "Parolingizni tasdiqlang",
      nextDetailsButton: "Keyingisi: Ma'lumotlaringiz",
      firstNameLabel: "Ism",
      firstNamePlaceholder: "Ismingiz",
      lastNameLabel: "Familiya",
      lastNamePlaceholder: "Familiyangiz",
      nextConfirmButton: "Keyingisi: Tasdiqlash",
      backButton: "Orqaga",
      almostThereTitle: "Deyarli Tayyor!",
      confirmAccountInstruction: "Ro'yxatdan o'tishingiz deyarli yakunlandi. Demo maqsadida, hisobingizni tasdiqlash uchun quyidagi tugmani bosing. Haqiqiy ilovada sizga tasdiqlash xati yuboriladi.",
      registeredEmailLabel: "Ro'yxatdan o'tgan email:",
      confirmAccountButton: "Hisobni Tasdiqlash",
      processingButton: "Qayta ishlanmoqda...",
      confirmingButton: "Tasdiqlanmoqda...",
      errorPasswordsDontMatch: "Parollar mos kelmadi.",
      errorEmailExists: "Email allaqachon mavjud.",
      errorRegDataMissing: "Oldingi qadam ma'lumotlari yetishmayapti.",
      errorNoPendingReg: "Tasdiqlash uchun kutilayotgan ro'yxatdan o'tish topilmadi yoki ro'yxatdan o'tish tugallanmagan.",
      errorCouldNotFindUser: "Tasdiqlash uchun foydalanuvchi topilmadi.",
      accountConfirmedTitle: "Hisob Tasdiqlandi!",
      accountConfirmedDesc: "Endi tizimga kirishingiz mumkin.",
      alreadyHaveAccount: "Hisobingiz bormi?",
      signInLink: "Kirish",
    };
  }
  if (locale === 'ru') {
    return {
      createAccountTitle: "Создать аккаунт",
      createAccountDesc: "Присоединяйтесь к ScentSational Showcase уже сегодня!",
      step: (current: number, total: number) => `Шаг ${current} из ${total}`,
      emailLabel: "Адрес электронной почты",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Пароль",
      passwordCreatePlaceholder: "Создайте пароль",
      confirmPasswordLabel: "Подтвердите пароль",
      confirmPasswordPlaceholder: "Подтвердите ваш пароль",
      nextDetailsButton: "Далее: Ваши данные",
      firstNameLabel: "Имя",
      firstNamePlaceholder: "Ваше имя",
      lastNameLabel: "Фамилия",
      lastNamePlaceholder: "Ваша фамилия",
      nextConfirmButton: "Далее: Подтверждение",
      backButton: "Назад",
      almostThereTitle: "Почти готово!",
      confirmAccountInstruction: "Ваша регистрация почти завершена. В демонстрационных целях, нажмите кнопку ниже, чтобы подтвердить свой аккаунт. В реальном приложении вам будет отправлено письмо с подтверждением.",
      registeredEmailLabel: "Зарегистрированный email:",
      confirmAccountButton: "Подтвердить аккаунт",
      processingButton: "Обработка...",
      confirmingButton: "Подтверждение...",
      errorPasswordsDontMatch: "Пароли не совпадают.",
      errorEmailExists: "Email уже существует.",
      errorRegDataMissing: "Отсутствуют данные предыдущего шага.",
      errorNoPendingReg: "Ожидающая подтверждения регистрация не найдена или регистрация не завершена.",
      errorCouldNotFindUser: "Не удалось найти пользователя для подтверждения.",
      accountConfirmedTitle: "Аккаунт подтвержден!",
      accountConfirmedDesc: "Теперь вы можете войти.",
      alreadyHaveAccount: "Уже есть аккаунт?",
      signInLink: "Войти",
    };
  }
  return { // en
    createAccountTitle: "Create an Account",
    createAccountDesc: "Join ScentSational Showcase today!",
    step: (current: number, total: number) => `Step ${current} of ${total}`,
    emailLabel: "Email Address",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordCreatePlaceholder: "Create a password",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm your password",
    nextDetailsButton: "Next: Your Details",
    firstNameLabel: "First Name",
    firstNamePlaceholder: "Your first name",
    lastNameLabel: "Last Name",
    lastNamePlaceholder: "Your last name",
    nextConfirmButton: "Next: Confirm",
    backButton: "Back",
    almostThereTitle: "Almost There!",
    confirmAccountInstruction: "Your registration is nearly complete. For demo purposes, click the button below to confirm your account. In a real application, you would receive a confirmation email.",
    registeredEmailLabel: "Registered email:",
    confirmAccountButton: "Confirm Account",
    processingButton: "Processing...",
    confirmingButton: "Confirming...",
    errorPasswordsDontMatch: "Passwords do not match.",
    errorEmailExists: "Email already exists.",
    errorRegDataMissing: "Previous step data missing.",
    errorNoPendingReg: "No pending registration found to confirm or registration incomplete.",
    errorCouldNotFindUser: "Could not find user to confirm.",
    accountConfirmedTitle: "Account Confirmed!",
    accountConfirmedDesc: "You can now log in.",
    alreadyHaveAccount: "Already have an account?",
    signInLink: "Sign In",
  };
};


export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale || 'uz';
  const dictionary = getRegisterDictionary(locale);

  const { registerStep1, registerStep2, confirmAccount, isLoading, registrationData } = useAuth();
  const [currentStep, setCurrentStep] = useState(registrationData?.isRegistered && !registrationData?.isConfirmed ? 3 : (registrationData?.email ? 2 : 1));

  const [email, setEmail] = useState(registrationData?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstName, setFirstName] = useState(registrationData?.firstName || "");
  const [lastName, setLastName] = useState(registrationData?.lastName || "");
  
  const totalSteps = 3;
  const progressValue = (currentStep / totalSteps) * 100;

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: dictionary.errorPasswordsDontMatch, variant: "destructive" });
      return;
    }
    const success = await registerStep1(email, password); // AuthContext shows its own toasts
    if (success) {
      setCurrentStep(2);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await registerStep2(firstName, lastName); // AuthContext shows its own toasts
    if (success) {
      setCurrentStep(3);
    }
  };
  
  const handleConfirm = async () => {
    await confirmAccount(); // AuthContext shows toasts and redirects
  };

  const goBack = () => {
    if(currentStep === 2) {
        setPassword("");
        setConfirmPassword("");
    }
    if(currentStep > 1) setCurrentStep(currentStep - 1);
  }


  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{dictionary.createAccountTitle}</CardTitle>
          <CardDescription>{dictionary.createAccountDesc}</CardDescription>
           <Progress value={progressValue} className="w-full mt-2" />
           <p className="text-sm text-muted-foreground mt-1">{dictionary.step(currentStep, totalSteps)}</p>
        </CardHeader>

        <CardContent>
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label htmlFor="email-register" className="block text-sm font-medium text-foreground mb-1">{dictionary.emailLabel}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email-register" type="email" placeholder={dictionary.emailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div>
                <label htmlFor="password-register" className="block text-sm font-medium text-foreground mb-1">{dictionary.passwordLabel}</label>
                 <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password-register" type="password" placeholder={dictionary.passwordCreatePlaceholder} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="pl-10" />
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password-register" className="block text-sm font-medium text-foreground mb-1">{dictionary.confirmPasswordLabel}</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="confirm-password-register" type="password" placeholder={dictionary.confirmPasswordPlaceholder} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? dictionary.processingButton : dictionary.nextDetailsButton} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">{dictionary.firstNameLabel}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="firstName" type="text" placeholder={dictionary.firstNamePlaceholder} value={firstName} onChange={e => setFirstName(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">{dictionary.lastNameLabel}</label>
                 <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="lastName" type="text" placeholder={dictionary.lastNamePlaceholder} value={lastName} onChange={e => setLastName(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={goBack} className="w-1/2" disabled={isLoading}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> {dictionary.backButton}
                </Button>
                <Button type="submit" className="w-1/2" disabled={isLoading}>
                  {isLoading ? dictionary.processingButton : dictionary.nextConfirmButton} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
          
          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="text-xl font-semibold">{dictionary.almostThereTitle}</h3>
              <p className="text-muted-foreground">
                {dictionary.confirmAccountInstruction}
              </p>
              <p className="text-sm text-muted-foreground">{dictionary.registeredEmailLabel} <strong>{registrationData?.email}</strong></p>
               <div className="flex space-x-2 pt-2">
                 <Button type="button" variant="outline" onClick={goBack} className="w-1/2" disabled={isLoading}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> {dictionary.backButton}
                 </Button>
                <Button onClick={handleConfirm} className="w-1/2" disabled={isLoading}>
                  {isLoading ? dictionary.confirmingButton : dictionary.confirmAccountButton}
                </Button>
              </div>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 text-sm">
          <p>
            {dictionary.alreadyHaveAccount}{" "}
            <Link href={`/${locale}/login`} className="font-medium text-primary hover:underline">
              {dictionary.signInLink}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

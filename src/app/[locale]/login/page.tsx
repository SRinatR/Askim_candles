
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams, useParams } from "next/navigation"; 
import { Logo } from "@/components/icons/Logo";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Chrome, Send, Globe, Mail, KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; 
import type { Locale } from '@/lib/i1n-config';

// Placeholder dictionary
const getLoginDictionary = (locale: Locale) => {
  if (locale === 'uz') {
    return {
      signInTitle: "Kirish",
      signInDesc: "ScentSational Showcase hisobingizga kiring.",
      emailLabel: "Elektron pochta manzili",
      emailPlaceholder: "siz@misol.com",
      passwordLabel: "Parol",
      passwordPlaceholder: "••••••••",
      signInWithEmailButton: "Email bilan kirish",
      signingInButton: "Kirilmoqda...",
      orContinueWith: "Yoki quyidagilar bilan davom eting",
      signInWithGoogle: "Google bilan kirish",
      signInWithTelegram: "Telegram bilan kirish",
      signInWithYandex: "Yandex bilan kirish",
      processingButton: "Qayta ishlanmoqda...",
      dontHaveAccount: "Hisobingiz yo'qmi?",
      signUpLink: "Ro'yxatdan o'tish",
      termsAgree: "Kirish orqali siz bizning Foydalanish shartlari va Maxfiylik siyosatimizga rozilik bildirasiz.",
      loginFailedTitle: "Kirish muvaffaqiyatsiz",
      loginFailedDescGeneric: "Sizni tizimga kirita olmadik. Iltimos, qaytadan urinib ko'ring.",
      accountNotConfirmedDesc: "Hisobingiz tasdiqlanmagan. Iltimos, ro'yxatdan o'tishni yakunlang yoki tasdiqlash xatini tekshiring.",
      loginComingSoonTitle: "Tez kunda!",
      loginComingSoonDesc: (provider: string) => `${provider} orqali kirish hozircha mavjud emas.`,
      loading: "Yuklanmoqda...",
    };
  }
   if (locale === 'ru') {
    return {
      signInTitle: "Вход",
      signInDesc: "Войдите в свой аккаунт ScentSational Showcase.",
      emailLabel: "Адрес электронной почты",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Пароль",
      passwordPlaceholder: "••••••••",
      signInWithEmailButton: "Войти с Email",
      signingInButton: "Вход...",
      orContinueWith: "Или продолжить с помощью",
      signInWithGoogle: "Войти через Google",
      signInWithTelegram: "Войти через Telegram",
      signInWithYandex: "Войти через Yandex",
      processingButton: "Обработка...",
      dontHaveAccount: "Нет аккаунта?",
      signUpLink: "Зарегистрироваться",
      termsAgree: "Входя в систему, вы соглашаетесь с нашими Условиями обслуживания и Политикой конфиденциальности.",
      loginFailedTitle: "Ошибка входа",
      loginFailedDescGeneric: "Не удалось войти. Пожалуйста, попробуйте еще раз.",
      accountNotConfirmedDesc: "Аккаунт не подтвержден. Пожалуйста, завершите регистрацию или проверьте письмо с подтверждением.",
      loginComingSoonTitle: "Скоро!",
      loginComingSoonDesc: (provider: string) => `Вход через ${provider} пока недоступен.`,
      loading: "Загрузка...",
    };
  }
  return { // en
    signInTitle: "Sign In",
    signInDesc: "Access your ScentSational Showcase account.",
    emailLabel: "Email Address",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    signInWithEmailButton: "Sign In with Email",
    signingInButton: "Signing In...",
    orContinueWith: "Or continue with",
    signInWithGoogle: "Sign in with Google",
    signInWithTelegram: "Sign in with Telegram",
    signInWithYandex: "Sign in with Yandex",
    processingButton: "Processing...",
    dontHaveAccount: "Don't have an account?",
    signUpLink: "Sign Up",
    termsAgree: "By signing in, you agree to our Terms of Service and Privacy Policy.",
    loginFailedTitle: "Login Failed",
    loginFailedDescGeneric: "Could not sign you in. Please try again.",
    accountNotConfirmedDesc: "Account not confirmed. Please complete registration or check your confirmation email.",
    loginComingSoonTitle: "Coming Soon!",
    loginComingSoonDesc: (provider: string) => `Sign in with ${provider} is not yet available.`,
    loading: "Loading...",
  };
};


export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams(); 
  const locale = routeParams.locale as Locale || 'uz';
  const dictionary = getLoginDictionary(locale);

  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const { login: simulatedLogin, currentUser: simulatedUser, isLoading: isLoadingSimulatedAuth } = useAuth(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmittingSocial, setIsSubmittingSocial] = React.useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || `/${locale}/account`;

  useEffect(() => {
    if (nextAuthStatus === "authenticated" || simulatedUser) {
      router.push(callbackUrl); 
    }
  }, [nextAuthStatus, simulatedUser, router, callbackUrl]);

  const handleSocialSignIn = async (provider: string) => {
    setIsSubmittingSocial(provider);
    try {
      if (provider !== "google") { 
        toast({
          title: dictionary.loginComingSoonTitle,
          description: dictionary.loginComingSoonDesc(provider.charAt(0).toUpperCase() + provider.slice(1)),
        });
        setIsSubmittingSocial("");
        return;
      }
      const result = await signIn(provider, { callbackUrl });
      if (result?.error) {
        toast({
          title: dictionary.loginFailedTitle,
          description: result.error || dictionary.loginFailedDescGeneric,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Sign in error", error);
      toast({
        title: dictionary.loginFailedTitle,
        description: dictionary.loginFailedDescGeneric,
        variant: "destructive",
      });
    } finally {
      setIsSubmittingSocial("");
    }
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingEmail(true);
    await simulatedLogin(email, password); 
    setIsSubmittingEmail(false);
  };
  
  if (nextAuthStatus === "loading" || isLoadingSimulatedAuth || nextAuthSession || simulatedUser) {
    return <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center"><p>{dictionary.loading}</p></div>;
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <Link href={`/${locale}/`} className="inline-block mx-auto mb-4">
            <Logo />
          </Link>
          <CardTitle className="text-2xl font-bold">{dictionary.signInTitle}</CardTitle>
          <CardDescription>{dictionary.signInDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">{dictionary.emailLabel}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder={dictionary.emailPlaceholder} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password-login" className="block text-sm font-medium text-foreground mb-1">{dictionary.passwordLabel}</label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password-login" 
                  type="password" 
                  placeholder={dictionary.passwordPlaceholder} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmittingEmail || isLoadingSimulatedAuth}>
              {isSubmittingEmail ? dictionary.signingInButton : dictionary.signInWithEmailButton}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {dictionary.orContinueWith}
              </span>
            </div>
          </div>
          
          <Button 
            onClick={() => handleSocialSignIn("google")} 
            className="w-full" 
            disabled={!!isSubmittingSocial || isSubmittingEmail}
            variant="outline"
          >
            <Chrome className="mr-2 h-5 w-5" /> 
            {isSubmittingSocial === "google" ? dictionary.signingInButton : dictionary.signInWithGoogle}
          </Button>
           <Button 
            onClick={() => handleSocialSignIn("telegram")} 
            className="w-full" 
            disabled={!!isSubmittingSocial || isSubmittingEmail}
            variant="outline"
          >
            <Send className="mr-2 h-5 w-5" /> 
            {isSubmittingSocial === "telegram" ? dictionary.processingButton : dictionary.signInWithTelegram}
          </Button>
          <Button 
            onClick={() => handleSocialSignIn("yandex")} 
            className="w-full" 
            disabled={!!isSubmittingSocial || isSubmittingEmail}
            variant="outline"
          >
            <Globe className="mr-2 h-5 w-5" /> 
            {isSubmittingSocial === "yandex" ? dictionary.processingButton : dictionary.signInWithYandex}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3 text-sm">
           <p>
            {dictionary.dontHaveAccount}{" "}
            <Link href={`/${locale}/register`} className="font-medium text-primary hover:underline">
              {dictionary.signUpLink}
            </Link>
          </p>
          <p className="text-muted-foreground text-xs px-4 text-center">
            {dictionary.termsAgree}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

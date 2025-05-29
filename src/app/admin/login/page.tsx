
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Keep Label as it's used here
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/icons/Logo";
import React, { useState, useEffect } from "react";
import { Mail, KeyRound, ShieldAlert } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import type { AdminLocale } from "@/admin/lib/i18n-config-admin";
import { i18nAdmin } from "@/admin/lib/i18n-config-admin";
import { getAdminDictionary } from "@/admin/lib/getAdminDictionary";
import type enAdminMessages from '@/admin/dictionaries/en.json';

type AdminLoginDictionary = typeof enAdminMessages.adminLoginPage;

export default function AdminLoginPage() {
  const { login, isLoading, currentAdminUser } = useAdminAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dict, setDict] = useState<AdminLoginDictionary | null>(null);
  
  useEffect(() => {
    async function loadDictionary() {
      // For login page, default to English or detect browser preference if desired
      // For simplicity, using default admin locale
      const localeToLoad = i18nAdmin.defaultLocale; 
      const fullDict = await getAdminDictionary(localeToLoad);
      setDict(fullDict.adminLoginPage);
    }
    loadDictionary();

    if (currentAdminUser) {
      router.replace('/admin/dashboard');
    }
  }, [currentAdminUser, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dict) return; // Dictionary not loaded yet

    if (!email || !password) {
        toast({ title: dict.loginErrorTitle, description: dict.loginErrorDescRequired, variant: "destructive" });
        return;
    }
    const success = await login(email, password); // login function in AdminAuthContext handles its own toasts
    if (success) {
      // router.push will be handled by AdminAuthContext after successful login
    }
  };
  
  if (isLoading || currentAdminUser || !dict) {
    return <div className="flex min-h-screen items-center justify-center bg-muted"><p>{dict?.loading || "Loading admin panel..."}</p></div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4 text-foreground">
      <Card className="w-full max-w-md shadow-xl bg-card text-card-foreground">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="inline-block mx-auto mb-2">
            <Logo />
          </Link>
          <div className="flex items-center justify-center text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-6 w-6 mr-2" />
            <CardTitle className="text-2xl font-bold">{dict.title}</CardTitle>
          </div>
          <CardDescription>{dict.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">{dict.emailLabel}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder={dict.emailPlaceholder}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">{dict.passwordLabel}</Label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder={dict.passwordPlaceholder}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? dict.signingInButton : dict.signInButton}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
            <p className="text-xs text-muted-foreground">
                {dict.restrictedAccess}
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

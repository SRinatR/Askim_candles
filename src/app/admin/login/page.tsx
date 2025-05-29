
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/icons/Logo";
import React, { useState, useEffect } from "react";
import { Mail, KeyRound, ShieldAlert } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function AdminLoginPage() {
  const { login, isLoading, currentAdminUser } = useAdminAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  useEffect(() => {
    if (currentAdminUser) {
      router.replace('/admin/dashboard');
    }
  }, [currentAdminUser, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        toast({ title: "Login Error", description: "Email and password are required.", variant: "destructive" });
        return;
    }
    await login(email, password);
  };
  
  if (isLoading || currentAdminUser) { // Prevent flicker if already logged in and redirecting
    return <div className="flex min-h-screen items-center justify-center bg-muted"><p>Loading admin panel...</p></div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="inline-block mx-auto mb-2">
            <Logo />
          </Link>
          <div className="flex items-center justify-center text-amber-600">
            <ShieldAlert className="h-6 w-6 mr-2" />
            <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
          </div>
          <CardDescription>Please sign in to manage ScentSational Showcase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
            <p className="text-xs text-muted-foreground">
                Access to this panel is restricted to authorized personnel only.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}


"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/icons/Logo";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Chrome, Send, Globe, Mail, KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // For email/password

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: nextAuthSession, status: nextAuthStatus } = useSession(); // NextAuth session
  const { login: simulatedLogin, currentUser: simulatedUser, isLoading: isLoadingSimulatedAuth } = useAuth(); // Simulated Auth

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmittingSocial, setIsSubmittingSocial] = React.useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  useEffect(() => {
    if (nextAuthStatus === "authenticated" || simulatedUser) {
      router.replace(callbackUrl);
    }
  }, [nextAuthStatus, simulatedUser, router, callbackUrl]);

  const handleSocialSignIn = async (provider: string) => {
    setIsSubmittingSocial(provider);
    try {
      if (provider !== "google") { // Only Google is fully configured for NextAuth
        toast({
          title: "Coming Soon!",
          description: `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)} is not yet available.`,
        });
        setIsSubmittingSocial("");
        return;
      }
      const result = await signIn(provider, { callbackUrl });
      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result.error || "Could not sign you in. Please try again.",
          variant: "destructive",
        });
      }
      // Successful NextAuth sign-in will trigger the useEffect to redirect
    } catch (error) {
      console.error("Sign in error", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred during social sign-in.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingSocial("");
    }
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingEmail(true);
    const success = await simulatedLogin(email, password);
    if (success) {
      // useEffect will handle redirect
    }
    setIsSubmittingEmail(false);
  };
  
  if (nextAuthStatus === "loading" || isLoadingSimulatedAuth || nextAuthSession || simulatedUser) {
    return <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="inline-block mx-auto mb-4">
            <Logo />
          </Link>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Access your ScentSational Showcase account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="pl-10"
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
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmittingEmail || isLoadingSimulatedAuth}>
              {isSubmittingEmail ? "Signing In..." : "Sign In with Email"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
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
            {isSubmittingSocial === "google" ? "Signing in..." : "Sign in with Google"}
          </Button>
           <Button 
            onClick={() => handleSocialSignIn("telegram")} 
            className="w-full" 
            disabled={!!isSubmittingSocial || isSubmittingEmail}
            variant="outline"
          >
            <Send className="mr-2 h-5 w-5" /> 
            {isSubmittingSocial === "telegram" ? "Processing..." : "Sign in with Telegram"}
          </Button>
          <Button 
            onClick={() => handleSocialSignIn("yandex")} 
            className="w-full" 
            disabled={!!isSubmittingSocial || isSubmittingEmail}
            variant="outline"
          >
            <Globe className="mr-2 h-5 w-5" /> 
            {isSubmittingSocial === "yandex" ? "Processing..." : "Sign in with Yandex"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3 text-sm">
           <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="text-muted-foreground text-xs px-4 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

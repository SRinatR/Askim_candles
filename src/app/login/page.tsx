
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/icons/Logo";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { Chrome, Send, Globe } from "lucide-react"; // Using Chrome for Google, Send for Telegram, Globe for Yandex

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = React.useState(""); // Store which provider is submitting

  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSignIn = async (provider: string) => {
    setIsSubmitting(provider);
    try {
      // For now, Telegram and Yandex are UI only.
      if (provider !== "google") {
        toast({
          title: "Coming Soon!",
          description: `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)} is not yet available.`,
        });
        setIsSubmitting("");
        return;
      }
      const result = await signIn(provider, { callbackUrl });
      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result.error || "Could not sign you in. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting("");
      } else if (result?.ok) {
        // Successful sign-in will trigger the useEffect to redirect
      }
    } catch (error) {
      console.error("Sign in error", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsSubmitting("");
    }
  };
  
  if (status === "loading" || status === "authenticated") {
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
          <CardDescription>Choose a provider to sign in to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => handleSignIn("google")} 
            className="w-full" 
            disabled={!!isSubmitting}
            variant="outline"
          >
            <Chrome className="mr-2 h-5 w-5" /> 
            {isSubmitting === "google" ? "Signing in..." : "Sign in with Google"}
          </Button>
           <Button 
            onClick={() => handleSignIn("telegram")} 
            className="w-full" 
            disabled={!!isSubmitting}
            variant="outline"
          >
            <Send className="mr-2 h-5 w-5" /> 
            {isSubmitting === "telegram" ? "Processing..." : "Sign in with Telegram"}
          </Button>
          <Button 
            onClick={() => handleSignIn("yandex")} 
            className="w-full" 
            disabled={!!isSubmitting}
            variant="outline"
          >
            <Globe className="mr-2 h-5 w-5" /> 
            {isSubmitting === "yandex" ? "Processing..." : "Sign in with Yandex"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 text-sm">
          <p className="text-muted-foreground text-xs px-4 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

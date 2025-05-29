
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/icons/Logo";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { Chrome } from "lucide-react"; // Using Chrome icon for Google

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSignIn = async (provider: string) => {
    setIsSubmitting(true);
    try {
      const result = await signIn(provider, { callbackUrl });
      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result.error || "Could not sign you in. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      } else if (result?.ok) {
        // Successful sign-in will trigger the useEffect to redirect
        // No need to show toast here as user will be redirected
      }
    } catch (error) {
      console.error("Sign in error", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsSubmitting(false);
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
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
            disabled={isSubmitting}
            variant="outline"
          >
            <Chrome className="mr-2 h-5 w-5" /> 
            {isSubmitting ? "Signing in..." : "Sign in with Google"}
          </Button>
          {/* Add other providers like Telegram here when ready */}
          {/* <Button 
            onClick={() => handleSignIn("telegram")} 
            className="w-full" 
            disabled={isSubmitting}
            variant="outline"
          >
            <Send className="mr-2 h-5 w-5" /> {}
            {isSubmitting ? "Signing in..." : "Sign in with Telegram"}
          </Button> */}
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

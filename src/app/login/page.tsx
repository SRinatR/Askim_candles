
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/icons/Logo";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import React from "react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Min 1 for mock
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { login, currentUser, loading } = useAuth(); // Get login function from AuthContext
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  React.useEffect(() => {
    if (!loading && currentUser) {
      router.replace('/account');
    }
  }, [currentUser, loading, router]);


  async function onSubmit(data: LoginFormValues) {
    setIsSubmitting(true);
    try {
      // For MVP, password is not checked, any name can be used for mock user
      await login(data.email, "Logged In User"); 
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/account");
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login Failed",
        description: "Invalid credentials or server error.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }
  
  if (loading || (!loading && currentUser)) {
    return <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center"><p>Loading...</p></div>;
  }


  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="inline-block mx-auto mb-4">
            <Logo />
          </Link>
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 text-sm">
           <Link href="#" passHref> {/* Assuming forgot password is not implemented for MVP */}
             <Button variant="link" className="text-muted-foreground hover:text-primary p-0 h-auto">Forgot password?</Button>
           </Link>
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" passHref>
               <Button variant="link" className="text-primary hover:underline p-0 h-auto">Sign up</Button>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

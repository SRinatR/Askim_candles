
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, KeyRound, User as UserIcon, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { registerStep1, registerStep2, confirmAccount, isLoading, registrationData, setRegistrationData } = useAuth();
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
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    const success = await registerStep1(email, password);
    if (success) {
      setCurrentStep(2);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await registerStep2(firstName, lastName);
    if (success) {
      setCurrentStep(3);
    }
  };
  
  const handleConfirm = async () => {
    await confirmAccount();
    // AuthContext's confirmAccount will redirect to /login on success
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
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Join ScentSational Showcase today!</CardDescription>
           <Progress value={progressValue} className="w-full mt-2" />
           <p className="text-sm text-muted-foreground mt-1">Step {currentStep} of {totalSteps}</p>
        </CardHeader>

        <CardContent>
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <Label htmlFor="email-register">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email-register" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="password-register">Password</Label>
                 <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password-register" type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="confirm-password-register">Confirm Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="confirm-password-register" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Next: Your Details"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="firstName" type="text" placeholder="Your first name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                 <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="lastName" type="text" placeholder="Your last name" value={lastName} onChange={e => setLastName(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={goBack} className="w-1/2" disabled={isLoading}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit" className="w-1/2" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Next: Confirm"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
          
          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="text-xl font-semibold">Almost There!</h3>
              <p className="text-muted-foreground">
                Your registration is nearly complete. For demo purposes, click the button below to confirm your account.
                In a real application, you would receive a confirmation email.
              </p>
              <p className="text-sm text-muted-foreground">Registered email: <strong>{registrationData?.email}</strong></p>
               <div className="flex space-x-2 pt-2">
                 <Button type="button" variant="outline" onClick={goBack} className="w-1/2" disabled={isLoading}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                 </Button>
                <Button onClick={handleConfirm} className="w-1/2" disabled={isLoading}>
                  {isLoading ? "Confirming..." : "Confirm Account"}
                </Button>
              </div>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 text-sm">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

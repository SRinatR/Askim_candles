
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import React, { useEffect } from 'react';

// TODO: Localize texts when admin i18n is fully implemented

const managerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type ManagerFormValues = z.infer<typeof managerSchema>;

export default function NewManagerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { isAdmin, addManager } = useAdminAuth(); // Assuming addManager is exposed

  const form = useForm<ManagerFormValues>({
    resolver: zodResolver(managerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/admin/dashboard');
    }
  }, [isAdmin, router]);


  const onSubmit = async (data: ManagerFormValues) => {
    const success = await addManager(data.name, data.email, data.password);
    if (success) {
        toast({
            title: "Manager Added (Simulated)",
            description: `${data.name} has been 'added' as a manager. This change is client-side (localStorage).`,
        });
        router.push("/admin/users");
    } else {
        // Toast for failure (e.g. email exists) will be handled by addManager in context
    }
  };
  
  if (!isAdmin) {
      return <div className="flex justify-center items-center min-h-[300px]"><p>Access Denied. Redirecting...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Manager</h1>
            <p className="text-muted-foreground">Create a new manager account.</p>
        </div>
        <Button variant="outline" asChild>
            <Link href="/admin/users">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to User Management
            </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Manager Account Details</CardTitle>
            <CardDescription>Fill in the information for the new manager.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} placeholder="e.g., Jane Doe" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email")} placeholder="manager@example.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} placeholder="••••••••" />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <UserPlus className="mr-2 h-4 w-4" /> 
            {form.formState.isSubmitting ? "Adding..." : "Add Manager (Simulated)"}
          </Button>
        </div>
      </form>
      <p className="text-sm text-muted-foreground text-center pt-4">
          Note: Manager creation is simulated using localStorage and will persist only for this browser session.
        </p>
    </div>
  );
}

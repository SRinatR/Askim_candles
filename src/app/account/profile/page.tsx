
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Edit3 } from "lucide-react";
import React, { useEffect } from "react";

// This schema is for local updates if needed, NextAuth session might not be directly updatable client-side for all fields
const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(), // Phone is not part of standard NextAuth session user, handle accordingly
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const { data: session, status, update: updateSession } = useSession(); // updateSession can be used if you configure writable session fields

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "", // Phone is not typically in session.user from providers. This would need custom backend logic to store/retrieve.
      });
    }
  }, [session, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!session?.user) {
      toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
      return;
    }
    console.log("Profile data to update (client-side only for now):", data);
    
    // Note: Updating NextAuth session directly from client for arbitrary fields like 'name' or 'phone'
    // usually requires a backend call to update the user record in your database,
    // and then potentially triggering a session update.
    // The `updateSession()` function can update the session cookie if your backend strategy supports it.
    // For this MVP, we'll just show a success toast for name/email changes. Phone requires DB.

    // Example of how you might try to update session (if `name` is a field your JWT/session callback allows updating)
    // await updateSession({ user: { ...session.user, name: data.name } });

    toast({
      title: "Profile " + (data.name !== session.user.name || data.email !== session.user.email ? "Changes Noted" : "Information"),
      description: (data.name !== session.user.name || data.email !== session.user.email ? "Name/email updates would typically require backend interaction." : "Phone number field is for demonstration.") + " For a full update, backend integration is needed.",
    });
  }
  
  if (status === "loading") {
    return <div className="flex justify-center items-center p-10"><p>Loading profile...</p></div>;
  }

  if (status === "unauthenticated") {
    // This case should ideally be handled by AccountLayout redirecting to login
    return <div className="flex justify-center items-center p-10"><p>Please log in to view your profile.</p></div>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Profile Information</CardTitle>
        <CardDescription>View and update your personal details. Email is managed by your login provider.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground pt-1">Email is managed by your identity provider and cannot be changed here.</p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} placeholder="e.g., +1 555-123-4567" />
                  </FormControl>
                  <FormMessage />
                   <p className="text-xs text-muted-foreground pt-1">Storing phone numbers requires backend database integration.</p>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90">
              <Edit3 className="mr-2 h-4 w-4" /> Save Changes (Client Demo)
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

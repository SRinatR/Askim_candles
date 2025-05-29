
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Label might not be needed if using FormLabel
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { Edit3 } from "lucide-react";
import React, { useEffect } from "react";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const { currentUser, loading: authLoading, login: updateUserProfile } = useAuth(); // Assuming login can also update user details for MVP

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name || "",
        email: currentUser.email,
        phone: currentUser.phone || "", // Assuming User type might have phone
      });
    }
  }, [currentUser, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!currentUser) {
      toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
      return;
    }
    console.log("Profile data:", data);
    // Mock update logic: Re-use login function to update user in localStorage for MVP
    try {
      await updateUserProfile(data.email, data.name); // This will update the user in AuthContext and localStorage
       // Optionally add phone to the user object if your User type supports it
      // const updatedUser = { ...currentUser, name: data.name, email: data.email, phone: data.phone };
      // localStorage.setItem('scentSationalUser', JSON.stringify(updatedUser));
      // Manually trigger a state update in AuthContext if login doesn't cover all fields or if you want more granular control
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error) {
       toast({
        title: "Update Failed",
        description: "Could not update your profile.",
        variant: "destructive",
      });
    }
  }
  
  if (authLoading) {
    return <div className="flex justify-center items-center p-10"><p>Loading profile...</p></div>;
  }

  if (!currentUser && !authLoading) {
     // This case should ideally be handled by AccountLayout redirecting to login
    return <div className="flex justify-center items-center p-10"><p>Please log in to view your profile.</p></div>;
  }


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Profile Information</CardTitle>
        <CardDescription>View and update your personal details.</CardDescription>
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
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90">
              <Edit3 className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

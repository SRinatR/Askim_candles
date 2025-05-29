
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react"; // For NextAuth
import { useAuth as useSimulatedAuth } from "@/contexts/AuthContext"; // For simulated Auth
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
  const { data: nextAuthSession, status: nextAuthStatus, update: updateNextAuthSession } = useSession();
  const { currentUser: simulatedUser, isLoading: isLoadingSimulatedAuth } = useSimulatedAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    let name = "";
    let email = "";

    if (nextAuthSession?.user) {
      name = nextAuthSession.user.name || "";
      email = nextAuthSession.user.email || "";
    } else if (simulatedUser) {
      name = simulatedUser.name || "";
      email = simulatedUser.email || "";
      // Phone might be part of simulatedUser if we add it during registration
    }
    
    form.reset({
      name,
      email,
      phone: "", // Phone is not typically in session.user from providers. This would need custom backend logic or client-side state from simulated auth.
    });
  }, [nextAuthSession, simulatedUser, form]);

  async function onSubmit(data: ProfileFormValues) {
    const currentEmail = nextAuthSession?.user?.email || simulatedUser?.email;
    const currentName = nextAuthSession?.user?.name || simulatedUser?.name;

    if (!currentEmail) {
      toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
      return;
    }
    console.log("Profile data to update:", data);
    
    let updateMessage = "Profile information noted. ";
    if (data.name !== currentName) {
       updateMessage += "Name update would typically require backend interaction. ";
       // For NextAuth, if name is updatable: await updateNextAuthSession({ user: { ...nextAuthSession.user, name: data.name } });
       // For simulated auth, update would happen in AuthContext and localStorage if implemented.
    }
    if (data.email !== currentEmail) {
        updateMessage += "Email for social logins is managed by provider. Email for email/pass login would require backend to change and re-verify. ";
    }
    updateMessage += "Phone number field is for demonstration and requires backend integration to save.";


    toast({
      title: "Profile Update (Demo)",
      description: updateMessage,
    });
  }
  
  if (nextAuthStatus === "loading" || isLoadingSimulatedAuth) {
    return <div className="flex justify-center items-center p-10"><p>Loading profile...</p></div>;
  }

  if (nextAuthStatus === "unauthenticated" && !simulatedUser) {
    return <div className="flex justify-center items-center p-10"><p>Please log in to view your profile.</p></div>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Profile Information</CardTitle>
        <CardDescription>View and update your personal details. Email for social logins is managed by the provider.</CardDescription>
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
                    <Input type="email" {...field} disabled={!!nextAuthSession?.user?.email} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground pt-1">
                    {nextAuthSession?.user?.email 
                      ? "Email is managed by your identity provider and cannot be changed here."
                      : "Email used for login."
                    }
                  </p>
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

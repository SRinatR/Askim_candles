
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { PlusCircle, AlertTriangle } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminUsersPage() {
  const { isAdmin } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      // Redirect non-admins or show an access denied message.
      // For now, redirect to admin dashboard.
      router.replace('/admin/dashboard'); 
    }
  }, [isAdmin, router]);
  
  if (!isAdmin) {
    return (
         <Card className="border-destructive">
            <CardHeader className="flex flex-row items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-destructive"/>
                <CardTitle className="text-destructive">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You do not have permission to view this page. Redirecting...</p>
            </CardContent>
         </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
            <p className="text-muted-foreground">
                View and manage user accounts and roles. (ADMIN Only)
            </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New User (Coming Soon)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>Browse and manage registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">User table and management features are in development.</p>
          <div className="mt-4 p-8 border-2 border-dashed border-border rounded-md text-center text-muted-foreground">
            User listing will appear here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

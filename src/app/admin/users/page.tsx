
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { PlusCircle, AlertTriangle, UserCog, ShieldCheck, Mail, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Corrected import for useRouter
import React, { useEffect, useState } from 'react';
import type { AdminUser } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// TODO: Localize texts when admin i18n is fully implemented

export default function AdminUsersPage() {
  const { isAdmin, predefinedUsers, dynamicallyAddedManagers } = useAdminAuth(); // Assuming these are exposed by context
  const router = useRouter();
  const [allManagers, setAllManagers] = useState<AdminUser[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/admin/dashboard'); 
    }
  }, [isAdmin, router]);

  useEffect(() => {
    // Combine predefined managers and dynamically added ones
    const managersFromPredefined = Object.values(predefinedUsers || {}).filter(user => user.role === 'MANAGER');
    setAllManagers([...managersFromPredefined, ...dynamicallyAddedManagers]);
  }, [predefinedUsers, dynamicallyAddedManagers]);

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
            <h1 className="text-3xl font-bold tracking-tight">Manage Users & Managers</h1>
            <p className="text-muted-foreground">
                View users, assign roles, and manage manager accounts. (ADMIN Only)
            </p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new-manager">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Manager
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manager List</CardTitle>
          <CardDescription>List of all manager accounts (predefined and dynamically added via simulation).</CardDescription>
        </CardHeader>
        <CardContent>
          {allManagers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead><Mail className="inline h-4 w-4 mr-1"/>Email</TableHead>
                  <TableHead><ShieldCheck className="inline h-4 w-4 mr-1"/>Role</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allManagers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="sm" disabled>
                        <UserCog className="mr-1 h-3 w-3" /> Edit (Simulated)
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No managers found.</p>
          )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Main site user management will require database integration.</p>
        </CardFooter>
      </Card>
      <p className="text-sm text-muted-foreground text-center">
          Note: Manager additions are simulated via localStorage and will persist for this browser session.
        </p>
    </div>
  );
}


"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Trash2, AlertTriangle } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useRouter } from 'next/navigation';
import { getAdminLogs, clearAdminLogs, type AdminLogEntry, logAdminAction } from '@/admin/lib/admin-logger';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// TODO: Localize texts when admin i18n is fully implemented

export default function AdminLogsPage() {
  const { isAdmin, isLoading: isLoadingAuth, currentAdminUser } = useAdminAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<AdminLogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoadingAuth && !isAdmin) {
      router.replace('/admin/dashboard');
    }
  }, [isAdmin, router, isLoadingAuth]);

  useEffect(() => {
    if (isAdmin) {
      setLogs(getAdminLogs());
      setIsLoadingLogs(false);
    }
  }, [isAdmin]);

  const handleClearLogs = () => {
    clearAdminLogs();
    setLogs([]); // Update UI immediately
    if (currentAdminUser?.email) {
        logAdminAction(currentAdminUser.email, "All Admin Logs Cleared");
        // Re-fetch logs to include the "clear logs" action itself, then filter it if needed or just show.
        // For simplicity, we'll just show it. New logs will be on top.
        setLogs(getAdminLogs());
    }
    toast({ title: "Logs Cleared", description: "All admin logs have been cleared from localStorage." });
  };

  if (isLoadingAuth || isLoadingLogs) {
    return <div className="flex h-screen items-center justify-center"><p>Loading Logs...</p></div>;
  }

  if (!isAdmin) {
    return (
      <Card className="border-destructive">
        <CardHeader className="flex flex-row items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-destructive" />
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System & Audit Logs</h1>
          <p className="text-muted-foreground">
            View admin actions. Logs are stored in browser localStorage (max 100 entries).
          </p>
        </div>
        {logs.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Clear All Logs
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete all log entries from your browser's local storage. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearLogs} className="bg-destructive hover:bg-destructive/90">
                  Yes, clear logs
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Log Entries</CardTitle>
          <CardDescription>
            {logs.length > 0 ? `Displaying ${logs.length} log entries.` : "No log entries found."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Timestamp</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{log.userEmail}</TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>
                      {log.details ? (
                        <pre className="text-xs bg-muted p-2 rounded-sm overflow-x-auto max-w-xs">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="mt-4 p-12 border-2 border-dashed border-border rounded-md text-center text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold">No Logs Yet</h3>
              <p className="text-sm">
                Admin actions will be logged and displayed here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground text-center">
        Note: Log data is simulated and stored in browser localStorage. For production, a robust backend logging solution is required.
      </p>
    </div>
  );
}


"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { LogOut, ShieldAlert, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import type { AdminLocale } from '@/admin/lib/i18n-config-admin';
import { i18nAdmin } from '@/admin/lib/i18n-config-admin';
import { getAdminDictionary } from '@/admin/lib/getAdminDictionary';
import type enAdminMessages from '@/admin/dictionaries/en.json';

type AdminSessionsPageDict = typeof enAdminMessages.adminSessionsPage;

export default function AdminSessionsPage() {
  const { currentAdminUser, logout, isAdmin, isLoading } = useAdminAuth();
  const router = useRouter();
  const [dict, setDict] = useState<AdminSessionsPageDict | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedLocale = localStorage.getItem('admin-lang') as AdminLocale | null;
    const localeToLoad = storedLocale && i18nAdmin.locales.includes(storedLocale) ? storedLocale : i18nAdmin.defaultLocale;
    
    async function loadDictionary() {
      const fullDict = await getAdminDictionary(localeToLoad);
      setDict(fullDict.adminSessionsPage);
    }
    loadDictionary();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace('/admin/dashboard');
    }
  }, [isAdmin, router, isLoading]);

  if (isLoading || !isClient || !dict) {
    return <div className="flex h-full items-center justify-center"><p>Loading Session Management...</p></div>;
  }

  if (!isAdmin) {
     return (
         <Card className="border-destructive">
            <CardHeader className="flex flex-row items-center space-x-2">
                <ShieldAlert className="h-6 w-6 text-destructive"/>
                <CardTitle className="text-destructive">{dict.accessDeniedTitle || "Access Denied"}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{dict.accessDeniedDesc || "You do not have permission to view this page."}</p>
            </CardContent>
         </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dict.title || "Session Management"}</CardTitle>
          <CardDescription>{dict.description || "Manage active sessions. Full cross-device session management requires backend integration."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentAdminUser && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{dict.currentSessionTitle || "Current Session (This Device)"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p><strong>{dict.nameLabel || "Name:"}</strong> {currentAdminUser.name}</p>
                <p><strong>{dict.emailLabel || "Email:"}</strong> {currentAdminUser.email}</p>
                <p><strong>{dict.roleLabel || "Role:"}</strong> {currentAdminUser.role}</p>
              </CardContent>
              <CardContent>
                 <Button onClick={logout} variant="outline">
                    <LogOut className="mr-2 h-4 w-4" /> {dict.logoutThisDeviceButton || "Log Out From This Device"}
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{dict.otherSessionsTitle || "Other Active Sessions"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start p-3 bg-muted/50 rounded-md border border-dashed">
                <Info className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {dict.otherSessionsInfo || "Viewing and managing sessions across all devices (e.g., 'Log out everywhere') is a feature that requires backend database integration to track active sessions centrally. This functionality will be implemented once the backend is in place."}
                </p>
              </div>
              <Button variant="outline" disabled>
                {dict.logoutOtherDevicesButton || "Log Out From All Other Devices (Requires Backend)"}
              </Button>
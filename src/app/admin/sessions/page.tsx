
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
      try {
        const fullDict = await getAdminDictionary(localeToLoad);
        if (fullDict && fullDict.adminSessionsPage) {
          setDict(fullDict.adminSessionsPage);
        } else {
          console.error("Failed to load adminSessionsPage dictionary or section is missing");
          // Fallback to a minimal default if dictionary loading fails or section is missing
          setDict({
            title: "Session Management",
            description: "Manage active sessions. Full cross-device session management requires backend integration.",
            currentSessionTitle: "Current Session (This Device)",
            nameLabel: "Name:",
            emailLabel: "Email:",
            roleLabel: "Role:",
            logoutThisDeviceButton: "Log Out From This Device",
            otherSessionsTitle: "Other Active Sessions",
            otherSessionsInfo: "Viewing and managing sessions across all devices (e.g., 'Log out everywhere') is a feature that requires backend database integration to track active sessions centrally. This functionality will be implemented once the backend is in place.",
            logoutOtherDevicesButton: "Log Out From All Other Devices (Requires Backend)",
            accessDeniedTitle: "Access Denied",
            accessDeniedDesc: "You do not have permission to view this page."
          });
        }
      } catch (error) {
        console.error("Error loading admin dictionary for sessions page:", error);
        // Fallback to a minimal default in case of error
        setDict({
          title: "Session Management",
          description: "Manage active sessions. Full cross-device session management requires backend integration.",
          currentSessionTitle: "Current Session (This Device)",
          nameLabel: "Name:",
          emailLabel: "Email:",
          roleLabel: "Role:",
          logoutThisDeviceButton: "Log Out From This Device",
          otherSessionsTitle: "Other Active Sessions",
          otherSessionsInfo: "Viewing and managing sessions across all devices (e.g., 'Log out everywhere') is a feature that requires backend database integration to track active sessions centrally. This functionality will be implemented once the backend is in place.",
          logoutOtherDevicesButton: "Log Out From All Other Devices (Requires Backend)",
          accessDeniedTitle: "Access Denied",
          accessDeniedDesc: "You do not have permission to view this page."
        });
      }
    }
    loadDictionary();
  }, []); // Runs once on mount

  useEffect(() => {
    if (isClient && !isLoading && !isAdmin) {
      router.replace('/admin/dashboard');
    }
  }, [isAdmin, router, isLoading, isClient]);

  if (!isClient || isLoading || !dict) {
    return <div className="flex h-full items-center justify-center"><p>Loading Session Management...</p></div>;
  }

  if (!isAdmin) {
     return (
         <Card className="border-destructive">
            <CardHeader className="flex flex-row items-center space-x-2">
                <ShieldAlert className="h-6 w-6 text-destructive"/>
                <CardTitle className="text-destructive">{dict.accessDeniedTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{dict.accessDeniedDesc}</p>
            </CardContent>
         </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dict.title}</CardTitle>
          <CardDescription>{dict.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentAdminUser && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{dict.currentSessionTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p><strong>{dict.nameLabel}</strong> {currentAdminUser.name}</p>
                <p><strong>{dict.emailLabel}</strong> {currentAdminUser.email}</p>
                <p><strong>{dict.roleLabel}</strong> {currentAdminUser.role}</p>
              </CardContent>
              <CardContent>
                 <Button onClick={logout} variant="outline">
                    <LogOut className="mr-2 h-4 w-4" /> {dict.logoutThisDeviceButton}
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{dict.otherSessionsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start p-3 bg-muted/50 rounded-md border border-dashed">
                <Info className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {dict.otherSessionsInfo}
                </p>
              </div>
              <Button variant="outline" disabled>
                {dict.logoutOtherDevicesButton}
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

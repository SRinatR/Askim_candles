
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { LogOut, ShieldAlert, Info, Clock, Laptop, Globe } from "lucide-react"; // Added Clock, Laptop, Globe
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import type { AdminLocale } from '@/admin/lib/i18n-config-admin';
import { i18nAdmin } from '@/admin/lib/i18n-config-admin';
import { getAdminDictionary } from '@/admin/lib/getAdminDictionary';
import type enAdminMessages from '@/admin/dictionaries/en.json';

type AdminSessionsPageDict = typeof enAdminMessages.adminSessionsPage;

export default function AdminSessionsPage() {
  const { currentAdminUser, logout, isAdmin, isLoading, sessionStartTime, sessionUserAgent } = useAdminAuth();
  const router = useRouter();
  const [dict, setDict] = useState<AdminSessionsPageDict | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [formattedStartTime, setFormattedStartTime] = useState<string | null>(null);

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
          setDict({
            title: "Session Management",
            description: "Manage active sessions. Full cross-device session management requires backend integration.",
            currentSessionTitle: "Current Session (This Device)",
            nameLabel: "Name:",
            emailLabel: "Email:",
            roleLabel: "Role:",
            sessionStartTimeLabel: "Session Start Time:",
            deviceBrowserLabel: "Device/Browser:",
            ipAddressLabel: "IP Address:",
            ipAddressNote: "N/A (requires backend)",
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
        setDict({
            title: "Session Management",
            description: "Manage active sessions. Full cross-device session management requires backend integration.",
            currentSessionTitle: "Current Session (This Device)",
            nameLabel: "Name:",
            emailLabel: "Email:",
            roleLabel: "Role:",
            sessionStartTimeLabel: "Session Start Time:",
            deviceBrowserLabel: "Device/Browser:",
            ipAddressLabel: "IP Address:",
            ipAddressNote: "N/A (requires backend)",
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
  }, []); 

  useEffect(() => {
    if (isClient && !isLoading && !isAdmin) {
      router.replace('/admin/dashboard');
    }
  }, [isAdmin, router, isLoading, isClient]);

  useEffect(() => {
    if (sessionStartTime) {
      try {
        setFormattedStartTime(new Date(sessionStartTime).toLocaleString());
      } catch (e) {
        setFormattedStartTime("Invalid date");
      }
    } else {
      setFormattedStartTime(null);
    }
  }, [sessionStartTime]);

  if (!isClient || isLoading || !dict) {
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
          <CardDescription>{dict.description || "Manage active sessions."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentAdminUser && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{dict.currentSessionTitle || "Current Session (This Device)"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>{dict.nameLabel || "Name:"}</strong> {currentAdminUser.name}</p>
                <p><strong>{dict.emailLabel || "Email:"}</strong> {currentAdminUser.email}</p>
                <p><strong>{dict.roleLabel || "Role:"}</strong> {currentAdminUser.role}</p>
                {formattedStartTime && (
                  <p className="flex items-center"><Clock className="mr-2 h-4 w-4 text-muted-foreground" /><strong>{dict.sessionStartTimeLabel || "Session Start Time:"}</strong> <span className="ml-1">{formattedStartTime}</span></p>
                )}
                {sessionUserAgent && (
                  <div className="flex items-start">
                    <Laptop className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p><strong>{dict.deviceBrowserLabel || "Device/Browser:"}</strong> <span className="ml-1 break-all text-xs">{sessionUserAgent}</span></p>
                  </div>
                )}
                 <p className="flex items-center"><Globe className="mr-2 h-4 w-4 text-muted-foreground" /><strong>{dict.ipAddressLabel || "IP Address:"}</strong> <span className="ml-1">{dict.ipAddressNote || "N/A (requires backend)"}</span></p>
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
                  {dict.otherSessionsInfo || "Full cross-device session management requires backend integration."}
                </p>
              </div>
              <Button variant="outline" disabled>
                {dict.logoutOtherDevicesButton || "Log Out From All Other Devices (Requires Backend)"}
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}


    
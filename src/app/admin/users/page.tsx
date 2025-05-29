
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { PlusCircle, AlertTriangle, UserCog, ShieldCheck, Mail, UserX, UserCheckIcon, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import type { AdminUser } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdminLocale } from '@/admin/lib/i18n-config-admin';
import { i18nAdmin } from '@/admin/lib/i18n-config-admin';
import { getAdminDictionary } from '@/admin/lib/getAdminDictionary';
import type enAdminMessages from '@/admin/dictionaries/en.json';
import { useToast } from "@/hooks/use-toast";

type AdminUsersPageDict = typeof enAdminMessages.adminUsersPage;

export default function AdminUsersPage() {
  const { isAdmin, isLoading, currentAdminUser, predefinedUsers, dynamicallyAddedManagers, toggleBlockManagerStatus } = useAdminAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [allAdminUsers, setAllAdminUsers] = useState<AdminUser[]>([]);
  const [dict, setDict] = useState<AdminUsersPageDict | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedLocale = localStorage.getItem('admin-lang') as AdminLocale | null;
    const localeToLoad = storedLocale && i18nAdmin.locales.includes(storedLocale) ? storedLocale : i18nAdmin.defaultLocale;
    
    async function loadDictionary() {
      const fullDict = await getAdminDictionary(localeToLoad);
      setDict(fullDict.adminUsersPage);
    }
    loadDictionary();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAdmin) { 
      router.replace('/admin/dashboard'); 
    }
  }, [isAdmin, router, isLoading]);

  useEffect(() => {
    const combinedUsers: AdminUser[] = [
      ...Object.values(predefinedUsers),
      ...dynamicallyAddedManagers
    ];
    setAllAdminUsers(combinedUsers);
  }, [predefinedUsers, dynamicallyAddedManagers]);

  const handleToggleBlock = async (email: string) => {
    await toggleBlockManagerStatus(email);
    // Re-fetch/re-combine users to reflect update
    const updatedCombinedUsers: AdminUser[] = [
        ...Object.values(predefinedUsers), // Predefined users don't change block status via this UI
        ...dynamicallyAddedManagers.map(m => m.email === email ? {...m, isBlocked: !m.isBlocked} : m) 
    ];
     // The dynamicallyAddedManagers state in context will be updated, so we can rely on it.
     // To ensure the local allAdminUsers state is also up-to-date immediately:
    setAllAdminUsers(prev => prev.map(u => u.email === email ? {...u, isBlocked: !u.isBlocked} : u));
  };

  const handleRoleChangeSimulated = () => {
    if (dict) {
      toast({
        title: dict.roleChangeSimulatedTitle,
        description: dict.roleChangeSimulatedDesc,
      });
    }
  };

  if (isLoading || !isClient || !dict) {
    return <div className="flex h-screen items-center justify-center"><p>{dict?.loadingPage || "Loading User Management..."}</p></div>;
  }
  
  if (!isAdmin) {
    return (
         <Card className="border-destructive">
            <CardHeader className="flex flex-row items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-destructive"/>
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
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">{dict.title}</h1>
            <p className="text-muted-foreground">{dict.description}</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new-manager">
            <PlusCircle className="mr-2 h-4 w-4" /> {dict.addNewManagerButton}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{dict.managerListTitle}</CardTitle>
          <CardDescription>{dict.managerListDesc.replace('{count}', String(allAdminUsers.length))}</CardDescription>
        </CardHeader>
        <CardContent>
          {allAdminUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dict.nameHeader}</TableHead>
                  <TableHead><Mail className="inline h-4 w-4 mr-1"/>{dict.emailHeader}</TableHead>
                  <TableHead><ShieldCheck className="inline h-4 w-4 mr-1"/>{dict.roleHeader}</TableHead>
                  <TableHead>{dict.statusHeader}</TableHead>
                  <TableHead className="text-center">{dict.actionsHeader}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAdminUsers.map((user) => {
                  const isPredefined = Object.values(predefinedUsers).some(pu => pu.email === user.email);
                  const isCurrentUserAdmin = currentAdminUser?.email === user.email && user.role === 'ADMIN';
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={user.isBlocked ? "destructive" : "secondary"}>
                          {user.isBlocked ? dict.statusBlocked : dict.statusActive}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center space-x-1">
                        {!isPredefined && !isCurrentUserAdmin && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleToggleBlock(user.email)}
                              className="h-7 px-2 py-1 text-xs"
                            >
                              {user.isBlocked ? <UserCheckIcon className="mr-1 h-3 w-3" /> : <UserX className="mr-1 h-3 w-3" />}
                              {user.isBlocked ? dict.unblockUserAction : dict.blockUserAction}
                            </Button>
                            <Select defaultValue={user.role} onValueChange={handleRoleChangeSimulated} disabled>
                              <SelectTrigger className="h-7 px-2 py-1 text-xs w-[120px] inline-flex">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MANAGER">{dict.roleManager}</SelectItem>
                                <SelectItem value="USER" disabled>{dict.roleUser}</SelectItem>
                              </SelectContent>
                            </Select>
                             <Button variant="outline" size="sm" disabled className="h-7 px-2 py-1 text-xs">
                               <Settings2 className="mr-1 h-3 w-3" />{dict.permissionsActionPlaceholder}
                            </Button>
                          </>
                        )}
                        {isPredefined && (
                           <span className="text-xs text-muted-foreground">{dict.predefinedUserText}</span>
                        )}
                         {isCurrentUserAdmin && (
                           <span className="text-xs text-muted-foreground">{dict.currentUserAdminText}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">{dict.noManagersFound}</p>
          )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">{dict.mainSiteUserManagementNote}</p>
        </CardFooter>
      </Card>
       <p className="text-sm text-muted-foreground text-center">
          {dict.simulationNote}
        </p>
    </div>
  );
}


"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { PlusCircle, AlertTriangle, UserCog, ShieldCheck, Mail, UserX, UserCheckIcon, Settings2, Edit2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import type { AdminUser, AdminRole } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
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

  const [selectedUserForRoleChange, setSelectedUserForRoleChange] = useState<AdminUser | null>(null);
  const [isRoleChangeModalOpen, setIsRoleChangeModalOpen] = useState(false);
  const [selectedRoleInModal, setSelectedRoleInModal] = useState<AdminRole>('MANAGER');

  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<AdminUser | null>(null);

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
      ...Object.values(predefinedUsers).map(u => ({ ...u, isPredefined: true })),
      ...dynamicallyAddedManagers.map(u => ({ ...u, isPredefined: false }))
    ];
    setAllAdminUsers(combinedUsers);
  }, [predefinedUsers, dynamicallyAddedManagers]);

  const handleToggleBlock = async (email: string) => {
    await toggleBlockManagerStatus(email);
  };

  const openRoleChangeModal = (user: AdminUser) => {
    setSelectedUserForRoleChange(user);
    setSelectedRoleInModal(user.role);
    setIsRoleChangeModalOpen(true);
  };

  const handleSimulatedRoleSave = () => {
    if (dict && selectedUserForRoleChange) {
      toast({
        title: dict.roleChangeSimulatedTitle,
        description: dict.roleChangeSimulatedDesc
          .replace('{name}', selectedUserForRoleChange.name)
          .replace('{role}', selectedRoleInModal),
      });
    }
    setIsRoleChangeModalOpen(false);
    setSelectedUserForRoleChange(null);
  };

  const openPermissionsModal = (user: AdminUser) => {
    setSelectedUserForPermissions(user);
    setIsPermissionsModalOpen(true);
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
                  const isCurrentUserAdmin = currentAdminUser?.email === user.email && user.role === 'ADMIN';
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name}
                        {user.isPredefined && <Badge variant="outline" className="ml-2 text-xs">{dict.predefinedUserBadge}</Badge>}
                        {isCurrentUserAdmin && <Badge variant="default" className="ml-2 text-xs">{dict.currentUserAdminBadge}</Badge>}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={user.isBlocked ? "destructive" : "secondary"}>
                          {user.isBlocked ? dict.statusBlocked : dict.statusActive}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center space-x-1">
                        {!user.isPredefined && !isCurrentUserAdmin && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleToggleBlock(user.email)}
                              className="h-7 px-2 py-1 text-xs"
                              title={user.isBlocked ? dict.unblockUserAction : dict.blockUserAction}
                            >
                              {user.isBlocked ? <UserCheckIcon className="mr-1 h-3 w-3" /> : <UserX className="mr-1 h-3 w-3" />}
                              {user.isBlocked ? dict.unblockUserAction : dict.blockUserAction}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openRoleChangeModal(user)}
                              className="h-7 px-2 py-1 text-xs"
                              title={dict.changeRoleButton}
                            >
                              <Edit2 className="mr-1 h-3 w-3" />
                              {dict.changeRoleButton}
                            </Button>
                             <Button variant="outline" size="sm" onClick={() => openPermissionsModal(user)} className="h-7 px-2 py-1 text-xs" title={dict.permissionsButtonTitle}>
                               <Settings2 className="mr-1 h-3 w-3" />{dict.permissionsButton}
                            </Button>
                          </>
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

        {/* Change Role Modal */}
        {selectedUserForRoleChange && (
            <Dialog open={isRoleChangeModalOpen} onOpenChange={setIsRoleChangeModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dict.changeRoleModalTitle.replace('{name}', selectedUserForRoleChange.name)}</DialogTitle>
                        <DialogDescription>{dict.changeRoleModalDesc}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <p className="text-sm">{dict.currentRoleLabel} <Badge>{selectedUserForRoleChange.role}</Badge></p>
                        <div>
                            <label htmlFor="role-select" className="text-sm font-medium">{dict.newRoleLabel}</label>
                            <Select value={selectedRoleInModal} onValueChange={(value) => setSelectedRoleInModal(value as AdminRole)}>
                                <SelectTrigger id="role-select" className="mt-1">
                                    <SelectValue placeholder={dict.selectRolePlaceholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN" disabled={selectedUserForRoleChange.role === 'ADMIN' && !currentAdminUser?.email?.startsWith('superadmin@')}>{dict.roleAdmin}</SelectItem>
                                    <SelectItem value="MANAGER">{dict.roleManager}</SelectItem>
                                    {/* <SelectItem value="USER" disabled>User (Main Site)</SelectItem> */}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">{dict.cancelButton}</Button></DialogClose>
                        <Button type="button" onClick={handleSimulatedRoleSave}>{dict.saveRoleButton}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}

        {/* Permissions Modal Placeholder */}
        {selectedUserForPermissions && (
            <Dialog open={isPermissionsModalOpen} onOpenChange={setIsPermissionsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dict.permissionsModalTitle.replace('{name}', selectedUserForPermissions.name)}</DialogTitle>
                        <DialogDescription>{dict.permissionsModalDesc}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-sm text-muted-foreground">
                        <p>{dict.permissionsFeatureComingSoon}</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>{dict.manageProductsPermission} (Yes/No)</li>
                            <li>{dict.manageOrdersPermission} (Yes/No)</li>
                            <li>{dict.manageDiscountsPermission} (Yes/No)</li>
                        </ul>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">{dict.closeButton}</Button></DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}

    </div>
  );
}

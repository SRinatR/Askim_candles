
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from '@/lib/mock-data';
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
import type { AdminLocale } from '@/admin/lib/i18n-config-admin';
import { i18nAdmin } from '@/admin/lib/i18n-config-admin';
import { getAdminDictionary } from '@/admin/lib/getAdminDictionary';
import type enAdminMessages from '@/admin/dictionaries/en.json';

const LOCAL_STORAGE_KEY_SCENTS = "askimAdminCustomScents";
type ManageScentsDict = typeof enAdminMessages.adminManageScentsPage;

type AlertDialogStrings = {
  confirmDeleteTitle: string;
  confirmDeleteScentInUse: string;
  confirmDeleteGeneral: string;
  cancelButton: string;
  deleteConfirmButton: string;
};

export default function AdminManageScentsPage() {
  const [allScents, setAllScents] = useState<string[]>([]);
  const [newScentName, setNewScentName] = useState("");
  const { toast } = useToast();
  const [dictionary, setDictionary] = useState<ManageScentsDict | null>(null);
  const [alertStrings, setAlertStrings] = useState<AlertDialogStrings | null>(null);


  useEffect(() => {
    const storedLocale = localStorage.getItem('admin-lang') as AdminLocale | null;
    const localeToLoad = storedLocale && i18nAdmin.locales.includes(storedLocale) ? storedLocale : i18nAdmin.defaultLocale;
    
    async function loadDictionary() {
      const fullDict = await getAdminDictionary(localeToLoad);
      setDictionary(fullDict.adminManageScentsPage);
      setAlertStrings({
        confirmDeleteTitle: fullDict.adminManageScentsPage.confirmDeleteTitle || "Confirm Deletion",
        confirmDeleteScentInUse: fullDict.adminManageScentsPage.confirmDeleteScentInUse || "The scent '{attributeName}' is currently used. Deleting it may affect products. Sure?",
        confirmDeleteGeneral: fullDict.adminManageScentsPage.confirmDeleteGeneral || "Are you sure you want to delete the scent \"{name}\"?",
        cancelButton: fullDict.adminManageScentsPage.cancelButton || "Cancel",
        deleteConfirmButton: fullDict.adminManageScentsPage.deleteConfirmButton || "Delete",
      });
    }
    loadDictionary();

    let storedScents = localStorage.getItem(LOCAL_STORAGE_KEY_SCENTS);
    if (!storedScents) {
      const initialMockScentNames = Array.from(new Set(mockProducts.map(p => p.scent).filter((s): s is string => !!s))).sort();
      localStorage.setItem(LOCAL_STORAGE_KEY_SCENTS, JSON.stringify(initialMockScentNames));
      storedScents = JSON.stringify(initialMockScentNames);
    }
    setAllScents(JSON.parse(storedScents));

  }, []);
  
  const isScentInUse = (scentName: string): boolean => {
    return mockProducts.some(product => product.scent === scentName);
  };

  const handleAddScent = () => {
    if (!dictionary) return;
    if (!newScentName.trim()) {
      toast({ title: "Error", description: dictionary.errorEmptyName, variant: "destructive" });
      return;
    }
    const scentExists = allScents.some(
      (scent) => scent.toLowerCase() === newScentName.trim().toLowerCase()
    );
    if (scentExists) {
      toast({ title: "Error", description: dictionary.errorExists, variant: "destructive" });
      return;
    }
    const updatedScents = [...allScents, newScentName.trim()];
    setAllScents(updatedScents);
    localStorage.setItem(LOCAL_STORAGE_KEY_SCENTS, JSON.stringify(updatedScents));
    setNewScentName("");
    toast({ title: dictionary.addSuccessTitle, description: dictionary.addSuccess.replace('{name}', newScentName.trim()) });
  };

  const handleDeleteScent = (scentToDelete: string) => {
    if (!dictionary) return;
    const updatedScents = allScents.filter(scent => scent !== scentToDelete);
    setAllScents(updatedScents);
    localStorage.setItem(LOCAL_STORAGE_KEY_SCENTS, JSON.stringify(updatedScents));
    toast({ title: dictionary.deleteSuccessTitle, description: dictionary.deleteSuccess.replace('{name}', scentToDelete) });
  };
  
  if (!dictionary || !alertStrings) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{dictionary.title}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.addNewTitle}</CardTitle>
          <CardDescription>{dictionary.addNewDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            value={newScentName}
            onChange={(e) => setNewScentName(e.target.value)}
            placeholder={dictionary.inputPlaceholder}
            className="flex-grow"
          />
          <Button onClick={handleAddScent}><PlusCircle className="mr-2 h-4 w-4" /> {dictionary.addButton}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.existingTitle}</CardTitle>
          <CardDescription>{dictionary.existingDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {allScents.length === 0 ? (
            <p className="text-muted-foreground text-sm">{dictionary.noCustomYet || "No scents added yet."}</p>
          ) : (
            <ul className="space-y-2">
              {allScents.map(scent => (
                <li key={scent} className="flex items-center justify-between p-2 border rounded-md text-sm">
                  <span>{scent}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{alertStrings.confirmDeleteTitle}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {isScentInUse(scent) 
                            ? alertStrings.confirmDeleteScentInUse.replace('{attributeName}', scent)
                            : alertStrings.confirmDeleteGeneral.replace('{name}', scent)
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{alertStrings.cancelButton}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteScent(scent)} className="bg-destructive hover:bg-destructive/90">{alertStrings.deleteConfirmButton}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground text-center">
        {dictionary.note}
      </p>
    </div>
  );
}

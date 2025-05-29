
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

const LOCAL_STORAGE_KEY_MATERIALS = "askimAdminCustomMaterials";
type ManageMaterialsDict = typeof enAdminMessages.adminManageMaterialsPage;

type AlertDialogStrings = {
  confirmDeleteTitle: string;
  confirmDeleteMaterialInUse: string;
  confirmDeleteGeneral: string;
  cancelButton: string;
  deleteConfirmButton: string;
};

export default function AdminManageMaterialsPage() {
  const [allMaterials, setAllMaterials] = useState<string[]>([]);
  const [newMaterialName, setNewMaterialName] = useState("");
  const { toast } = useToast();
  const [dictionary, setDictionary] = useState<ManageMaterialsDict | null>(null);
  const [alertStrings, setAlertStrings] = useState<AlertDialogStrings | null>(null);

  useEffect(() => {
    const storedLocale = localStorage.getItem('admin-lang') as AdminLocale | null;
    const localeToLoad = storedLocale && i18nAdmin.locales.includes(storedLocale) ? storedLocale : i18nAdmin.defaultLocale;
    
    async function loadDictionary() {
      const fullDict = await getAdminDictionary(localeToLoad);
      setDictionary(fullDict.adminManageMaterialsPage);
      setAlertStrings({
        confirmDeleteTitle: fullDict.adminManageMaterialsPage.confirmDeleteTitle || "Confirm Deletion",
        confirmDeleteMaterialInUse: fullDict.adminManageMaterialsPage.confirmDeleteMaterialInUse || "The material '{attributeName}' is currently used. Deleting it may affect products. Sure?",
        confirmDeleteGeneral: fullDict.adminManageMaterialsPage.confirmDeleteGeneral || "Are you sure you want to delete the material \"{name}\"?",
        cancelButton: fullDict.adminManageMaterialsPage.cancelButton || "Cancel",
        deleteConfirmButton: fullDict.adminManageMaterialsPage.deleteConfirmButton || "Delete",
      });
    }
    loadDictionary();
    
    let storedMaterials = localStorage.getItem(LOCAL_STORAGE_KEY_MATERIALS);
    if (!storedMaterials) {
        const initialMockMaterialNames = Array.from(new Set(mockProducts.map(p => p.material).filter((m): m is string => !!m))).sort();
        localStorage.setItem(LOCAL_STORAGE_KEY_MATERIALS, JSON.stringify(initialMockMaterialNames));
        storedMaterials = JSON.stringify(initialMockMaterialNames);
    }
    setAllMaterials(JSON.parse(storedMaterials));
  }, []);


  const isMaterialInUse = (materialName: string): boolean => {
    return mockProducts.some(product => product.material === materialName);
  };

  const handleAddMaterial = () => {
    if (!dictionary) return;
    if (!newMaterialName.trim()) {
      toast({ title: "Error", description: dictionary.errorEmptyName, variant: "destructive" });
      return;
    }
    const materialExists = allMaterials.some(
      (mat) => mat.toLowerCase() === newMaterialName.trim().toLowerCase()
    );
    if (materialExists) {
      toast({ title: "Error", description: dictionary.errorExists, variant: "destructive" });
      return;
    }
    const updatedMaterials = [...allMaterials, newMaterialName.trim()];
    setAllMaterials(updatedMaterials);
    localStorage.setItem(LOCAL_STORAGE_KEY_MATERIALS, JSON.stringify(updatedMaterials));
    setNewMaterialName("");
    toast({ title: dictionary.addSuccessTitle, description: dictionary.addSuccess.replace('{name}', newMaterialName.trim()) });
  };

  const handleDeleteMaterial = (materialToDelete: string) => {
    if (!dictionary) return;
    const updatedMaterials = allMaterials.filter(mat => mat !== materialToDelete);
    setAllMaterials(updatedMaterials);
    localStorage.setItem(LOCAL_STORAGE_KEY_MATERIALS, JSON.stringify(updatedMaterials));
    toast({ title: dictionary.deleteSuccessTitle, description: dictionary.deleteSuccess.replace('{name}', materialToDelete) });
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
            value={newMaterialName}
            onChange={(e) => setNewMaterialName(e.target.value)}
            placeholder={dictionary.inputPlaceholder}
            className="flex-grow"
          />
          <Button onClick={handleAddMaterial}><PlusCircle className="mr-2 h-4 w-4" /> {dictionary.addButton}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.existingTitle}</CardTitle>
          <CardDescription>{dictionary.existingDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {allMaterials.length === 0 ? (
             <p className="text-muted-foreground text-sm">{dictionary.noCustomYet || "No materials added yet."}</p>
          ) : (
            <ul className="space-y-2">
              {allMaterials.map(mat => (
                <li key={mat} className="flex items-center justify-between p-2 border rounded-md text-sm">
                  <span>{mat}</span>
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
                          {isMaterialInUse(mat) 
                            ? alertStrings.confirmDeleteMaterialInUse.replace('{attributeName}', mat)
                            : alertStrings.confirmDeleteGeneral.replace('{name}', mat)
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{alertStrings.cancelButton}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteMaterial(mat)} className="bg-destructive hover:bg-destructive/90">{alertStrings.deleteConfirmButton}</AlertDialogAction>
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

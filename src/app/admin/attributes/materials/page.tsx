
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

const LOCAL_STORAGE_KEY_CUSTOM_MATERIALS = "askimAdminCustomMaterials";
type ManageMaterialsDict = typeof enAdminMessages.adminManageMaterialsPage;

// This type is for the strings used within the AlertDialog component
type AlertDialogStrings = {
  confirmDeleteTitle: string;
  confirmDeleteMaterialInUse: string;
  confirmDeleteGeneral: string;
  cancelButton: string;
  deleteConfirmButton: string;
};

export default function AdminManageMaterialsPage() {
  const [customMaterials, setCustomMaterials] = useState<string[]>([]);
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

    const storedMaterials = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_MATERIALS);
    if (storedMaterials) {
      setCustomMaterials(JSON.parse(storedMaterials));
    } else {
      const initialMockMaterialNames = Array.from(new Set(mockProducts.map(p => p.material).filter((m): m is string => !!m))).sort();
      setCustomMaterials(initialMockMaterialNames);
      localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_MATERIALS, JSON.stringify(initialMockMaterialNames));
    }
  }, []);

  const baseMaterials = useMemo(() => {
    return Array.from(new Set(mockProducts.map(p => p.material).filter((m): m is string => !!m))).sort();
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
    const materialExists = customMaterials.some(
      (mat) => mat.toLowerCase() === newMaterialName.trim().toLowerCase()
    );
    if (materialExists) {
      toast({ title: "Error", description: dictionary.errorExists, variant: "destructive" });
      return;
    }
    const updatedMaterials = [...customMaterials, newMaterialName.trim()];
    setCustomMaterials(updatedMaterials);
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_MATERIALS, JSON.stringify(updatedMaterials));
    setNewMaterialName("");
    toast({ title: dictionary.addSuccessTitle, description: dictionary.addSuccess.replace('{name}', newMaterialName.trim()) });
  };

  const handleDeleteMaterial = (materialToDelete: string) => {
    if (!dictionary) return;
    const updatedMaterials = customMaterials.filter(mat => mat !== materialToDelete);
    setCustomMaterials(updatedMaterials);
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_MATERIALS, JSON.stringify(updatedMaterials));
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
          <h3 className="font-semibold mb-2 text-lg">{dictionary.baseMaterialsHeader}</h3>
          {baseMaterials.length > 0 ? (
             <ul className="list-disc pl-5 space-y-1 mb-6">
                {baseMaterials.map(mat => (
                <li key={mat} className="text-sm">{mat} <span className="text-xs text-muted-foreground">(Base)</span></li>
                ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm mb-6">{dictionary.noBaseYet || "No base materials found in current products."}</p>
          )}
          
          <h3 className="font-semibold mb-2 text-lg">{dictionary.customMaterialsHeader}</h3>
          {customMaterials.filter(c => !baseMaterials.includes(c)).length === 0 ? (
            <p className="text-muted-foreground text-sm">{dictionary.noCustomYet}</p>
          ) : (
            <ul className="space-y-2">
              {customMaterials.filter(c => !baseMaterials.includes(c)).map(mat => (
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

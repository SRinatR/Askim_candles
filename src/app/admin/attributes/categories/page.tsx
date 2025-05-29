
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react"; // Removed AlertTriangle as it's not used directly here
import { useToast } from "@/hooks/use-toast";
import { mockCategories, mockProducts } from '@/lib/mock-data';
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

const LOCAL_STORAGE_KEY_CUSTOM_CATEGORIES = "askimAdminCustomCategories";
type ManageCategoriesDict = typeof enAdminMessages.adminManageCategoriesPage;

// This type is for the strings used within the AlertDialog component
type AlertDialogStrings = {
  confirmDeleteTitle: string;
  confirmDeleteCategoryInUse: string;
  confirmDeleteGeneral: string; // Added for general case
  cancelButton: string;
  deleteConfirmButton: string;
};


export default function AdminManageCategoriesPage() {
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();
  const [dictionary, setDictionary] = useState<ManageCategoriesDict | null>(null);
  const [alertStrings, setAlertStrings] = useState<AlertDialogStrings | null>(null);


  useEffect(() => {
    const storedLocale = localStorage.getItem('admin-lang') as AdminLocale | null;
    const localeToLoad = storedLocale && i18nAdmin.locales.includes(storedLocale) ? storedLocale : i18nAdmin.defaultLocale;
    
    async function loadDictionary() {
      const fullDict = await getAdminDictionary(localeToLoad);
      setDictionary(fullDict.adminManageCategoriesPage);
      // Ensure all keys for alertStrings are present or provide fallbacks
      setAlertStrings({
        confirmDeleteTitle: fullDict.adminManageCategoriesPage.confirmDeleteTitle || "Confirm Deletion",
        confirmDeleteCategoryInUse: fullDict.adminManageCategoriesPage.confirmDeleteCategoryInUse || "The category '{attributeName}' is currently used by one or more products. Deleting it means these products will no longer be associated with this category and may need to be updated manually. Are you sure you want to delete it?",
        confirmDeleteGeneral: fullDict.adminManageCategoriesPage.confirmDeleteGeneral || "Are you sure you want to delete the category \"{name}\"?",
        cancelButton: fullDict.adminManageCategoriesPage.cancelButton || "Cancel",
        deleteConfirmButton: fullDict.adminManageCategoriesPage.deleteConfirmButton || "Delete",
      });
    }
    loadDictionary();

    const storedCategories = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_CATEGORIES);
    if (storedCategories) {
      setCustomCategories(JSON.parse(storedCategories));
    } else {
      // Seed from mockCategories if localStorage is empty
      const initialMockCategoryNames = mockCategories.map(cat => cat.name);
      setCustomCategories(initialMockCategoryNames);
      localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_CATEGORIES, JSON.stringify(initialMockCategoryNames));
    }
  }, []);

  const baseCategories = useMemo(() => {
    return mockCategories.map(cat => cat.name);
  }, []);

  const isCategoryInUse = (categoryName: string): boolean => {
    return mockProducts.some(product => product.category === categoryName);
  };

  const handleAddCategory = () => {
    if (!dictionary) return;
    if (!newCategoryName.trim()) {
      toast({ title: "Error", description: dictionary.errorEmptyName, variant: "destructive" });
      return;
    }
    const categoryExists = customCategories.some(
      (cat) => cat.toLowerCase() === newCategoryName.trim().toLowerCase()
    );
    if (categoryExists) {
      toast({ title: "Error", description: dictionary.errorExists, variant: "destructive" });
      return;
    }
    const updatedCategories = [...customCategories, newCategoryName.trim()];
    setCustomCategories(updatedCategories);
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_CATEGORIES, JSON.stringify(updatedCategories));
    setNewCategoryName("");
    toast({ title: dictionary.addSuccessTitle, description: dictionary.addSuccess.replace('{name}', newCategoryName.trim()) });
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    if (!dictionary) return;
    const updatedCategories = customCategories.filter(cat => cat !== categoryToDelete);
    setCustomCategories(updatedCategories);
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_CATEGORIES, JSON.stringify(updatedCategories));
    toast({ title: dictionary.deleteSuccessTitle, description: dictionary.deleteSuccess.replace('{name}', categoryToDelete) });
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
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder={dictionary.inputPlaceholder}
            className="flex-grow"
          />
          <Button onClick={handleAddCategory}><PlusCircle className="mr-2 h-4 w-4" /> {dictionary.addButton}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.existingTitle}</CardTitle>
          <CardDescription>{dictionary.existingDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2 text-lg">{dictionary.baseCategoriesHeader}</h3>
          {baseCategories.length > 0 ? (
             <ul className="list-disc pl-5 space-y-1 mb-6">
                {baseCategories.map(cat => (
                <li key={cat} className="text-sm">{cat} <span className="text-xs text-muted-foreground">(Base)</span></li>
                ))}
            </ul>
          ) : (
             <p className="text-muted-foreground text-sm mb-6">{dictionary.noBaseYet || "No base categories found."}</p>
          )}
         

          <h3 className="font-semibold mb-2 text-lg">{dictionary.customCategoriesHeader}</h3>
          {customCategories.filter(c => !baseCategories.includes(c)).length === 0 ? (
            <p className="text-muted-foreground text-sm">{dictionary.noCustomYet}</p>
          ) : (
            <ul className="space-y-2">
              {customCategories.filter(c => !baseCategories.includes(c)).map(cat => (
                <li key={cat} className="flex items-center justify-between p-2 border rounded-md text-sm">
                  <span>{cat}</span>
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
                          {isCategoryInUse(cat) 
                            ? alertStrings.confirmDeleteCategoryInUse.replace('{attributeName}', cat)
                            : alertStrings.confirmDeleteGeneral.replace('{name}', cat)
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{alertStrings.cancelButton}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(cat)} className="bg-destructive hover:bg-destructive/90">{alertStrings.deleteConfirmButton}</AlertDialogAction>
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

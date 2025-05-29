
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";
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

const LOCAL_STORAGE_KEY_CATEGORIES = "askimAdminCustomCategories"; // Renamed for clarity
type ManageCategoriesDict = typeof enAdminMessages.adminManageCategoriesPage;

type AlertDialogStrings = {
  confirmDeleteTitle: string;
  confirmDeleteCategoryInUse: string;
  confirmDeleteGeneral: string;
  cancelButton: string;
  deleteConfirmButton: string;
};

export default function AdminManageCategoriesPage() {
  const [allCategories, setAllCategories] = useState<string[]>([]);
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
      setAlertStrings({
        confirmDeleteTitle: fullDict.adminManageCategoriesPage.confirmDeleteTitle || "Confirm Deletion",
        confirmDeleteCategoryInUse: fullDict.adminManageCategoriesPage.confirmDeleteCategoryInUse || "The category '{attributeName}' is currently used. Deleting it may affect products. Sure?",
        confirmDeleteGeneral: fullDict.adminManageCategoriesPage.confirmDeleteGeneral || "Are you sure you want to delete the category \"{name}\"?",
        cancelButton: fullDict.adminManageCategoriesPage.cancelButton || "Cancel",
        deleteConfirmButton: fullDict.adminManageCategoriesPage.deleteConfirmButton || "Delete",
      });
    }
    loadDictionary();

    let storedCategories = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
    if (!storedCategories) {
      const initialMockCategoryNames = mockCategories.map(cat => cat.name);
      localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(initialMockCategoryNames));
      storedCategories = JSON.stringify(initialMockCategoryNames);
    }
    setAllCategories(JSON.parse(storedCategories));

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
    const categoryExists = allCategories.some(
      (cat) => cat.toLowerCase() === newCategoryName.trim().toLowerCase()
    );
    if (categoryExists) {
      toast({ title: "Error", description: dictionary.errorExists, variant: "destructive" });
      return;
    }
    const updatedCategories = [...allCategories, newCategoryName.trim()];
    setAllCategories(updatedCategories);
    localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(updatedCategories));
    setNewCategoryName("");
    toast({ title: dictionary.addSuccessTitle, description: dictionary.addSuccess.replace('{name}', newCategoryName.trim()) });
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    if (!dictionary) return;
    const updatedCategories = allCategories.filter(cat => cat !== categoryToDelete);
    setAllCategories(updatedCategories);
    localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(updatedCategories));
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
          {allCategories.length === 0 ? (
            <p className="text-muted-foreground text-sm">{dictionary.noCustomYet || "No categories added yet."}</p>
          ) : (
            <ul className="space-y-2">
              {allCategories.map(cat => (
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

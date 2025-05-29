
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockCategories } from '@/lib/mock-data'; // To display base categories

const LOCAL_STORAGE_KEY_CUSTOM_CATEGORIES = "askimAdminCustomCategories";

// TODO: Localize admin page texts
export default function AdminManageCategoriesPage() {
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedCategories = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_CATEGORIES);
    if (storedCategories) {
      setCustomCategories(JSON.parse(storedCategories));
    }
  }, []);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Error", description: "Category name cannot be empty.", variant: "destructive" });
      return;
    }
    if (mockCategories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase()) || customCategories.includes(newCategoryName.trim())) {
      toast({ title: "Error", description: "Category already exists.", variant: "destructive" });
      return;
    }
    const updatedCategories = [...customCategories, newCategoryName.trim()];
    setCustomCategories(updatedCategories);
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_CATEGORIES, JSON.stringify(updatedCategories));
    setNewCategoryName("");
    toast({ title: "Category Added", description: `"${newCategoryName.trim()}" has been added.` });
  };

  const handleDeleteCustomCategory = (categoryToDelete: string) => {
    const updatedCategories = customCategories.filter(cat => cat !== categoryToDelete);
    setCustomCategories(updatedCategories);
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_CATEGORIES, JSON.stringify(updatedCategories));
    toast({ title: "Category Deleted", description: `"${categoryToDelete}" has been deleted.` });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Product Categories</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
          <CardDescription>Create a new category for your products.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-grow"
          />
          <Button onClick={handleAddCategory}><PlusCircle className="mr-2 h-4 w-4" /> Add Category</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
          <CardDescription>Base categories are fixed. Custom categories can be deleted.</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2 text-lg">Base Categories</h3>
          <ul className="list-disc pl-5 space-y-1 mb-6">
            {mockCategories.map(cat => (
              <li key={cat.id} className="text-sm">{cat.name}</li>
            ))}
          </ul>

          <h3 className="font-semibold mb-2 text-lg">Custom Categories</h3>
          {customCategories.length === 0 ? (
            <p className="text-muted-foreground text-sm">No custom categories added yet.</p>
          ) : (
            <ul className="space-y-2">
              {customCategories.map(cat => (
                <li key={cat} className="flex items-center justify-between p-2 border rounded-md text-sm">
                  <span>{cat}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCustomCategory(cat)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
       <p className="text-sm text-muted-foreground text-center">
        Note: Custom categories are stored in browser localStorage and are for simulated selection in product forms.
      </p>
    </div>
  );
}

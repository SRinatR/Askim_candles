
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from '@/lib/mock-data';

const LOCAL_STORAGE_KEY_CUSTOM_MATERIALS = "askimAdminCustomMaterials";

// TODO: Localize admin page texts
export default function AdminManageMaterialsPage() {
  const [customMaterials, setCustomMaterials] = useState<string[]>([]);
  const [newMaterialName, setNewMaterialName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedMaterials = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_MATERIALS);
    if (storedMaterials) {
      setCustomMaterials(JSON.parse(storedMaterials));
    }
  }, []);

  const initialMaterialsFromProducts = useMemo(() => {
    const materials = mockProducts
      .map(p => p.material)
      .filter((m): m is string => typeof m === 'string' && m.trim() !== '');
    return Array.from(new Set(materials)).sort();
  }, []);


  const handleAddMaterial = () => {
    if (!newMaterialName.trim()) {
      toast({ title: "Error", description: "Material name cannot be empty.", variant: "destructive" });
      return;
    }
    if (initialMaterialsFromProducts.map(m=>m.toLowerCase()).includes(newMaterialName.trim().toLowerCase()) || customMaterials.map(m=>m.toLowerCase()).includes(newMaterialName.trim().toLowerCase())) {
      toast({ title: "Error", description: "Material already exists.", variant: "destructive" });
      return;
    }
    const updatedMaterials = [...customMaterials, newMaterialName.trim()];
    setCustomMaterials(updatedMaterials);
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_MATERIALS, JSON.stringify(updatedMaterials));
    setNewMaterialName("");
    toast({ title: "Material Added", description: `"${newMaterialName.trim()}" has been added.` });
  };

  const handleDeleteCustomMaterial = (materialToDelete: string) => {
    const updatedMaterials = customMaterials.filter(mat => mat !== materialToDelete);
    setCustomMaterials(updatedMaterials);
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_MATERIALS, JSON.stringify(updatedMaterials));
    toast({ title: "Material Deleted", description: `"${materialToDelete}" has been deleted.` });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Product Materials</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Material</CardTitle>
          <CardDescription>Create a new material option for your products.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            value={newMaterialName}
            onChange={(e) => setNewMaterialName(e.target.value)}
            placeholder="New material name"
            className="flex-grow"
          />
          <Button onClick={handleAddMaterial}><PlusCircle className="mr-2 h-4 w-4" /> Add Material</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Materials</CardTitle>
          <CardDescription>Base materials (from existing products) are fixed. Custom materials can be deleted.</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2 text-lg">Base Materials (from products)</h3>
          {initialMaterialsFromProducts.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 mb-6">
              {initialMaterialsFromProducts.map(mat => (
                <li key={mat} className="text-sm">{mat}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm mb-6">No base materials found in current products.</p>
          )}


          <h3 className="font-semibold mb-2 text-lg">Custom Materials</h3>
          {customMaterials.length === 0 ? (
            <p className="text-muted-foreground text-sm">No custom materials added yet.</p>
          ) : (
            <ul className="space-y-2">
              {customMaterials.map(mat => (
                <li key={mat} className="flex items-center justify-between p-2 border rounded-md text-sm">
                  <span>{mat}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCustomMaterial(mat)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
       <p className="text-sm text-muted-foreground text-center">
        Note: Custom materials are stored in browser localStorage and are for simulated selection in product forms.
      </p>
    </div>
  );
}

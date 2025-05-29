
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from '@/lib/mock-data';

const LOCAL_STORAGE_KEY_CUSTOM_SCENTS = "askimAdminCustomScents";

// TODO: Localize admin page texts
export default function AdminManageScentsPage() {
  const [customScents, setCustomScents] = useState<string[]>([]);
  const [newScentName, setNewScentName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedScents = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_SCENTS);
    if (storedScents) {
      setCustomScents(JSON.parse(storedScents));
    }
  }, []);

  const initialScentsFromProducts = useMemo(() => {
    const scents = mockProducts
      .map(p => p.scent)
      .filter((s): s is string => typeof s === 'string' && s.trim() !== '');
    return Array.from(new Set(scents)).sort();
  }, []);

  const handleAddScent = () => {
    if (!newScentName.trim()) {
      toast({ title: "Error", description: "Scent name cannot be empty.", variant: "destructive" });
      return;
    }
     if (initialScentsFromProducts.map(s=>s.toLowerCase()).includes(newScentName.trim().toLowerCase()) || customScents.map(s=>s.toLowerCase()).includes(newScentName.trim().toLowerCase())) {
      toast({ title: "Error", description: "Scent already exists.", variant: "destructive" });
      return;
    }
    const updatedScents = [...customScents, newScentName.trim()];
    setCustomScents(updatedScents);
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_SCENTS, JSON.stringify(updatedScents));
    setNewScentName("");
    toast({ title: "Scent Added", description: `"${newScentName.trim()}" has been added.` });
  };

  const handleDeleteCustomScent = (scentToDelete: string) => {
    const updatedScents = customScents.filter(scent => scent !== scentToDelete);
    setCustomScents(updatedScents);
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_SCENTS, JSON.stringify(updatedScents));
    toast({ title: "Scent Deleted", description: `"${scentToDelete}" has been deleted.` });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Product Scents</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Scent</CardTitle>
          <CardDescription>Create a new scent option for your products.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            value={newScentName}
            onChange={(e) => setNewScentName(e.target.value)}
            placeholder="New scent name"
            className="flex-grow"
          />
          <Button onClick={handleAddScent}><PlusCircle className="mr-2 h-4 w-4" /> Add Scent</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Scents</CardTitle>
          <CardDescription>Base scents (from existing products) are fixed. Custom scents can be deleted.</CardDescription>
        </CardHeader>
        <CardContent>
           <h3 className="font-semibold mb-2 text-lg">Base Scents (from products)</h3>
           {initialScentsFromProducts.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 mb-6">
                {initialScentsFromProducts.map(scent => (
                <li key={scent} className="text-sm">{scent}</li>
                ))}
            </ul>
            ) : (
              <p className="text-muted-foreground text-sm mb-6">No base scents found in current products.</p>
            )}

          <h3 className="font-semibold mb-2 text-lg">Custom Scents</h3>
          {customScents.length === 0 ? (
            <p className="text-muted-foreground text-sm">No custom scents added yet.</p>
          ) : (
            <ul className="space-y-2">
              {customScents.map(scent => (
                <li key={scent} className="flex items-center justify-between p-2 border rounded-md text-sm">
                  <span>{scent}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCustomScent(scent)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground text-center">
        Note: Custom scents are stored in browser localStorage and are for simulated selection in product forms.
      </p>
    </div>
  );
}

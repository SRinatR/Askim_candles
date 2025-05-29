
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>
          <p className="text-muted-foreground">
            Add, edit, or remove products from your store catalog.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Product (Coming Soon)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>Below is the list of all products in your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Product table and management features are in development.</p>
          {/* Placeholder for product table / list */}
          <div className="mt-4 p-8 border-2 border-dashed border-border rounded-md text-center text-muted-foreground">
            Product listing will appear here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

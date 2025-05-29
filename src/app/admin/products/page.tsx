
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockProducts } from "@/lib/mock-data"; // We'll use mock data for now
import type { Product } from "@/lib/types";
import { PlusCircle, Edit3, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

// TODO: Localize texts when admin i18n is fully implemented
// For now, using English / simple placeholders

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteProduct = (productId: string) => {
    // Simulate deletion
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({
      title: "Product Deleted (Simulated)",
      description: `Product with ID ${productId} has been 'deleted'. This change is client-side only.`,
    });
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>
          <p className="text-muted-foreground">
            Add, edit, or remove products from your store catalog.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            Displaying {filteredProducts.length} of {products.length} products. Product data is currently mocked.
          </CardDescription>
           <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search products by name or category..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{product.stock}</TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Edit3 className="mr-1 h-3 w-3" /> Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">No products found matching your search.</p>
          )}
        </CardContent>
      </Card>
       <p className="text-sm text-muted-foreground text-center">
          Note: All product data and operations are simulated on the client-side and will reset on page refresh.
        </p>
    </div>
  );
}

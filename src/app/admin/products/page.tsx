
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { PlusCircle, Edit3, Trash2, Search, Eye } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { logAdminAction } from '@/admin/lib/admin-logger'; // Assuming logger path

// TODO: Localize texts when admin i18n is fully implemented

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentAdminUser } = useAdminAuth();

  // Client-side filtering
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = (productId: string, productName: string) => {
    // Simulate deletion
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (currentAdminUser?.email) {
      logAdminAction(currentAdminUser.email, "Product Deleted (Simulated)", { productId, productName });
    }
    toast({
      title: "Product Deleted (Simulated)",
      description: `Product "${productName}" (ID: ${productId}) has been 'deleted'. This change is client-side only.`,
    });
  };

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
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price (UZS)</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                        <Image 
                          src={product.images[0] || "https://placehold.co/100x100.png?text=No+Image"} 
                          alt={product.name} 
                          fill
                          sizes="48px"
                          className="object-cover"
                          data-ai-hint="product thumbnail"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">{product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{product.stock}</TableCell>
                    <TableCell className="text-center space-x-1">
                      <Button variant="outline" size="sm" asChild title={`Edit ${product.name}`}>
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Edit3 className="mr-1 h-3 w-3" /> Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive" 
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        title={`Delete ${product.name}`}
                      >
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

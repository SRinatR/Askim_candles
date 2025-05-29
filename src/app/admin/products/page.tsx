
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { PlusCircle, Edit3, Trash2, Search } from "lucide-react"; // Removed Eye, ToggleLeft, ToggleRight
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { logAdminAction } from '@/admin/lib/admin-logger';
import type { Locale } from "@/lib/i1n-config"; // Import Locale

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentAdminUser } = useAdminAuth();
  const [adminLocale, setAdminLocale] = useState<Locale>('en');

  useEffect(() => {
    const storedLocale = localStorage.getItem('admin-lang') as Locale | null;
    if (storedLocale) {
      setAdminLocale(storedLocale);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
        const nameInAdminLocale = product.name[adminLocale] || product.name.en || '';
        const category = product.category || ''; // Assuming category is a simple string for now
        const sku = product.sku || '';
        return (
            nameInAdminLocale.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });
  }, [products, searchTerm, adminLocale]);

  const handleDeleteProduct = (productId: string, productNameObj: Product['name']) => {
    const productName = productNameObj[adminLocale] || productNameObj.en;
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (currentAdminUser?.email) {
      logAdminAction(currentAdminUser.email, "Product Deleted (Simulated)", { productId, productName });
    }
    toast({
      title: "Product Deleted (Simulated)",
      description: `Product "${productName}" (ID: ${productId}) has been 'deleted'. This change is client-side only.`,
    });
  };

  const toggleProductStatus = (productId: string) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, isActive: !product.isActive } : product
      )
    );
    const product = products.find(p => p.id === productId);
    if (product && currentAdminUser?.email) {
      const productName = product.name[adminLocale] || product.name.en;
      logAdminAction(currentAdminUser.email, `Product ${product.isActive ? "Deactivated" : "Activated"} (Simulated)`, { productId: product.id, productName });
    }
    toast({
      title: `Product Status Changed (Simulated)`,
      description: `Product "${product?.name[adminLocale] || product?.name.en}" is now ${product?.isActive ? "Inactive" : "Active"}. Client-side only.`,
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
              placeholder="Search by name, category, or SKU..."
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
                  <TableHead className="w-[60px]">Image</TableHead>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[120px]">SKU</TableHead>
                  <TableHead>Name ({adminLocale.toUpperCase()})</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price (UZS)</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 rounded-md overflow-hidden border">
                        <Image
                          src={product.mainImage || product.images[0] || "https://placehold.co/100x100.png?text=No+Image"}
                          alt={product.name[adminLocale] || product.name.en || 'Product Image'}
                          fill
                          sizes="40px"
                          className="object-cover"
                          data-ai-hint="product thumbnail"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{product.id}</TableCell>
                    <TableCell className="text-xs">{product.sku || '-'}</TableCell>
                    <TableCell className="font-medium">{product.name[adminLocale] || product.name.en}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">{product.price.toLocaleString('en-US')}</TableCell>
                    <TableCell className="text-center">{product.stock}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Switch
                          id={`status-${product.id}`}
                          checked={product.isActive}
                          onCheckedChange={() => toggleProductStatus(product.id)}
                          aria-label={product.isActive ? "Deactivate product" : "Activate product"}
                        />
                        <Badge variant={product.isActive ? "secondary" : "outline"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center space-x-1">
                      <Button variant="outline" size="sm" asChild title={`Edit ${product.name[adminLocale] || product.name.en}`}>
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Edit3 className="mr-1 h-3 w-3" /> Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        title={`Delete ${product.name[adminLocale] || product.name.en}`}
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

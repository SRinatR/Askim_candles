
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import React, { useEffect } from "react";

// TODO: Localize texts when admin i18n is fully implemented

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string().min(1, { message: "Please select a category." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
  stock: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer." }),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      imageUrl: "",
      stock: 0,
    },
  });

  const { register, handleSubmit, control, formState: { errors }, reset } = form;

  useEffect(() => {
    const productToEdit = mockProducts.find(p => p.id === productId);
    if (productToEdit) {
      reset({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        category: productToEdit.category,
        imageUrl: productToEdit.images[0] || "", // Assuming first image is the main one
        stock: productToEdit.stock,
      });
    } else {
      toast({ title: "Error", description: "Product not found.", variant: "destructive" });
      router.push("/admin/products");
    }
  }, [productId, reset, router, toast]);

  const onSubmit = (data: ProductFormValues) => {
    console.log("Updated Product Data (Simulated):", data);
    toast({
      title: "Product Updated (Simulated)",
      description: `${data.name} has been 'updated'. This change is client-side only.`,
    });
    router.push("/admin/products");
  };
  
  if (!form.formState.defaultValues?.name && !productId) { // Basic check if product data hasn't loaded
      return <div className="flex justify-center items-center min-h-[300px]"><p>Loading product data...</p></div>;
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground">Modify the details for product ID: {productId}.</p>
        </div>
        <Button variant="outline" asChild>
            <Link href="/admin/products">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Update information for this product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" {...register("price")} />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" type="number" {...register("stock")} />
                {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" {...register("imageUrl")} />
              {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
            </div>

          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <Save className="mr-2 h-4 w-4" /> 
             {form.formState.isSubmitting ? "Saving..." : "Save Changes (Simulated)"}
          </Button>
        </div>
      </form>
      <p className="text-sm text-muted-foreground text-center pt-4">
          Note: Product updates are simulated and data will not persist beyond this session.
        </p>
    </div>
  );
}

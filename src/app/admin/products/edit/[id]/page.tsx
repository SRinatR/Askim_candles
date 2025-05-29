
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { ImageUploadArea } from '@/components/admin/ImageUploadArea';

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  sku: z.string().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number (in UZS)." }),
  category: z.string().min(1, { message: "Please select a category." }),
  stock: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer." }),
  images: z.array(z.string().url({message: "Each image must be a valid URL."})).min(1, { message: "At least one image is required." }),
  mainImageId: z.string().optional(), // This will store the ID/URL of the main image from the 'images' array
  scent: z.string().optional(),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  burningTime: z.string().optional(),
  isActive: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const formMethods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset, setValue, watch } = formMethods;

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === productId);
    if (foundProduct) {
      setProductToEdit(foundProduct);
      const initialImageUrls = foundProduct.images || [];
      // The mainImageId should correspond to one of the URLs in initialImageUrls
      const initialMainImageUrl = foundProduct.mainImage || (initialImageUrls.length > 0 ? initialImageUrls[0] : undefined);

      reset({
        name: foundProduct.name,
        sku: foundProduct.sku || "",
        description: foundProduct.description,
        price: foundProduct.price,
        category: foundProduct.category,
        stock: foundProduct.stock,
        images: initialImageUrls,
        mainImageId: initialMainImageUrl,
        scent: foundProduct.scent || "",
        material: foundProduct.material || "",
        dimensions: foundProduct.dimensions || "",
        burningTime: foundProduct.burningTime || "",
        isActive: foundProduct.isActive === undefined ? true : foundProduct.isActive,
      });
    } else {
      toast({ title: "Error", description: "Product not found.", variant: "destructive" });
      router.push("/admin/products");
    }
  }, [productId, reset, router, toast]);


  const onSubmit = (data: ProductFormValues) => {
    console.log("Updated Product Data (Simulated):", { id: productId, ...data });
    toast({
      title: "Product Updated (Simulated)",
      description: `${data.name} has been 'updated'. This change is client-side only. Image data in console.`,
    });
    router.push("/admin/products");
  };

  if (!productToEdit) {
    return <div className="flex justify-center items-center min-h-[300px]"><p>Loading product data...</p></div>;
  }

  return (
    <FormProvider {...formMethods}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground">Product ID: {productId}</p>
        </div>
        <Button variant="outline" asChild>
            <Link href="/admin/products">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Update information for this product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                        <Input id="sku" {...register("sku")} />
                        {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price (UZS)</Label>
                        <Input id="price" type="number" step="1" {...register("price")} />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="scent">Scent</Label>
                            <Input id="scent" {...register("scent")} />
                            {errors.scent && <p className="text-sm text-destructive">{errors.scent.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="material">Material</Label>
                            <Input id="material" {...register("material")} />
                            {errors.material && <p className="text-sm text-destructive">{errors.material.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dimensions">Dimensions</Label>
                            <Input id="dimensions" {...register("dimensions")} />
                            {errors.dimensions && <p className="text-sm text-destructive">{errors.dimensions.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="burningTime">Burning Time</Label>
                            <Input id="burningTime" {...register("burningTime")} />
                            {errors.burningTime && <p className="text-sm text-destructive">{errors.burningTime.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="isActive" className="flex items-center">
                        Product Status
                        <Controller
                          name="isActive"
                          control={control}
                          render={({ field }) => (
                            <Switch
                              id="isActive"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="ml-3"
                            />
                          )}
                        />
                        <span className="ml-2 text-sm text-muted-foreground">({watch("isActive") ? "Active" : "Inactive"})</span>
                      </Label>
                       {errors.isActive && <p className="text-sm text-destructive">{errors.isActive.message}</p>}
                    </div>
                </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>Upload new images or manage existing ones. Select a main image.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Controller
                            name="images"
                            control={control}
                            render={({ field }) => (
                            <ImageUploadArea
                                onImagesChange={(imagesData, mainImgUrlFromUploadArea) => {
                                    // imagesData contains { file: File, preview: string (Data URL), id: string }
                                    // We need to store an array of URLs (which will be Data URLs for new uploads)
                                    const newImagePreviews = imagesData.map(img => img.preview);
                                    setValue("images", newImagePreviews, { shouldValidate: true });
                                    // mainImageId in the form should now store the URL of the selected main image
                                    setValue("mainImageId", mainImgUrlFromUploadArea);
                                }}
                                maxFiles={5}
                                initialImageUrls={productToEdit.images}
                                initialMainImageUrl={watch("mainImageId") || productToEdit.mainImage || (productToEdit.images && productToEdit.images.length > 0 ? productToEdit.images[0] : undefined)}
                            />
                            )}
                        />
                        {errors.images && <p className="text-sm text-destructive mt-2">{errors.images.message}</p>}
                         {/* {errors.mainImageId && <p className="text-sm text-destructive mt-2">{errors.mainImageId.message}</p>} */}
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
             {isSubmitting ? "Saving..." : "Save Changes (Simulated)"}
          </Button>
        </div>
      </form>
      <p className="text-sm text-muted-foreground text-center pt-4">
          Note: Product updates are simulated. Image data (as Data URLs for new uploads, or existing URLs) will be logged to console but not persisted in mock data.
        </p>
    </div>
    </FormProvider>
  );
}

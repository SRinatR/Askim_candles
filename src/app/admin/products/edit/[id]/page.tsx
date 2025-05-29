
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import type { UploadedImage } from '@/components/admin/ImageUploadArea';
import NextImage from 'next/image'; // Renamed to avoid conflict

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string().min(1, { message: "Please select a category." }),
  stock: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer." }),
  // 'images' will store Data URLs of newly uploaded files or existing URLs if no new uploads
  images: z.array(z.string().url()).min(1, { message: "At least one image is required." }), 
  mainImageId: z.string().optional(), // ID of the image from ImageUploadArea marked as main, or initial main image URL
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>([]);
  const [currentMainImageUrl, setCurrentMainImageUrl] = useState<string | undefined>(undefined);


  const formMethods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    // Default values will be set in useEffect once productToEdit is loaded
  });

  const { register, handleSubmit, control, formState: { errors }, reset, setValue, watch } = formMethods;

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === productId);
    if (foundProduct) {
      setProductToEdit(foundProduct);
      reset({
        name: foundProduct.name,
        description: foundProduct.description,
        price: foundProduct.price,
        category: foundProduct.category,
        stock: foundProduct.stock,
        images: foundProduct.images, // Keep existing URLs initially
        mainImageId: foundProduct.images[0], // Default to first existing image URL as main
      });
      setCurrentImageUrls(foundProduct.images);
      setCurrentMainImageUrl(foundProduct.images[0]);
    } else {
      toast({ title: "Error", description: "Product not found.", variant: "destructive" });
      router.push("/admin/products");
    }
  }, [productId, reset, router, toast]);

  const handleImageUploads = (newImagesData: UploadedImage[], newMainImageId?: string) => {
    // If new images are uploaded, they replace the old ones in the form.
    // The `ImageUploadArea` passes Data URLs in `newImagesData[n].preview`.
    // It also passes its internal ID for the main image.
    const newImagePreviews = newImagesData.map(img => img.preview);
    setValue("images", newImagePreviews, { shouldValidate: true });

    if (newMainImageId) {
        // The newMainImageId from ImageUploadArea is an internal ID. 
        // We need to find the corresponding preview URL to store in form's mainImageId
        const mainImgObject = newImagesData.find(img => img.id === newMainImageId);
        setValue("mainImageId", mainImgObject ? mainImgObject.preview : (newImagePreviews.length > 0 ? newImagePreviews[0] : undefined) );
    } else if (newImagePreviews.length > 0) {
        setValue("mainImageId", newImagePreviews[0]);
    } else {
        setValue("mainImageId", undefined);
    }
  };

  const onSubmit = (data: ProductFormValues) => {
    console.log("Updated Product Data (Simulated):", data);
    // In a real app, update backend. Here, simulate with toast.
    // If data.images contains Data URLs, they would be uploaded.
    // If it still contains original URLs (no new uploads), those would be preserved.
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
            <p className="text-muted-foreground">Modify the details for product ID: {productId}.</p>
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
                </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>Current images are shown below. Upload new images to replace them.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {currentImageUrls.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-medium mb-2">Current Images:</p>
                                <div className="flex flex-wrap gap-2">
                                    {currentImageUrls.map((url, index) => (
                                        <div key={index} className="relative w-20 h-20 rounded border overflow-hidden">
                                            <NextImage src={url} alt={`Current product image ${index + 1}`} fill sizes="80px" className="object-cover" />
                                            {url === currentMainImageUrl && (
                                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded-bl-sm">Main</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Controller
                            name="images" // This field will be managed by ImageUploadArea's callback
                            control={control}
                            render={({ field }) => (
                            <ImageUploadArea 
                                onImagesChange={(imagesData, mainImgIdFromUpload) => {
                                  const newImagePreviews = imagesData.map(img => img.preview);
                                  setValue("images", newImagePreviews, { shouldValidate: true });
                                  
                                  const mainImgObj = imagesData.find(img => img.id === mainImgIdFromUpload);
                                  const finalMainImage = mainImgObj ? mainImgObj.preview : (newImagePreviews.length > 0 ? newImagePreviews[0] : undefined);
                                  setValue("mainImageId", finalMainImage);
                                }}
                                maxFiles={5}
                                // For edit, we don't pass initialImageUrls to ImageUploadArea directly
                                // as it handles File objects. We display current URLs separately.
                            />
                            )}
                        />
                        {errors.images && <p className="text-sm text-destructive mt-2">{errors.images.message}</p>}
                         {errors.mainImageId && <p className="text-sm text-destructive mt-2">{errors.mainImageId.message}</p>}
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={formState.isSubmitting}>
            <Save className="mr-2 h-4 w-4" /> 
             {formState.isSubmitting ? "Saving..." : "Save Changes (Simulated)"}
          </Button>
        </div>
      </form>
      <p className="text-sm text-muted-foreground text-center pt-4">
          Note: Product updates are simulated. Image data (as Data URLs) will be logged to console but not persisted.
        </p>
    

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller, FormProvider } from "react-hook-form"; // Added FormProvider here
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { mockCategories } from "@/lib/mock-data";
import { ImageUploadArea } from '@/components/admin/ImageUploadArea';
import type { UploadedImage } from '@/components/admin/ImageUploadArea';
import React, { useEffect } from "react"; // Ensure React is imported

// Updated Zod schema for products
const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string().min(1, { message: "Please select a category." }),
  stock: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer." }),
  images: z.array(z.string().url({message: "Each image must be a valid URL (Data URL in this case)."})).min(1, { message: "At least one image is required." }),
  mainImageId: z.string().optional(), // ID/URL of the image marked as main
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const formMethods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      images: [],
      mainImageId: undefined,
    },
  });

  const { register, handleSubmit, control, formState: { errors }, setValue, watch, getValues } = formMethods;
  
  const watchedImages = watch("images");
  const watchedMainImageId = watch("mainImageId");

  // This useEffect was intended to set a default main image if none was selected
  // but images were present. The logic inside ImageUploadArea itself should handle
  // defaulting the main image if necessary upon initial image upload.
  // The form's mainImageId should primarily be set by the onImagesChange callback.
  // useEffect(() => {
  //   if (watchedImages && watchedImages.length > 0 && !watchedMainImageId) {
  //     // This might be redundant if ImageUploadArea handles it
  //   }
  // }, [watchedImages, watchedMainImageId, setValue]);


  const onSubmit = (data: ProductFormValues) => {
    console.log("New Product Data (Simulated):", data);
    toast({
      title: "Product Added (Simulated)",
      description: `${data.name} has been 'added'. This change is client-side only. Image data URLs are in console.`,
    });
    router.push("/admin/products"); 
  };

  return (
    <FormProvider {...formMethods}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
              <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
              <p className="text-muted-foreground">Fill in the details for the new product.</p>
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
                  <CardDescription>Provide essential information for the product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" {...register("name")} placeholder="e.g., Lavender Bliss Candle" />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} placeholder="Describe the product..." />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input id="price" type="number" step="0.01" {...register("price")} placeholder="0.00" />
                      {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input id="stock" type="number" {...register("stock")} placeholder="0" />
                      {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <CardDescription>Upload images for the product. Select a main image.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Controller
                    name="images" 
                    control={control}
                    render={({ field }) => (
                      <ImageUploadArea 
                        onImagesChange={(imagesData, mainImgIdFromUpload) => {
                          // imagesData is UploadedImage[] where preview is Data URL
                          // mainImgIdFromUpload is the ID (string) of the main image from ImageUploadArea
                          const newImagePreviews = imagesData.map(img => img.preview);
                          setValue("images", newImagePreviews, { shouldValidate: true });
                          
                          // Find the Data URL corresponding to mainImgIdFromUpload
                          const mainImgObject = imagesData.find(img => img.id === mainImgIdFromUpload);
                          const finalMainImagePreview = mainImgObject ? mainImgObject.preview : (newImagePreviews.length > 0 ? newImagePreviews[0] : undefined);
                          setValue("mainImageId", finalMainImagePreview);
                        }}
                        maxFiles={5}
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
              {formState.isSubmitting ? "Saving..." : "Save Product (Simulated)"}
            </Button>
          </div>
        </form>
        <p className="text-sm text-muted-foreground text-center pt-4">
            Note: Product creation is simulated. Image data (as Data URLs) will be logged to console but not persisted.
          </p>
      </div>
    </FormProvider>
  );
}

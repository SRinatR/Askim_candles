
"use client";

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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import { ImageUploadArea } from '@/components/admin/ImageUploadArea';
import React, { useEffect, useState, useMemo } from "react"; // Added useEffect, useState, useMemo

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  sku: z.string().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number (in UZS)." }),
  category: z.string().min(1, { message: "Please select a category." }),
  stock: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer." }),
  images: z.array(z.string().url({message: "Each image must be a valid URL (Data URL in this case)."})).min(1, { message: "At least one image is required." }),
  mainImageId: z.string().optional(), // This will store the Data URL of the main image
  scent: z.string().optional(),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  burningTime: z.string().optional(),
  isActive: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

const LOCAL_STORAGE_KEY_CUSTOM_CATEGORIES = "askimAdminCustomCategories";
const LOCAL_STORAGE_KEY_CUSTOM_MATERIALS = "askimAdminCustomMaterials";
const LOCAL_STORAGE_KEY_CUSTOM_SCENTS = "askimAdminCustomScents";


export default function NewProductPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string; slug: string }[]>(mockCategories);
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([]);
  const [availableScents, setAvailableScents] = useState<string[]>([]);


  useEffect(() => {
    // Load custom categories
    const storedCustomCategories = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_CATEGORIES);
    const customCats = storedCustomCategories ? JSON.parse(storedCustomCategories) : [];
    const combinedCategories = [
      ...mockCategories,
      ...customCats.map((catName: string) => ({ id: catName.toLowerCase().replace(/\s+/g, '-'), name: catName, slug: catName.toLowerCase().replace(/\s+/g, '-') }))
    ];
    // Filter out duplicates by name (preferring mockCategories if names clash)
    const uniqueCombinedCategories = combinedCategories.filter((category, index, self) =>
        index === self.findIndex((c) => c.name === category.name)
    );
    setAvailableCategories(uniqueCombinedCategories);
    
    // Load custom materials and combine with unique materials from mockProducts
    const storedCustomMaterials = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_MATERIALS);
    const customMats = storedCustomMaterials ? JSON.parse(storedCustomMaterials) : [];
    const initialMaterialsFromProducts = Array.from(new Set(mockProducts.map(p => p.material).filter((m): m is string => !!m)));
    const combinedMaterials = Array.from(new Set([...initialMaterialsFromProducts, ...customMats])).sort();
    setAvailableMaterials(combinedMaterials);

    // Load custom scents and combine with unique scents from mockProducts
    const storedCustomScents = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_SCENTS);
    const customScnts = storedCustomScents ? JSON.parse(storedCustomScents) : [];
    const initialScentsFromProducts = Array.from(new Set(mockProducts.map(p => p.scent).filter((s): s is string => !!s)));
    const combinedScents = Array.from(new Set([...initialScentsFromProducts, ...customScnts])).sort();
    setAvailableScents(combinedScents);

  }, []);


  const formMethods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      images: [],
      mainImageId: undefined,
      scent: "",
      material: "",
      dimensions: "",
      burningTime: "",
      isActive: true,
    },
  });

  const { register, handleSubmit, control, formState, setValue, watch } = formMethods;
  const { errors, isSubmitting } = formState;

  const onSubmit = (data: ProductFormValues) => {
    const newProductData = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...data,
      mainImage: data.mainImageId, // Assign mainImageId (which is a URL) to mainImage
    };
    console.log("New Product Data (Simulated):", newProductData);
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" {...register("name")} placeholder="e.g., Lavender Bliss Candle" />
                      {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                      <Input id="sku" {...register("sku")} placeholder="e.g., CAND-LAV-01" />
                      {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} placeholder="Describe the product..." />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (UZS)</Label>
                      <Input id="price" type="number" step="1" {...register("price")} placeholder="0" />
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
                            {availableCategories.map(cat => (
                              <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
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
                         <Controller
                            name="scent"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="scent">
                                    <SelectValue placeholder="Select a scent" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableScents.map(scent => (
                                    <SelectItem key={scent} value={scent}>{scent}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.scent && <p className="text-sm text-destructive">{errors.scent.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="material">Material</Label>
                        <Controller
                            name="material"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="material">
                                    <SelectValue placeholder="Select a material" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableMaterials.map(material => (
                                    <SelectItem key={material} value={material}>{material}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.material && <p className="text-sm text-destructive">{errors.material.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="dimensions">Dimensions</Label>
                        <Input id="dimensions" {...register("dimensions")} placeholder="e.g., 8cm x 10cm" />
                        {errors.dimensions && <p className="text-sm text-destructive">{errors.dimensions.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="burningTime">Burning Time</Label>
                        <Input id="burningTime" {...register("burningTime")} placeholder="e.g., Approx. 45 hours" />
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
                  <CardDescription>Upload images for the product. Select a main image.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Controller
                    name="images" // This name must match the Zod schema
                    control={control}
                    render={({ field }) => (
                      <ImageUploadArea
                        onImagesChange={(imageDataUrls, mainImageDataUrl) => {
                           setValue("images", imageDataUrls, { shouldValidate: true });
                           setValue("mainImageId", mainImageDataUrl); // mainImageId is the URL of the main image
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
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Product (Simulated)"}
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

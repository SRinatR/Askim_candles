"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { ImageUploadArea } from '@/components/admin/ImageUploadArea';
import React, { useEffect, useState } from "react"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const productSchema = z.object({
  name_en: z.string().min(1, { message: "English product name is required." }),
  name_ru: z.string().min(1, { message: "Russian product name is required." }),
  name_uz: z.string().min(1, { message: "Uzbek product name is required." }),
  description_en: z.string().min(1, { message: "English description is required." }),
  description_ru: z.string().min(1, { message: "Russian description is required." }),
  description_uz: z.string().min(1, { message: "Uzbek description is required." }),
  sku: z.string().optional(),
  price: z.coerce.number().positive({ message: "Price must be a positive number (in UZS)." }),
  category: z.string().min(1, { message: "Please select a category." }),
  stock: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer." }),
  images: z.array(z.string().url({message: "Each image must be a valid URL (Data URL in this case)."})).min(1, { message: "At least one image is required." }),
  mainImageId: z.string().optional(), // Will store the ID/URL of the main image
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

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([]);
  const [availableScents, setAvailableScents] = useState<string[]>([]);


  useEffect(() => {
    const storedCustomCategories = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_CATEGORIES);
    setAvailableCategories(storedCustomCategories ? JSON.parse(storedCustomCategories) : []);
    
    const storedCustomMaterials = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_MATERIALS);
    setAvailableMaterials(storedCustomMaterials ? JSON.parse(storedCustomMaterials) : []);

    const storedCustomScents = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_SCENTS);
    setAvailableScents(storedCustomScents ? JSON.parse(storedCustomScents) : []);

  }, []);


  const formMethods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name_en: "", name_ru: "", name_uz: "",
      description_en: "", description_ru: "", description_uz: "",
      sku: "",
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
      name: { en: data.name_en, ru: data.name_ru, uz: data.name_uz },
      description: { en: data.description_en, ru: data.description_ru, uz: data.description_uz },
      sku: data.sku,
      price: data.price,
      category: data.category,
      stock: data.stock,
      images: data.images,
      mainImage: data.mainImageId, 
      scent: data.scent,
      material: data.material,
      dimensions: data.dimensions,
      burningTime: data.burningTime,
      isActive: data.isActive,
      // attributes: data.attributes - if we add custom attributes later
    };
    console.log("New Product Data (Simulated):", newProductData);
    // Here you would typically call an API to save the product
    // For now, we'll just show a toast and redirect
    toast({
      title: "Product Added (Simulated)",
      description: `${data.name_en} has been 'added'. This change is client-side only. Image data URLs are in console.`,
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
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ru">Русский</TabsTrigger>
                      <TabsTrigger value="uz">O'zbekcha</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name_en">Product Name (EN)</Label>
                        <Input id="name_en" {...register("name_en")} />
                        {errors.name_en && <p className="text-sm text-destructive">{errors.name_en.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description_en">Description (EN)</Label>
                        <Textarea id="description_en" {...register("description_en")} />
                        {errors.description_en && <p className="text-sm text-destructive">{errors.description_en.message}</p>}
                      </div>
                    </TabsContent>
                    <TabsContent value="ru" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name_ru">Название продукта (RU)</Label>
                        <Input id="name_ru" {...register("name_ru")} />
                        {errors.name_ru && <p className="text-sm text-destructive">{errors.name_ru.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description_ru">Описание (RU)</Label>
                        <Textarea id="description_ru" {...register("description_ru")} />
                        {errors.description_ru && <p className="text-sm text-destructive">{errors.description_ru.message}</p>}
                      </div>
                    </TabsContent>
                    <TabsContent value="uz" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name_uz">Mahsulot nomi (UZ)</Label>
                        <Input id="name_uz" {...register("name_uz")} />
                        {errors.name_uz && <p className="text-sm text-destructive">{errors.name_uz.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description_uz">Tavsifi (UZ)</Label>
                        <Textarea id="description_uz" {...register("description_uz")} />
                        {errors.description_uz && <p className="text-sm text-destructive">{errors.description_uz.message}</p>}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                    <CardTitle>General Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                      <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                      <Input id="sku" {...register("sku")} placeholder="e.g., CAND-LAV-01" />
                      {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
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
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                                    <SelectItem value="">None</SelectItem>
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
                                    <SelectItem value="">None</SelectItem>
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
                    name="images" // This name should match the field in your Zod schema
                    control={control}
                    render={({ field }) => ( // field contains { value, onChange, onBlur, name, ref }
                      <ImageUploadArea
                        // Pass the current array of image URLs (Data URLs for new, existing URLs for edit)
                        initialImageUrls={field.value} 
                        // Pass the current main image URL
                        initialMainImageUrl={watch("mainImageId")} // Assuming mainImageId stores the ID/URL of the main image
                        onImagesChange={(newImageUrls, newMainImageUrl) => {
                           setValue("images", newImageUrls, { shouldValidate: true });
                           setValue("mainImageId", newMainImageUrl, { shouldValidate: true });
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
          <CardFooter className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Product (Simulated)"}
            </Button>
          </CardFooter>
        </form>
        <p className="text-sm text-muted-foreground text-center pt-4">
            Note: Product creation is simulated. Image data (as Data URLs) will be logged to console but not persisted.
          </p>
      </div>
    </FormProvider>
  );
}
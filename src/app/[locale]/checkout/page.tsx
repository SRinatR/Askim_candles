
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label'; // Not used by FormField, but can be kept if used elsewhere
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useParams } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';
import type { Locale } from '@/lib/i1n-config';

import enMessages from '@/dictionaries/en.json';
import ruMessages from '@/dictionaries/ru.json';
import uzMessages from '@/dictionaries/uz.json';

type Dictionary = typeof enMessages;

const dictionaries: Record<Locale, Dictionary> = {
  en: enMessages,
  ru: ruMessages,
  uz: uzMessages,
};

const getCheckoutDictionary = (locale: Locale) => {
  const dict = dictionaries[locale] || dictionaries.en;
  return dict.checkoutPage;
};

// TODO: Translate Zod validation messages
const checkoutSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  apartment: z.string().optional(),
  city: z.string().min(1, { message: "City is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  postalCode: z.string().min(1, { message: "Postal code is required." }),
  phone: z.string().optional(),
  cardNumber: z.string().length(16, { message: "Card number must be 16 digits."}).optional(),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Expiry date must be MM/YY."}).optional(),
  cvc: z.string().length(3, { message: "CVC must be 3 digits."}).optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;


export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale || 'uz';
  const dictionary = getCheckoutDictionary(locale);


  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      country: "United States", // TODO: Consider localizing default or making it dynamic
      postalCode: "",
    },
  });

  function onSubmit(data: CheckoutFormValues) {
    console.log("Checkout data:", data);
    toast({
      title: dictionary.orderPlacedTitle,
      description: dictionary.orderPlacedDesc,
    });
    clearCart();
    router.push(`/${locale}/account/orders`); 
  }
  
  if (cartItems.length === 0 && typeof window !== 'undefined') { 
     router.replace(`/${locale}/products`); 
     return ( 
        <div className="text-center py-12">
          <h1 className="text-3xl font-semibold mb-4">{dictionary.emptyCartTitle}</h1>
          <Button asChild>
             <Link href={`/${locale}/products`}>{dictionary.continueShopping}</Link>
          </Button>
        </div>
     );
  }


  return (
    <div className="container mx-auto max-w-4xl py-8">
       <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/`}>{dictionary.home}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/cart`}>{dictionary.cart}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{dictionary.checkoutBreadcrumb}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="lg:order-last space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">{dictionary.orderSummaryTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                      <Image src={item.images[0]} alt={item.name} fill className="object-cover" data-ai-hint="checkout item" sizes="48px"/>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{dictionary.subtotal}</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{dictionary.shipping}</span>
                <span>{dictionary.free}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>{dictionary.total}</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
           <Button variant="outline" asChild className="w-full">
             <Link href={`/${locale}/cart`}><ArrowLeft className="mr-2 h-4 w-4" /> {dictionary.returnToCart}</Link>
           </Button>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">{dictionary.checkoutTitle}</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>{dictionary.contactInfoTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>{dictionary.emailLabel}</FormLabel><FormControl><Input placeholder={dictionary.emailPlaceholder} {...field} /></FormControl><FormMessage /></FormItem> )} />
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>{dictionary.shippingAddressTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField name="firstName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>{dictionary.firstNameLabel}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField name="lastName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>{dictionary.lastNameLabel}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <FormField name="address" control={form.control} render={({ field }) => ( <FormItem><FormLabel>{dictionary.addressLabel}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField name="apartment" control={form.control} render={({ field }) => ( <FormItem><FormLabel>{dictionary.apartmentLabel}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField name="city" control={form.control} render={({ field }) => ( <FormItem><FormLabel>{dictionary.cityLabel}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField name="country" control={form.control} render={({ field }) => ( <FormItem><FormLabel>{dictionary.countryLabel}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField name="postalCode" control={form.control} render={({ field }) => ( <FormItem><FormLabel>{dictionary.postalCodeLabel}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                   <FormField name="phone" control={form.control} render={({ field }) => ( <FormItem><FormLabel>{dictionary.phoneLabel}</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </CardContent>
              </Card>
              
              <Card className="shadow-md">
                 <CardHeader>
                    <CardTitle>{dictionary.paymentTitle}</CardTitle>
                    <CardDescription>{dictionary.paymentDesc}</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <FormField name="cardNumber" control={form.control} render={({ field }) => ( <FormItem><FormLabel>{dictionary.cardNumberLabel}</FormLabel><FormControl><Input placeholder={dictionary.cardPlaceholder || "•••• •••• •••• ••••"} {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <div className="grid grid-cols-2 gap-4">
                       <FormField name="expiryDate" control={form.control} render={({ field }) => ( <FormItem><FormLabel>{dictionary.expiryDateLabel}</FormLabel><FormControl><Input placeholder={dictionary.expiryPlaceholder || "MM/YY"} {...field} /></FormControl><FormMessage /></FormItem> )} />
                       <FormField name="cvc" control={form.control} render={({ field }) => ( <FormItem><FormLabel>{dictionary.cvcLabel}</FormLabel><FormControl><Input placeholder={dictionary.cvcPlaceholder || "•••"} {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                 </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Lock className="mr-2 h-4 w-4" /> {dictionary.payButton.replace('{total}', `$${cartTotal.toFixed(2)}`)}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

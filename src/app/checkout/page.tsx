"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';

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
  // Mock payment fields for UI representation
  cardNumber: z.string().length(16, { message: "Card number must be 16 digits."}).optional(),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Expiry date must be MM/YY."}).optional(),
  cvc: z.string().length(3, { message: "CVC must be 3 digits."}).optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      country: "United States", // Default country
      postalCode: "",
    },
  });

  function onSubmit(data: CheckoutFormValues) {
    console.log("Checkout data:", data);
    // Here you would typically process the payment and create an order
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. Your order is being processed.",
    });
    clearCart();
    router.push("/account/orders"); // Redirect to order history or a thank you page
  }
  
  if (cartItems.length === 0) {
     // This could redirect or show a message if cart is empty before reaching here.
     // For now, assume cart is not empty or this is handled by navigation guards.
     return (
        <div className="text-center py-12">
          <h1 className="text-3xl font-semibold mb-4">Your cart is empty.</h1>
          <Button asChild>
             <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
     );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
       <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Checkout</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Order Summary Section */}
        <div className="lg:order-last space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                      <Image src={item.images[0]} alt={item.name} fill className="object-cover" data-ai-hint="checkout item" />
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
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
           <Button variant="outline" asChild className="w-full">
             <Link href="/cart"><ArrowLeft className="mr-2 h-4 w-4" /> Return to Cart</Link>
           </Button>
        </div>

        {/* Checkout Form Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField name="firstName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField name="lastName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <FormField name="address" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField name="apartment" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Apartment, suite, etc. (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField name="city" control={form.control} render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField name="country" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField name="postalCode" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                   <FormField name="phone" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Phone (optional)</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </CardContent>
              </Card>
              
              <Card className="shadow-md">
                 <CardHeader>
                    <CardTitle>Payment</CardTitle>
                    <CardDescription>All transactions are secure and encrypted.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <FormField name="cardNumber" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <div className="grid grid-cols-2 gap-4">
                       <FormField name="expiryDate" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem> )} />
                       <FormField name="cvc" control={form.control} render={({ field }) => ( <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="•••" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                 </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Lock className="mr-2 h-4 w-4" /> Pay ${cartTotal.toFixed(2)}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

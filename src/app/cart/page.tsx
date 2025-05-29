"use client";

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { toast } = useToast();

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Item Removed",
      description: `${productName} has been removed from your cart.`,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
       <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold tracking-tight">Your Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map(item => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4 shadow-sm">
              <div className="relative w-full sm:w-24 h-32 sm:h-24 aspect-square rounded-md overflow-hidden shrink-0">
                <Image src={item.images[0]} alt={item.name} fill className="object-cover" data-ai-hint="cart item" />
              </div>
              <div className="flex-grow space-y-1">
                <Link href={`/products/${item.id}`} className="text-lg font-medium hover:text-primary">{item.name}</Link>
                <p className="text-sm text-muted-foreground">Price: ${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-3 shrink-0 mt-2 sm:mt-0">
                <Input
                  type="number"
                  min="1"
                  max={item.stock > 0 ? item.stock : 99} // Use actual stock if available
                  value={item.quantity}
                  onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                  className="w-20 h-9 text-center"
                  aria-label={`Quantity for ${item.name}`}
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id, item.name)} aria-label={`Remove ${item.name} from cart`}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
              <p className="sm:ml-auto text-lg font-semibold w-full sm:w-auto text-right sm:text-left mt-2 sm:mt-0">${(item.price * item.quantity).toFixed(2)}</p>
            </Card>
          ))}
          {cartItems.length > 0 && (
             <div className="flex justify-end pt-4">
               <Button variant="outline" onClick={handleClearCart} className="text-destructive border-destructive hover:bg-destructive/10">
                 <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
               </Button>
             </div>
           )}
        </div>

        <Card className="lg:sticky lg:top-24 p-6 shadow-md">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>Free</span> {/* Or calculate dynamically */}
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Taxes</span>
              <span>Calculated at checkout</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between text-xl font-semibold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4 p-0 pt-6">
            <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/checkout">
                <CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-5 w-5" /> Continue Shopping
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

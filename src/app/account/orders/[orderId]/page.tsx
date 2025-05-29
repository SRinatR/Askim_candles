
"use client";

import React from "react"; // Added import for React.use()
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockOrders, mockProducts } from "@/lib/mock-data"; // Assuming mockProducts has all product details
import type { Order, CartItem as OrderItemType } from "@/lib/types"; // Renamed CartItem to OrderItemType for clarity in this context
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, Package, FileText, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';


function getStatusBadgeVariant(status: Order['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'Delivered': return 'default';
    case 'Shipped': return 'default';
    case 'Processing': return 'secondary';
    case 'Pending': return 'outline';
    case 'Cancelled': return 'destructive';
    default: return 'outline';
  }
}

// Define the shape of the resolved params
interface ResolvedOrderParams {
  orderId: string;
}

export default function OrderDetailPage({ params: paramsPromise }: { params: Promise<ResolvedOrderParams> }) {
  const router = useRouter();
  const resolvedParams = React.use(paramsPromise); // Unwrap the promise

  const order = mockOrders.find(o => o.id === resolvedParams.orderId || o.orderNumber === resolvedParams.orderId);

  if (!order) {
    notFound();
  }

  // Enhance order items with full product details if not already present (mock scenario)
  const detailedItems = order.items.map(item => {
    const productDetails = mockProducts.find(p => p.id === item.id); // Use item.id which is productId
    return {
      ...item,
      name: productDetails?.name || item.name,
      images: productDetails?.images || item.images,
    };
  });

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/account">Account</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
           <BreadcrumbItem>
            <BreadcrumbLink href="/account/orders">Orders</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Order {order.orderNumber}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="text-2xl">Order #{order.orderNumber}</CardTitle>
              <CardDescription>Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(order.status)} className="text-sm px-3 py-1">{order.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Items Ordered</h3>
            <ul className="space-y-4">
              {detailedItems.map((item: OrderItemType) => ( // Use enhanced item type
                <li key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border shrink-0">
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" data-ai-hint="ordered item" />
                  </div>
                  <div className="flex-grow">
                    <Link href={`/products/${item.id}`} className="font-medium hover:text-primary">{item.name}</Link>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${order.totalAmount.toFixed(2)}</span> {/* Assuming totalAmount is subtotal for mock */}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping:</span>
                <span>$0.00 (Free)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes:</span>
                <span>Calculated at checkout (mock)</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <Separator />

          {/* Mock Shipping & Billing Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
              <address className="not-italic text-sm text-muted-foreground space-y-0.5">
                <p>Jane Doe</p>
                <p>123 Main St, Apt 4B</p>
                <p>Anytown, CA 90210</p>
                <p>United States</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Billing Address</h3>
              <address className="not-italic text-sm text-muted-foreground space-y-0.5">
                <p>Jane Doe</p>
                <p>123 Main St, Apt 4B</p>
                <p>Anytown, CA 90210</p>
                <p>United States</p>
              </address>
            </div>
          </div>

        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">Need help with your order? <Link href="/contact" className="text-primary hover:underline">Contact Support</Link></p>
            <div className="flex space-x-3">
                <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4" /> View Invoice</Button>
                <Button variant="outline" size="sm"><Truck className="mr-2 h-4 w-4" /> Track Package</Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

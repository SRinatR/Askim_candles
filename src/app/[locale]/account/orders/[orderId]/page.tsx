
"use client";

import React from "react"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockOrders, mockProducts } from "@/lib/mock-data"; 
import type { Order, CartItem as OrderItemType } from "@/lib/types"; 
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter, useParams } from "next/navigation"; // Added useParams
import { ArrowLeft, Package, FileText, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';
import type { Locale } from '@/lib/i1n-config';

// Placeholder dictionary
const getOrderDetailDictionary = (locale: Locale) => {
  // Basic translations, expand as needed
  if (locale === 'uz') {
    return {
      home: "Bosh sahifa",
      account: "Hisob",
      orders: "Buyurtmalar",
      orderBreadcrumb: (orderNumber: string) => `Buyurtma ${orderNumber}`,
      orderDetailsTitle: "Buyurtma Tafsilotlari",
      backToOrdersButton: "Buyurtmalarga Qaytish",
      orderNumTitle: (orderNumber: string) => `Buyurtma #${orderNumber}`,
      placedOn: "Joylashtirilgan sana",
      itemsOrdered: "Buyurtma Qilingan Mahsulotlar",
      qty: "Miqdor",
      orderSummary: "Buyurtma Xulosasi",
      subtotal: "Oraliq jami",
      shipping: "Yetkazib berish",
      free: "Bepul",
      taxes: "Soliqlar",
      calculatedAtCheckout: "To'lovda hisoblanadi",
      total: "Jami",
      shippingAddress: "Yetkazib berish manzili",
      billingAddress: "To'lov manzili",
      needHelp: "Buyurtmangiz bilan yordam kerakmi?",
      contactSupport: "Qo'llab-quvvatlash bilan bog'laning",
      viewInvoiceButton: "Hisob-fakturani Ko'rish",
      trackPackageButton: "Jo'natmani Kuzatish",
      statusDelivered: "Yetkazildi",
      statusShipped: "Jo'natildi",
      statusProcessing: "Qayta ishlanmoqda",
      statusPending: "Kutilmoqda",
      statusCancelled: "Bekor qilindi",
      contactPagePath: "/contact" // Example, create this page
    };
  }
  // Add RU and EN similarly
  return { // en
    home: "Home",
    account: "Account",
    orders: "Orders",
    orderBreadcrumb: (orderNumber: string) => `Order ${orderNumber}`,
    orderDetailsTitle: "Order Details",
    backToOrdersButton: "Back to Orders",
    orderNumTitle: (orderNumber: string) => `Order #${orderNumber}`,
    placedOn: "Placed on",
    itemsOrdered: "Items Ordered",
    qty: "Qty",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    taxes: "Taxes",
    calculatedAtCheckout: "Calculated at checkout",
    total: "Total",
    shippingAddress: "Shipping Address",
    billingAddress: "Billing Address",
    needHelp: "Need help with your order?",
    contactSupport: "Contact Support",
    viewInvoiceButton: "View Invoice",
    trackPackageButton: "Track Package",
    statusDelivered: "Delivered",
    statusShipped: "Shipped",
    statusProcessing: "Processing",
    statusPending: "Pending",
    statusCancelled: "Cancelled",
    contactPagePath: "/contact" // Example, create this page
  };
};


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

function getTranslatedStatus(status: Order['status'], dict: ReturnType<typeof getOrderDetailDictionary>): string {
    switch (status) {
        case 'Delivered': return dict.statusDelivered;
        case 'Shipped': return dict.statusShipped;
        case 'Processing': return dict.statusProcessing;
        case 'Pending': return dict.statusPending;
        case 'Cancelled': return dict.statusCancelled;
        default: return status;
    }
}

interface OrderDetailPageParams {
  orderId: string;
  locale: Locale;
}

// Marking the page component as async to use React.use for params
export default async function OrderDetailPage({ params }: { params: OrderDetailPageParams }) {
  // For server components, params are directly available.
  // If this were a client component using pages router, React.use(params) would be needed for promises.
  // With App Router, params are direct props.
  const locale = params.locale || 'uz';
  const dictionary = getOrderDetailDictionary(locale); // Assuming this can be called on server or client as needed

  const order = mockOrders.find(o => o.id === params.orderId || o.orderNumber === params.orderId);

  if (!order) {
    notFound();
  }

  const detailedItems = order.items.map(item => {
    const productDetails = mockProducts.find(p => p.id === item.id);
    return { ...item, name: productDetails?.name || item.name, images: productDetails?.images || item.images };
  });

  // For client-side interactions like router.push, we need a client component wrapper or ensure this is a client component.
  // Since router.push is used, this component implicitly acts as a client component or needs "use client".
  // For simplicity of this fix, we'll keep as is and rely on <Link> or ensure it's marked "use client" if interactive hooks are added.
  // If "use client" is added, `useRouter` and `useParams` from 'next/navigation' can be used directly.

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href={`/${locale}/`}>{dictionary.home}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbLink href={`/${locale}/account`}>{dictionary.account}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
           <BreadcrumbItem><BreadcrumbLink href={`/${locale}/account/orders`}>{dictionary.orders}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbPage>{dictionary.orderBreadcrumb(order.orderNumber)}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.orderDetailsTitle}</h1>
        <Button variant="outline" asChild> 
            <Link href={`/${locale}/account/orders`}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {dictionary.backToOrdersButton}
            </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="text-2xl">{dictionary.orderNumTitle(order.orderNumber)}</CardTitle>
              <CardDescription>{dictionary.placedOn} {new Date(order.date).toLocaleDateString()}</CardDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(order.status)} className="text-sm px-3 py-1">{getTranslatedStatus(order.status, dictionary)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">{dictionary.itemsOrdered}</h3>
            <ul className="space-y-4">
              {detailedItems.map((item: OrderItemType) => (
                <li key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border shrink-0">
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" data-ai-hint="ordered item" sizes="64px" />
                  </div>
                  <div className="flex-grow">
                    <Link href={`/${locale}/products/${item.id}`} className="font-medium hover:text-primary">{item.name}</Link>
                    <p className="text-sm text-muted-foreground">{dictionary.qty}: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3">{dictionary.orderSummary}</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{dictionary.subtotal}:</span><span>${order.totalAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{dictionary.shipping}:</span><span>{dictionary.free}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{dictionary.taxes}:</span><span>{dictionary.calculatedAtCheckout}</span></div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-base"><span>{dictionary.total}:</span><span>${order.totalAmount.toFixed(2)}</span></div>
            </div>
          </div>
          <Separator />
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">{dictionary.shippingAddress}</h3>
              <address className="not-italic text-sm text-muted-foreground space-y-0.5"><p>Jane Doe</p><p>123 Main St, Apt 4B</p><p>Anytown, CA 90210</p><p>United States</p></address>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">{dictionary.billingAddress}</h3>
              <address className="not-italic text-sm text-muted-foreground space-y-0.5"><p>Jane Doe</p><p>123 Main St, Apt 4B</p><p>Anytown, CA 90210</p><p>United States</p></address>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">{dictionary.needHelp} <Link href={`/${locale}${dictionary.contactPagePath}`} className="text-primary hover:underline">{dictionary.contactSupport}</Link></p>
            <div className="flex space-x-3">
                <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4" /> {dictionary.viewInvoiceButton}</Button>
                <Button variant="outline" size="sm"><Truck className="mr-2 h-4 w-4" /> {dictionary.trackPackageButton}</Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

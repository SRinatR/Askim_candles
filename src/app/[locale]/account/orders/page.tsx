
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Removed CardDescription, CardFooter
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockOrders } from "@/lib/mock-data";
import type { Order } from "@/lib/types";
import { Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import type { Locale } from '@/lib/i1n-config';

// Placeholder dictionary
const getOrderHistoryDictionary = (locale: Locale) => {
  if (locale === 'uz') {
    return {
      title: "Buyurtmalar Tarixi",
      description: "O'tgan xaridlaringiz tafsilotlarini ko'ring.",
      noOrdersYetTitle: "Hali Buyurtmalar Yo'q",
      noOrdersYetDesc: "Siz biz bilan hali hech qanday buyurtma bermagansiz. Buyurtmalaringizni shu yerda ko'rish uchun xarid qilishni boshlang!",
      startShoppingButton: "Xaridni Boshlash",
      orderIdHeader: "Buyurtma ID",
      dateHeader: "Sana",
      statusHeader: "Holat",
      totalHeader: "Jami",
      actionsHeader: "Amallar",
      viewDetailsButton: "Tafsilotlarni Ko'rish",
      statusDelivered: "Yetkazildi",
      statusShipped: "Jo'natildi",
      statusProcessing: "Qayta ishlanmoqda",
      statusPending: "Kutilmoqda",
      statusCancelled: "Bekor qilindi",
    };
  }
  // Add RU and EN similarly
  return { // en
    title: "Order History",
    description: "View details of your past purchases.",
    noOrdersYetTitle: "No Orders Yet",
    noOrdersYetDesc: "You haven't placed any orders with us. Start shopping to see your orders here!",
    startShoppingButton: "Start Shopping",
    orderIdHeader: "Order ID",
    dateHeader: "Date",
    statusHeader: "Status",
    totalHeader: "Total",
    actionsHeader: "Actions",
    viewDetailsButton: "View Details",
    statusDelivered: "Delivered",
    statusShipped: "Shipped",
    statusProcessing: "Processing",
    statusPending: "Pending",
    statusCancelled: "Cancelled",
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

function getTranslatedStatus(status: Order['status'], dict: ReturnType<typeof getOrderHistoryDictionary>): string {
    switch (status) {
        case 'Delivered': return dict.statusDelivered;
        case 'Shipped': return dict.statusShipped;
        case 'Processing': return dict.statusProcessing;
        case 'Pending': return dict.statusPending;
        case 'Cancelled': return dict.statusCancelled;
        default: return status;
    }
}


export default function OrderHistoryPage() {
  const params = useParams();
  const locale = params.locale as Locale || 'uz';
  const dictionary = getOrderHistoryDictionary(locale);

  const orders = mockOrders; // In a real app, fetch user's orders

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-semibold">{dictionary.title}</h2>
        <p className="text-muted-foreground">{dictionary.description}</p>
      </div>

      {orders.length === 0 ? (
        <Card>
            <CardContent className="p-10 text-center">
                 <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{dictionary.noOrdersYetTitle}</h3>
                <p className="text-muted-foreground mb-6">{dictionary.noOrdersYetDesc}</p>
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={`/${locale}/products`}>{dictionary.startShoppingButton}</Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dictionary.orderIdHeader}</TableHead>
                  <TableHead>{dictionary.dateHeader}</TableHead>
                  <TableHead>{dictionary.statusHeader}</TableHead>
                  <TableHead className="text-right">{dictionary.totalHeader}</TableHead>
                  <TableHead className="text-center">{dictionary.actionsHeader}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link href={`/${locale}/account/orders/${order.id}`} className="hover:text-primary hover:underline">
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>{getTranslatedStatus(order.status, dictionary)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${locale}/account/orders/${order.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> {dictionary.viewDetailsButton}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Delete original: src/app/account/orders/page.tsx

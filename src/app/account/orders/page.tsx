"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockOrders } from "@/lib/mock-data";
import type { Order } from "@/lib/types";
import { Eye, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function getStatusBadgeVariant(status: Order['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'Delivered': return 'default'; // Using primary for delivered as success
    case 'Shipped': return 'default'; // Using primary for shipped as success
    case 'Processing': return 'secondary';
    case 'Pending': return 'outline';
    case 'Cancelled': return 'destructive';
    default: return 'outline';
  }
}


export default function OrderHistoryPage() {
  const orders = mockOrders; // In a real app, fetch user's orders

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-semibold">Order History</h2>
        <p className="text-muted-foreground">View details of your past purchases.</p>
      </div>

      {orders.length === 0 ? (
        <Card>
            <CardContent className="p-10 text-center">
                 <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-6">You haven't placed any orders with us. Start shopping to see your orders here!</p>
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/products">Start Shopping</Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link href={`/account/orders/${order.id}`} className="hover:text-primary hover:underline">
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/account/orders/${order.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
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

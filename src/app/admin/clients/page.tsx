
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, UserX, UserCheck, MoreVertical } from "lucide-react";
import React, { useState, useMemo } from "react";
import { mockAdminClients, type MockAdminClient } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// TODO: Localize texts when admin i18n is fully implemented

export default function AdminClientsPage() {
  const [clients, setClients] = useState<MockAdminClient[]>(mockAdminClients);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const toggleBlockClient = (clientId: string) => {
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId ? { ...client, isBlocked: !client.isBlocked } : client
      )
    );
    const client = clients.find(c => c.id === clientId);
    toast({
      title: `Client ${client?.isBlocked ? "Unblocked" : "Blocked"} (Simulated)`,
      description: `Client ${client?.name} status has been updated locally.`,
    });
    // In a real app, this would also trigger a logAdminAction
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Clients</h1>
        <p className="text-muted-foreground">
          View and manage your customer base.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>
            Displaying {filteredClients.length} of {clients.length} clients. Client data is currently mocked.
          </CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search clients by name or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredClients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Total Orders</TableHead>
                  <TableHead className="text-right">Total Spent (UZS)</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{new Date(client.registrationDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{client.totalOrders}</TableCell>
                    <TableCell className="text-right">{client.totalSpent.toLocaleString('uz-UZ')}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={client.isBlocked ? "destructive" : "secondary"}>
                        {client.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem disabled>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details (Soon)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleBlockClient(client.id)}>
                            {client.isBlocked ? (
                              <UserCheck className="mr-2 h-4 w-4" />
                            ) : (
                              <UserX className="mr-2 h-4 w-4" />
                            )}
                            {client.isBlocked ? "Unblock Client" : "Block Client"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">No clients found matching your search criteria.</p>
          )}
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground text-center">
        Note: Client data and block/unblock operations are simulated and will reset on page refresh.
      </p>
    </div>
  );
}

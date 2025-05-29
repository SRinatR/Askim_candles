
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

// TODO: Localize texts when admin i18n is fully implemented

export default function AdminLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System & Audit Logs</h1>
        <p className="text-muted-foreground">
          View system events, administrative actions, and session logs.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Log Entries</CardTitle>
          <CardDescription>
            This section will display detailed logs once backend integration is complete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 p-12 border-2 border-dashed border-border rounded-md text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-semibold">Log Data Unavailable (Pending Backend)</h3>
            <p className="text-sm">
              Administrative actions, user session information, and system events will be logged and displayed here after integration with Prisma and PostgreSQL.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

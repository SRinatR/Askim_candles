
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function AdminSalesPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Продажи</h1>
            <p className="text-muted-foreground">
            Обзор и управление данными о продажах.
            </p>
        </div>
        <Button variant="outline" disabled>
            <Download className="mr-2 h-4 w-4" /> Экспорт (скоро)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>История Продаж</CardTitle>
          <CardDescription>Список всех транзакций и продаж.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Таблица с деталями продаж и фильтрацией появится здесь.</p>
          <div className="mt-4 p-8 border-2 border-dashed border-border rounded-md text-center text-muted-foreground">
            Данные о продажах (скоро)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
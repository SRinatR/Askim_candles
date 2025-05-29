
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Отчеты</h1>
            <p className="text-muted-foreground">
            Генерация и просмотр отчетов по различным аспектам магазина.
            </p>
        </div>
        <Button variant="outline" disabled>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Сгенерировать отчет (скоро)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Доступные Отчеты</CardTitle>
          <CardDescription>Выберите тип отчета для просмотра или генерации.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li>Отчет по продажам (по периодам, товарам, категориям) - (скоро)</li>
            <li>Отчет по клиентам (активность, сегментация) - (скоро)</li>
            <li>Отчет по запасам товаров - (скоро)</li>
            <li>Финансовый отчет - (скоро)</li>
          </ul>
          <div className="mt-4 p-8 border-2 border-dashed border-border rounded-md text-center text-muted-foreground">
            Область для отображения сгенерированных отчетов (скоро)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
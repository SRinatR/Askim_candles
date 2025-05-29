
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AdminMarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Маркетинг</h1>
            <p className="text-muted-foreground">
            Управление маркетинговыми кампаниями и инструментами.
            </p>
        </div>
        <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" /> Создать кампанию (скоро)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Активные Кампании</CardTitle>
          <CardDescription>Список текущих и прошлых маркетинговых активностей.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Инструменты для SEO, email-рассылок и управления акциями появятся здесь.</p>
          <div className="mt-4 p-8 border-2 border-dashed border-border rounded-md text-center text-muted-foreground">
            Данные о маркетинговых кампаниях (скоро)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
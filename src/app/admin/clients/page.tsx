
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AdminClientsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Клиенты</h1>
        <p className="text-muted-foreground">
          Управление информацией о клиентах.
        </p>
      </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Поиск клиентов по email или имени..." className="pl-10" disabled/>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Список Клиентов</CardTitle>
          <CardDescription>Обзор всех зарегистрированных клиентов.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Таблица с информацией о клиентах, их заказах и возможностью управления появится здесь.</p>
          <div className="mt-4 p-8 border-2 border-dashed border-border rounded-md text-center text-muted-foreground">
            Данные о клиентах (скоро)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
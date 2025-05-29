
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { BarChart, DollarSign, Package, ShoppingCart, Users, CreditCard, TrendingUp, Repeat, Gift, BarChartBig } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
}

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}


export default function AdminDashboardPage() {
  const { currentAdminUser } = useAdminAuth();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Главная панель</h1>
          <p className="text-muted-foreground">
            Добро пожаловать, {currentAdminUser?.name || "Admin"}! Обзор вашего магазина.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard title="Продажи (Общий доход)" value="$45,231.89" description="+20.1% с прошлого месяца" icon={DollarSign} />
        <StatCard title="Платежи (Всего)" value="$44,810.20" description="99.5% успешных" icon={CreditCard} />
        <StatCard title="Активные Товары" value="78" description="6 новых за неделю" icon={Package} />
        <StatCard title="Транзакции (Всего)" value="3,102" description="280 за сегодня" icon={TrendingUp} />
        <StatCard title="Клиенты (Всего)" value="1,250" description="+30 новых за неделю" icon={Users} />
        <StatCard title="Возвращающиеся клиенты" value="35%" description="Рост на 5% за месяц" icon={Repeat} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5 text-primary"/> Топ-10 Продуктов</CardTitle>
            <CardDescription>Самые продаваемые товары в этом месяце (заглушка).</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>1. Lavender Bliss Candle - 150 продаж</li>
              <li>2. Elegant Swan Wax Figure - 98 продаж</li>
              <li>3. Vanilla Dream Candle - 85 продаж</li>
              <li className="pt-2 font-semibold">... (полный список скоро)</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChartBig className="h-5 w-5 text-primary"/> Обзор Продаж</CardTitle>
             <CardDescription>График продаж за последние 30 дней (заглушка).</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-60 flex items-center justify-center text-muted-foreground bg-slate-100 dark:bg-slate-800 rounded-md mt-2">
                <BarChart className="h-16 w-16" /> 
             </div>
          </CardContent>
        </Card>
      </div>
       <p className="text-sm text-muted-foreground text-center">Примечание: Все данные на этой странице являются демонстрационными и будут заменены реальными данными после интеграции с бэкендом.</p>
    </div>
  );
}

    
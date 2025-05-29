"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent }
from "@/components/ui/card";
import { User, MapPin, ShoppingBag, LogOut, Edit3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/account/profile",
    icon: User,
  },
  {
    title: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    title: "Order History",
    href: "/account/orders",
    icon: ShoppingBag,
  },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <Button variant="outline">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/4">
          <Card>
            <CardContent className="p-2">
            <nav className="flex flex-col space-y-1">
              {sidebarNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-base px-3 py-2 h-auto",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.title}
                  </Button>
                </Link>
              ))}
            </nav>
            </CardContent>
          </Card>
        </aside>
        <div className="flex-1 lg:max-w-3xl">{children}</div>
      </div>
    </div>
  );
}

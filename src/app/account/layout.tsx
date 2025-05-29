
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, MapPin, ShoppingBag, LogOut } from "lucide-react"; // Removed Edit3 as it's not used
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import React, { useEffect } from "react"; // Import React and useEffect
import { useToast } from "@/hooks/use-toast";

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
  const router = useRouter();
  const { currentUser, loading, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace("/login?redirect=/account"); // Redirect to login if not authenticated
    }
  }, [currentUser, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      // Router push to /login is handled by logout function in AuthContext
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || !currentUser) {
    // Display a loading state or null while checking auth status or if not authenticated
    // This prevents a flash of the account page content before redirect
    return <div className="flex justify-center items-center min-h-[300px]"><p>Loading account...</p></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          {currentUser && <p className="text-muted-foreground">Welcome back, {currentUser.name || currentUser.email}!</p>}
        </div>
        <Button variant="outline" onClick={handleLogout}>
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

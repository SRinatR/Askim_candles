
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, MapPin, ShoppingBag, LogOut, Link2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react"; // NextAuth
import { useAuth as useSimulatedAuth } from "@/contexts/AuthContext"; // Simulated Auth
import React, { useEffect } from "react";
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
  {
    title: "Account Linking",
    href: "/account/linking",
    icon: Link2,
  },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const { currentUser: simulatedUser, logout: simulatedLogout, isLoading: isLoadingSimulatedAuth } = useSimulatedAuth();
  const { toast } = useToast();

  const isAuthenticated = !!nextAuthSession || !!simulatedUser;
  const isLoadingAuth = nextAuthStatus === "loading" || isLoadingSimulatedAuth;

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoadingAuth, isAuthenticated, router, pathname]);

  const handleLogout = async () => {
    try {
      if (nextAuthSession) {
        await nextAuthSignOut({ callbackUrl: '/login' });
      }
      if (simulatedUser) {
        simulatedLogout();
        router.push('/login'); // Redirect after simulated logout
      }
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  let welcomeName = "Guest";
  if (nextAuthSession?.user?.name) {
    welcomeName = nextAuthSession.user.name;
  } else if (simulatedUser?.name) {
    welcomeName = simulatedUser.name;
  } else if (nextAuthSession?.user?.email) {
    welcomeName = nextAuthSession.user.email;
  } else if (simulatedUser?.email) {
    welcomeName = simulatedUser.email;
  }


  if (isLoadingAuth || !isAuthenticated) {
    return <div className="flex justify-center items-center min-h-[300px]"><p>Loading account...</p></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground">Welcome back, {welcomeName}!</p>
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


"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Percent,
  FileText,
  Settings,
  LogOut,
  Menu,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  managerOnly?: boolean; // If true, accessible by manager and admin
}

const navItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, managerOnly: true },
  { href: '/admin/products', label: 'Products', icon: Package, managerOnly: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, managerOnly: true },
  { href: '/admin/users', label: 'Users', icon: Users, adminOnly: true },
  { href: '/admin/discounts', label: 'Discounts', icon: Percent, managerOnly: true },
  { href: '/admin/content', label: 'Content', icon: FileText, managerOnly: true },
  { href: '/admin/settings', label: 'Settings', icon: Settings, adminOnly: true },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { currentAdminUser, logout, isLoading, role, isAdmin, isManager } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-muted"><p>Loading Admin Panel...</p></div>;
  }

  if (!currentAdminUser && pathname !== '/admin/login') {
    // This case should ideally be handled by AdminAuthProvider's useEffect,
    // but as a fallback or for components rendered outside its immediate tree.
    if (typeof window !== 'undefined') router.replace('/admin/login');
    return <div className="flex h-screen items-center justify-center bg-muted"><p>Redirecting to login...</p></div>;
  }
  
  if (!currentAdminUser && pathname === '/admin/login') {
    return <>{children}</>; // Allow login page to render
  }

  if (!currentAdminUser) { // Should not happen if protection works, but good for safety
      return null;
  }
  
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly) return isAdmin;
    if (item.managerOnly) return isManager; // Admin is also a manager
    return true; // Default to visible if no specific role mentioned
  });


  const SidebarNav = ({isMobile = false} : {isMobile?: boolean}) => (
    <nav className="flex flex-col space-y-1 px-2 py-4">
      {filteredNavItems.map((item) => (
        <TooltipProvider key={item.href} delayDuration={isMobile ? 99999 : 0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={item.href} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                <Button
                  variant={pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href)) ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-sm"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            </TooltipTrigger>
            {isMobile ? null : <TooltipContent side="right" className="bg-foreground text-background">{item.label}</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r bg-background fixed h-full">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin/dashboard">
            <Logo />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <div className="mt-auto p-4 border-t">
            <div className="text-sm mb-2">
                <p className="font-semibold">{currentAdminUser?.name}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1 text-primary"/> Role: {currentAdminUser?.role}
                </p>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col md:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
          <Link href="/admin/dashboard">
            <Logo className="h-7"/>
          </Link>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-3/4 max-w-xs">
              <div className="flex h-16 items-center border-b px-6">
                <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo />
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarNav isMobile={true} />
              </div>
              <div className="mt-auto p-4 border-t">
                <div className="text-sm mb-2">
                    <p className="font-semibold">{currentAdminUser?.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                        <ShieldCheck className="h-3 w-3 mr-1 text-primary"/> Role: {currentAdminUser?.role}
                    </p>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => { logout(); setIsMobileMenuOpen(false);}}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The AdminAuthProvider needs to wrap the content only if it's not the login page itself,
  // to avoid re-wrapping or context conflicts for the login page.
  if (pathname === '/admin/login') {
    return <AdminAuthProvider>{children}</AdminAuthProvider>;
  }
  
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}

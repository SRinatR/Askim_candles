
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
  Megaphone, // Added for Marketing
  FileOutput, // Added for Reports
  Landmark, // Added for Finances
  Briefcase, // Placeholder for Management if Users icon is taken or for generic "Управление"
} from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  managerOnly?: boolean; 
}

// Updated NavItems based on user image and request
const navItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Главная панель', icon: LayoutDashboard, managerOnly: true },
  { href: '/admin/products', label: 'Товары', icon: Package, managerOnly: true },
  { href: '/admin/sales', label: 'Продажи', icon: ShoppingCart, managerOnly: true },
  { href: '/admin/clients', label: 'Клиенты', icon: Users, managerOnly: true },
  { href: '/admin/marketing', label: 'Маркетинг', icon: Megaphone, managerOnly: true },
  { href: '/admin/reports', label: 'Отчеты', icon: FileOutput, managerOnly: true },
  { href: '/admin/finances', label: 'Финансы', icon: Landmark, managerOnly: true },
  { href: '/admin/discounts', label: 'Скидки и акции', icon: Percent, managerOnly: true },
  { href: '/admin/content', label: 'Контент', icon: FileText, managerOnly: true },
  { href: '/admin/settings', label: 'Настройки', icon: Settings, adminOnly: true },
  { href: '/admin/users', label: 'Управление', icon: Briefcase, adminOnly: true }, // Changed icon to Briefcase for "Управление"
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { currentAdminUser, logout, isLoading, isAdmin, isManager } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-muted"><p>Loading Admin Panel...</p></div>;
  }

  if (!currentAdminUser && pathname !== '/admin/login') {
    if (typeof window !== 'undefined') router.replace('/admin/login');
    return <div className="flex h-screen items-center justify-center bg-muted"><p>Redirecting to login...</p></div>;
  }
  
  if (!currentAdminUser && pathname === '/admin/login') {
    return <>{children}</>; 
  }

  if (!currentAdminUser) { 
      return null;
  }
  
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly) return isAdmin;
    if (item.managerOnly) return isManager;
    return true; 
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
  if (pathname === '/admin/login') {
    return <AdminAuthProvider>{children}</AdminAuthProvider>;
  }
  
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}

    
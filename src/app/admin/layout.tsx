
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger } from '@/components/ui/sheet';
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
  Megaphone,
  FileOutput,
  Landmark,
  Briefcase,
  PanelLeftOpen,
  PanelRightOpen,
  X, // Ensure X is imported
} from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  managerOnly?: boolean; // True if manager OR admin can access
}

const navItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Главная панель', icon: LayoutDashboard, managerOnly: true },
  { href: '/admin/products', label: 'Товары', icon: Package, managerOnly: true },
  { href: '/admin/sales', label: 'Продажи', icon: ShoppingCart, managerOnly: true }, // Was /admin/orders, changed to /admin/sales for label "Продажи"
  { href: '/admin/clients', label: 'Клиенты', icon: Users, managerOnly: true },
  { href: '/admin/marketing', label: 'Маркетинг', icon: Megaphone, managerOnly: true },
  { href: '/admin/reports', label: 'Отчеты', icon: FileOutput, managerOnly: true },
  { href: '/admin/finances', label: 'Финансы', icon: Landmark, managerOnly: true },
  { href: '/admin/discounts', label: 'Скидки и акции', icon: Percent, managerOnly: true },
  { href: '/admin/content', label: 'Контент', icon: FileText, managerOnly: true },
  { href: '/admin/settings', label: 'Настройки', icon: Settings, adminOnly: true },
  { href: '/admin/users', label: 'Управление', icon: Briefcase, adminOnly: true }, // Was "Пользователи"
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { currentAdminUser, logout, isLoading, isAdmin, isManager } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    if (item.managerOnly) return isManager || isAdmin; // Admin can access manager routes too
    return true;
  });


  const SidebarNav = ({isMobile = false, isCollapsed = false} : {isMobile?: boolean, isCollapsed?: boolean}) => (
    <nav className={cn("flex flex-col space-y-1 py-4", isCollapsed && !isMobile ? "px-2 items-center" : "px-2")}>
      {filteredNavItems.map((item) => (
        <TooltipProvider key={item.href} delayDuration={isMobile || !isCollapsed ? 999999 : 0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={item.href} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                <Button
                  variant={pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href)) ? 'secondary' : 'ghost'}
                  className={cn("w-full text-sm h-9", isCollapsed && !isMobile ? "justify-center px-2" : "justify-start")}
                  title={isCollapsed && !isMobile ? item.label : undefined}
                >
                  <item.icon className={cn("h-5 w-5", isCollapsed && !isMobile ? "" : "mr-3")} />
                  {(!isCollapsed || isMobile) && <span className="truncate">{item.label}</span>}
                </Button>
              </Link>
            </TooltipTrigger>
            {(isCollapsed && !isMobile) && (
              <TooltipContent side="right" className="bg-foreground text-background ml-2">{item.label}</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop Sidebar */}
      <aside className={cn(
          "hidden md:flex md:flex-col border-r bg-background fixed h-full z-40 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:w-16" : "md:w-64"
        )}
      >
        <div className={cn( // Sidebar Header (Logo)
            "flex h-16 items-center border-b shrink-0", // Added shrink-0
            isSidebarCollapsed ? "justify-center px-2" : "px-6"
          )}
        >
          <Link href="/admin/dashboard">
            {isSidebarCollapsed ? <ShieldCheck className="h-7 w-7 text-primary" /> : <Logo />}
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto"> {/* Scrollable Nav Area */}
          <SidebarNav isCollapsed={isSidebarCollapsed} />
        </div>
        <div className={cn("border-t shrink-0", isSidebarCollapsed ? "px-2 py-3" : "px-6 py-4")}> {/* Sidebar Footer (User Info & Logout) - Added shrink-0, adjusted padding */}
            <div className={cn("text-sm mb-2 leading-tight", isSidebarCollapsed ? "hidden" : "")}>
                <p className="font-semibold truncate">{currentAdminUser?.name}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1 text-primary"/> Role: {currentAdminUser?.role}
                </p>
            </div>
            <Button
              variant="outline"
              size={isSidebarCollapsed ? "icon" : "sm"}
              className={cn("flex items-center justify-center", isSidebarCollapsed ? "h-9 w-9 mx-auto" : "w-full h-9")} // Ensured button is centered when icon
              onClick={logout}
              title="Logout"
            >
                <LogOut className={cn("h-4 w-4", isSidebarCollapsed ? "" : "mr-2")} />
                {!isSidebarCollapsed && <span className="text-sm">Logout</span>}
            </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:pl-16" : "md:pl-64"
        )}
      >
        {/* Header for Main Content (Toggle & Mobile Menu) */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:px-6">
          {/* Desktop Sidebar Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:inline-flex mr-4" // Added margin for spacing
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <PanelRightOpen className="h-6 w-6" /> : <PanelLeftOpen className="h-6 w-6" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>

           {/* Mobile: Logo and Menu Trigger */}
          <div className="flex-1 flex md:hidden items-center justify-between">
             <Link href="/admin/dashboard" className="md:hidden">
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
                <SheetHeader className="flex flex-row justify-between items-center border-b p-6">
                  <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                  <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Logo />
                  </Link>
                   <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                         <X className="h-6 w-6" />
                      </Button>
                   </SheetClose>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto"> {/* Scrollable Nav for Mobile */}
                  <SidebarNav isMobile={true} />
                </div>
                <div className="p-4 border-t"> {/* Mobile bottom block (User Info & Logout) */}
                  <div className="text-sm mb-2 leading-tight">
                      <p className="font-semibold truncate">{currentAdminUser?.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                          <ShieldCheck className="h-3 w-3 mr-1 text-primary"/> Role: {currentAdminUser?.role}
                      </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { logout(); setIsMobileMenuOpen(false);}} title="Logout">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"> {/* Added overflow-y-auto to main content area as well */}
            {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/admin/login') {
    // For the login page, we don't need the full AdminLayoutContent, just the provider
    return <AdminAuthProvider>{children}</AdminAuthProvider>;
  }

  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}

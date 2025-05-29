
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'; // Added SheetHeader, SheetTitle, SheetClose
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
  X // Added X import
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
  { href: '/admin/users', label: 'Управление', icon: Briefcase, adminOnly: true }, 
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
    if (item.managerOnly) return isManager; 
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
                  className={cn("w-full text-sm h-10", isCollapsed && !isMobile ? "justify-center px-2" : "justify-start")}
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
      <aside className={cn(
          "hidden md:flex md:flex-col border-r bg-background fixed h-full z-40 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:w-16" : "md:w-64"
        )}
      >
        <div className={cn(
            "flex h-16 items-center border-b px-6",
            isSidebarCollapsed ? "justify-center px-2" : "px-6"
          )}
        >
          <Link href="/admin/dashboard">
            {isSidebarCollapsed ? <ShieldCheck className="h-7 w-7 text-primary" /> : <Logo />}
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav isCollapsed={isSidebarCollapsed} />
        </div>
        <div className={cn("mt-auto border-t", isSidebarCollapsed ? "p-2" : "p-4")}>
            <div className={cn("text-sm mb-2", isSidebarCollapsed ? "hidden" : "")}>
                <p className="font-semibold truncate">{currentAdminUser?.name}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1 text-primary"/> Role: {currentAdminUser?.role}
                </p>
            </div>
            <Button 
              variant="outline" 
              size={isSidebarCollapsed ? "icon" : "sm"} 
              className="w-full" 
              onClick={logout} 
              title="Logout"
            >
                <LogOut className={cn(isSidebarCollapsed ? "" : "mr-2", "h-4 w-4")} />
                {!isSidebarCollapsed && <span>Logout</span>}
            </Button>
        </div>
      </aside>

      <div className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:pl-16" : "md:pl-64"
        )}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4">
          {/* Desktop Sidebar Toggle Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            className="hidden md:inline-flex"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <PanelRightOpen className="h-6 w-6" /> : <PanelLeftOpen className="h-6 w-6" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>

           {/* Mobile Menu Trigger */}
          <div className="md:hidden flex-1 flex justify-end"> 
             <Link href="/admin/dashboard" className="absolute left-4 top-1/2 -translate-y-1/2 md:hidden">
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
                  <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Logo />
                  </Link>
                  <SheetTitle className="sr-only">Admin Menu</SheetTitle> {/* Visually hidden title */}
                  <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                         <X className="h-6 w-6" />
                      </Button>
                   </SheetClose>
                </SheetHeader>
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
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { logout(); setIsMobileMenuOpen(false);}} title="Logout">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
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
    

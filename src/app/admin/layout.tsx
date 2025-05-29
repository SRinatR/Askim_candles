
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Percent, FileText as ContentIcon, Settings, LogOut, Menu,
  ShieldCheck, Megaphone, FileOutput, Landmark, Briefcase, PanelLeftOpen, PanelRightOpen, X,
  Sun, Moon, Globe as GlobeIcon, History
} from 'lucide-react'; // Added History for Logs
import { Logo } from '@/components/icons/Logo';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { i18nAdmin, type AdminLocale } from '@/admin/lib/i18n-config-admin';
import { getAdminDictionary } from '@/admin/lib/getAdminDictionary';
import type enAdminMessages from '@/admin/dictionaries/en.json';
import '../globals.css';

type AdminDictionary = typeof enAdminMessages;

interface NavItem {
  href: string;
  labelKey: keyof AdminDictionary['adminLayout'];
  icon: React.ElementType;
  adminOnly?: boolean;
  managerOrAdmin?: boolean; // Changed from managerOnly for clarity
}

const navItems: NavItem[] = [
  { href: '/admin/dashboard', labelKey: 'dashboard', icon: LayoutDashboard, managerOrAdmin: true },
  { href: '/admin/products', labelKey: 'products', icon: Package, managerOrAdmin: true },
  { href: '/admin/sales', labelKey: 'sales', icon: ShoppingCart, managerOrAdmin: true }, // Placeholder "Sales" key
  { href: '/admin/clients', labelKey: 'clients', icon: Users, managerOrAdmin: true }, // Placeholder "Clients" key
  { href: '/admin/marketing', labelKey: 'marketing', icon: Megaphone, managerOrAdmin: true }, // Placeholder "Marketing" key
  { href: '/admin/reports', labelKey: 'reports', icon: FileOutput, managerOrAdmin: true }, // Placeholder "Reports" key
  { href: '/admin/finances', labelKey: 'finances', icon: Landmark, managerOrAdmin: true }, // Placeholder "Finances" key
  { href: '/admin/discounts', labelKey: 'discounts', icon: Percent, managerOrAdmin: true },
  { href: '/admin/content', labelKey: 'content', icon: ContentIcon, managerOrAdmin: true },
  { href: '/admin/logs', labelKey: 'logs', icon: History, adminOnly: true }, // New "Logs" item
  { href: '/admin/settings', labelKey: 'settings', icon: Settings, adminOnly: true },
  { href: '/admin/users', labelKey: 'management', icon: Briefcase, adminOnly: true },
];


function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { currentAdminUser, logout, isLoading: isLoadingAuth, isAdmin, isManager } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dictionary, setDictionary] = useState<AdminDictionary['adminLayout'] | null>(null);
  const [currentLocale, setCurrentLocale] = useState<AdminLocale>(i18nAdmin.defaultLocale);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedLocale = localStorage.getItem('admin-lang') as AdminLocale | null;
    const initialLocale = storedLocale && i18nAdmin.locales.includes(storedLocale) ? storedLocale : i18nAdmin.defaultLocale;
    setCurrentLocale(initialLocale);

    const isDark = localStorage.getItem('admin-theme') === 'dark' ||
                   (!('admin-theme' in localStorage) && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark);
    }
  }, []);

  useEffect(() => {
    async function loadDictionary() {
      const dictModule = await getAdminDictionary(currentLocale);
      setDictionary(dictModule.adminLayout);
    }
    loadDictionary();
  }, [currentLocale]);
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('admin-theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  const changeLanguage = (newLocale: AdminLocale) => {
    setCurrentLocale(newLocale);
    localStorage.setItem('admin-lang', newLocale);
  };

  if (isLoadingAuth || !dictionary) {
    return <div className="flex h-screen items-center justify-center bg-muted"><p>Loading Admin Panel...</p></div>;
  }

  if (!currentAdminUser && pathname !== '/admin/login') {
    if (typeof window !== 'undefined') router.replace('/admin/login');
    return <div className="flex h-screen items-center justify-center bg-muted"><p>Redirecting to login...</p></div>;
  }

  if (pathname === '/admin/login') { 
    return <>{children}</>;
  }
  
  if (!currentAdminUser) return null;

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly) return isAdmin;
    if (item.managerOrAdmin) return isManager || isAdmin; // isManager already implies isAdmin check in context
    return true;
  });

  const AdminLanguageSwitcher = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title={dictionary.selectLanguage}>
          <GlobeIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18nAdmin.locales.map((loc) => (
          <DropdownMenuItem key={loc} onClick={() => changeLanguage(loc)} className={cn(currentLocale === loc ? "font-semibold text-primary" : "")}>
            {loc === 'en' ? dictionary.langEn : dictionary.langRu}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const SidebarNav = ({isMobile = false, isCollapsed = false} : {isMobile?: boolean, isCollapsed?: boolean}) => (
    <nav className={cn("flex flex-col space-y-1 py-4", isCollapsed && !isMobile ? "px-2 items-center" : "px-2")}>
      {filteredNavItems.map((item) => {
        const label = dictionary[item.labelKey] || item.labelKey; // Fallback to key if translation missing
        return (
          <TooltipProvider key={item.href} delayDuration={isMobile || !isCollapsed ? 999999 : 0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={item.href} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  <Button
                    variant={pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href)) ? 'secondary' : 'ghost'}
                    className={cn("w-full text-sm h-9", isCollapsed && !isMobile ? "justify-center px-2" : "justify-start")}
                    title={isCollapsed && !isMobile ? label : undefined}
                  >
                    <item.icon className={cn("h-5 w-5", isCollapsed && !isMobile ? "" : "mr-3")} />
                    {(!isCollapsed || isMobile) && <span className="truncate">{label}</span>}
                  </Button>
                </Link>
              </TooltipTrigger>
              {(isCollapsed && !isMobile) && (
                <TooltipContent side="right" className="bg-foreground text-background ml-2">{label}</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </nav>
  );
  
  const userRoleDisplay = currentAdminUser?.role ? dictionary.role.replace('{role}', currentAdminUser.role) : '';

  return (
    <div className="flex min-h-screen bg-muted/40 text-foreground">
      <aside className={cn(
          "hidden md:flex md:flex-col border-r bg-background fixed h-full z-40 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:w-16" : "md:w-64"
        )}
      >
        <div className={cn(
            "flex h-16 items-center border-b shrink-0",
            isSidebarCollapsed ? "justify-center px-2" : "px-6"
          )}
        >
          <Link href="/admin/dashboard" aria-label={dictionary.adminPanelTitle}>
            {isSidebarCollapsed ? <ShieldCheck className="h-7 w-7 text-primary" /> : <Logo />}
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav isCollapsed={isSidebarCollapsed} />
        </div>
        <div className={cn("border-t shrink-0 px-2 py-3", isSidebarCollapsed ? "px-2 py-3" : "px-6 py-4")}>
            <div className={cn("text-sm mb-2 leading-tight", isSidebarCollapsed ? "hidden" : "")}>
                <p className="font-semibold truncate">{currentAdminUser?.name}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1 text-primary"/> {userRoleDisplay}
                </p>
            </div>
            <Button
              variant="outline"
              size={isSidebarCollapsed ? "icon" : "sm"}
              className={cn("flex items-center mx-auto", isSidebarCollapsed ? "h-9 w-9 justify-center" : "w-full h-9 text-sm justify-start")}
              onClick={logout}
              title={dictionary.logout}
            >
                <LogOut className={cn("h-4 w-4", isSidebarCollapsed ? "" : "mr-2")} />
                {!isSidebarCollapsed && <span>{dictionary.logout}</span>}
            </Button>
        </div>
      </aside>

      <div className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:pl-16" : "md:pl-64"
        )}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center"> {/* Container for toggle and mobile logo */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:inline-flex mr-4"
              title={isSidebarCollapsed ? dictionary.toggleSidebarExpand : dictionary.toggleSidebarCollapse}
            >
              {isSidebarCollapsed ? <PanelRightOpen className="h-6 w-6" /> : <PanelLeftOpen className="h-6 w-6" />}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <Link href="/admin/dashboard" className="md:hidden" aria-label={dictionary.adminPanelTitle}>
              <Logo className="h-7"/>
            </Link>
          </div>
          
          <div className="flex items-center md:hidden"> {/* Mobile menu trigger only */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0 w-3/4 max-w-xs text-foreground">
                <SheetHeader className="flex flex-row justify-between items-center border-b p-6 shrink-0">
                   <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} aria-label={dictionary.adminPanelTitle}>
                    <Logo />
                   </Link>
                   <SheetTitle className="sr-only">{dictionary.mobileMenuTitle}</SheetTitle>
                   <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                         <X className="h-6 w-6" />
                         <span className="sr-only">Close menu</span>
                      </Button>
                   </SheetClose>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                  <SidebarNav isMobile={true} />
                </div>
                <div className="p-4 border-t shrink-0 space-y-3">
                    <div className="flex justify-around items-center">
                         <AdminLanguageSwitcher />
                         <Button variant="ghost" size="icon" onClick={toggleDarkMode} title={darkMode ? dictionary.themeToggleLight : dictionary.themeToggleDark}>
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                         </Button>
                    </div>
                  <div className="text-sm leading-tight text-center border-t pt-3 mt-2">
                      <p className="font-semibold truncate">{currentAdminUser?.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center justify-center">
                          <ShieldCheck className="h-3 w-3 mr-1 text-primary"/> {userRoleDisplay}
                      </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { logout(); setIsMobileMenuOpen(false);}} title={dictionary.logout}>
                      <LogOut className="mr-2 h-4 w-4" /> {dictionary.logout}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex items-center space-x-2 ml-auto">
            <AdminLanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} title={darkMode ? dictionary.themeToggleLight : dictionary.themeToggleDark}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
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


"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard, Package, ShoppingCart, Users as ClientsIcon, Megaphone, FileOutput, Landmark, Percent,
  FileText as ContentIcon, Settings, LogOut, Menu, ShieldCheck, UserCog as UserManagementIcon,
  PanelLeftOpen, PanelRightOpen, X, Sun, Moon, Globe as GlobeIcon, History, Tags, Beaker, Wind, ChevronDown
} from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { i18nAdmin, type AdminLocale } from '@/admin/lib/i18n-config-admin';
import { getAdminDictionary } from '@/admin/lib/getAdminDictionary';
import type enAdminMessages from '@/admin/dictionaries/en.json';
import { useIsMobile } from '@/hooks/use-mobile';
import '../globals.css';

type AdminDictionary = typeof enAdminMessages;
type AdminLayoutStrings = AdminDictionary['adminLayout'];

interface NavItem {
  href: string;
  labelKey: keyof AdminLayoutStrings;
  icon: React.ElementType;
  adminOnly?: boolean;
  managerOrAdmin?: boolean;
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  { href: '/admin/dashboard', labelKey: 'dashboard', icon: LayoutDashboard, managerOrAdmin: true },
  { href: '/admin/products', labelKey: 'products', icon: Package, managerOrAdmin: true },
  {
    href: '#!', labelKey: 'attributes', icon: Tags, managerOrAdmin: true, // Use #! or similar for non-navigable parent
    subItems: [
      { href: '/admin/attributes/categories', labelKey: 'categories', icon: Tags, managerOrAdmin: true },
      { href: '/admin/attributes/materials', labelKey: 'materials', icon: Beaker, managerOrAdmin: true },
      { href: '/admin/attributes/scents', labelKey: 'scents', icon: Wind, managerOrAdmin: true },
    ]
  },
  { href: '/admin/sales', labelKey: 'sales', icon: ShoppingCart, managerOrAdmin: true },
  { href: '/admin/clients', labelKey: 'clients', icon: ClientsIcon, managerOrAdmin: true },
  { href: '/admin/marketing', labelKey: 'marketing', icon: Megaphone, managerOrAdmin: true },
  { href: '/admin/reports', labelKey: 'reports', icon: FileOutput, managerOrAdmin: true },
  { href: '/admin/finances', labelKey: 'finances', icon: Landmark, managerOrAdmin: true },
  { href: '/admin/discounts', labelKey: 'discounts', icon: Percent, managerOrAdmin: true },
  { href: '/admin/content', labelKey: 'content', icon: ContentIcon, managerOrAdmin: true },
  { href: '/admin/logs', labelKey: 'logs', icon: History, adminOnly: true },
  { href: '/admin/settings', labelKey: 'settings', icon: Settings, adminOnly: true },
  { href: '/admin/users', labelKey: 'management', icon: UserManagementIcon, adminOnly: true },
];


function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { currentAdminUser, logout, isLoading: isLoadingAuth, isAdmin, isManager } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    }
    return false;
  });
  const [dictionary, setDictionary] = useState<AdminLayoutStrings | null>(null);
  const [currentLocale, setCurrentLocale] = useState<AdminLocale>(i18nAdmin.defaultLocale);
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = useIsMobile();

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
    localStorage.setItem('sidebar-collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

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

  if (pathname !== '/admin/login' && isMobile && currentAdminUser) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-8 text-center">
            <ShieldCheck className="h-16 w-16 text-primary mb-6" />
            <h2 className="text-2xl font-semibold mb-3">Admin Panel Access</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                For the best experience and full functionality, please access the Askim candles Admin Panel on a desktop or laptop computer.
            </p>
            <Button onClick={() => router.push(`/${i18nAdmin.defaultLocale}`)} variant="outline">Go to Main Site</Button>
            <p className="text-xs text-muted-foreground mt-8">
                If you need to log in, you can still do so, but management features are optimized for larger screens.
                <Link href="/admin/login" className="text-primary hover:underline ml-1">Admin Login</Link>
            </p>
        </div>
    );
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
    if (item.managerOrAdmin) return isManager || isAdmin;
    return true;
  });

  const AdminLanguageSwitcher = ({ isMobileContext = false }: { isMobileContext?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title={dictionary.selectLanguage}>
          <GlobeIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isMobileContext ? "center" : "end"}>
        {i18nAdmin.locales.map((loc) => (
          <DropdownMenuItem key={loc} onClick={() => changeLanguage(loc)} className={cn(currentLocale === loc ? "font-semibold text-primary" : "")}>
            {loc === 'en' ? dictionary.langEn : dictionary.langRu}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderNavItem = (item: NavItem, isMobileContext: boolean, isSidebarActuallyCollapsed: boolean) => {
    const label = dictionary[item.labelKey] || item.labelKey;
    const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && item.href !== '#!' && pathname.startsWith(item.href));
    const hasSubItems = item.subItems && item.subItems.length > 0;

    if (hasSubItems) {
      return (
        <DropdownMenu key={item.href}>
          <TooltipProvider delayDuration={isMobileContext || !isSidebarActuallyCollapsed ? 999999 : 0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      "w-full text-sm h-9 flex items-center",
                      isSidebarActuallyCollapsed && !isMobileContext ? "justify-center px-2" : "justify-start px-2",
                      isActive && "font-semibold"
                    )}
                    title={isSidebarActuallyCollapsed && !isMobileContext ? label : undefined}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isSidebarActuallyCollapsed && !isMobileContext ? "" : "mr-3")} />
                    {(!isSidebarActuallyCollapsed || isMobileContext) && <span className="truncate flex-1 text-left">{label}</span>}
                    {(!isSidebarActuallyCollapsed || isMobileContext) && <ChevronDown className="h-4 w-4 ml-auto shrink-0 opacity-50 group-data-[state=open]:rotate-180 transition-transform" />}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              {(isSidebarActuallyCollapsed && !isMobileContext) && (
                <TooltipContent side="right" className="bg-foreground text-background ml-2">{label}</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent 
            side={isMobileContext ? "bottom" : "right"} 
            align={isMobileContext ? "center" : "start"} 
            sideOffset={isMobileContext ? 4 : (isSidebarActuallyCollapsed ? 2 : 8)}
            className={cn(isMobileContext ? "w-[calc(100vw-4rem)]" : "min-w-[180px]")}
          >
            {item.subItems?.filter(subItem => subItem.adminOnly ? isAdmin : (subItem.managerOrAdmin ? (isManager || isAdmin) : true)).map(subItem => {
              const subLabel = dictionary[subItem.labelKey] || subItem.labelKey;
              return (
                <DropdownMenuItem key={subItem.href} asChild>
                  <Link href={subItem.href} onClick={() => isMobileContext && setIsMobileMenuOpen(false)}
                    className={cn("flex items-center gap-2", pathname === subItem.href && "bg-muted text-foreground font-semibold")}
                  >
                    <subItem.icon className="h-4 w-4" />
                    {subLabel}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <TooltipProvider key={item.href} delayDuration={isMobileContext || !isSidebarActuallyCollapsed ? 999999 : 0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href} onClick={() => isMobileContext && setIsMobileMenuOpen(false)}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn("w-full text-sm h-9", isSidebarActuallyCollapsed && !isMobileContext ? "justify-center px-2" : "justify-start px-2")}
                title={isSidebarActuallyCollapsed && !isMobileContext ? label : undefined}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isSidebarActuallyCollapsed && !isMobileContext ? "" : "mr-3")} />
                {(!isSidebarActuallyCollapsed || isMobileContext) && <span className="truncate">{label}</span>}
              </Button>
            </Link>
          </TooltipTrigger>
          {(isSidebarActuallyCollapsed && !isMobileContext) && (
            <TooltipContent side="right" className="bg-foreground text-background ml-2">{label}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  const SidebarNav = ({isMobileNav = false, isCollapsedNav = false} : {isMobileNav?: boolean, isCollapsedNav?: boolean}) => (
    <nav className={cn("flex flex-col space-y-1 py-4", isCollapsedNav && !isMobileNav ? "px-2 items-center" : "px-2")}>
      {filteredNavItems.map((item) => renderNavItem(item, isMobileNav, isCollapsedNav))}
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
          <SidebarNav isCollapsedNav={isSidebarCollapsed} />
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
                <LogOut className={cn("h-4 w-4 shrink-0", isSidebarCollapsed ? "" : "mr-2")} />
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
          <div className="flex items-center">
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
             <div className="md:hidden flex items-center"> 
                <Link href="/admin/dashboard" className="mr-2" aria-label={dictionary.adminPanelTitle}>
                    <Logo className="h-7"/>
                </Link>
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col p-0 w-3/4 max-w-xs text-foreground bg-background">
                       <SheetHeader className="flex flex-row justify-between items-center border-b p-4 shrink-0">
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
                            <SidebarNav isMobileNav={true} />
                        </div>
                        <div className="p-4 border-t shrink-0 space-y-3">
                            <div className="flex justify-around items-center">
                                <AdminLanguageSwitcher isMobileContext={true}/>
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
          </div>
          
          <div className="hidden md:flex items-center space-x-2 ml-auto">
            <AdminLanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} title={darkMode ? dictionary.themeToggleLight : dictionary.themeToggleDark}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </header>
        
        <div className="flex flex-col flex-1">
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                {children}
            </main>
            <footer className="border-t mt-auto bg-background/50 text-muted-foreground text-xs text-center p-3 shrink-0">
                Askim candles Admin Panel v0.1.0 (Simulated) - Last Updated: {new Date().toLocaleDateString()} (Simulated)
            </footer>
        </div>
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

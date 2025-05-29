"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  LayoutDashboard, Package, ShoppingCart, Users as ClientsIcon, Megaphone, FileOutput, Landmark, Percent,
  FileText as ContentIcon, Settings, LogOut, Menu, ShieldCheck, UserCog as UserManagementIcon,
  PanelLeftOpen, PanelRightOpen, X, Sun, Moon, Globe as GlobeIcon, History, Tags, ChevronDown, FileText as ArticlesIcon, Beaker, Wind, Users // Added Users for Sessions
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
  isAccordion?: boolean;
}

const navItems: NavItem[] = [
  { href: '/admin/dashboard', labelKey: 'dashboard', icon: LayoutDashboard, managerOrAdmin: true },
  { href: '/admin/products', labelKey: 'products', icon: Package, managerOrAdmin: true },
  { href: '/admin/articles', labelKey: 'articles', icon: ArticlesIcon, managerOrAdmin: true },
  {
    href: '#!', labelKey: 'attributes', icon: Tags, adminOnly: true, isAccordion: true,
    subItems: [
      { href: '/admin/attributes/categories', labelKey: 'categories', icon: Tags, adminOnly: true },
      { href: '/admin/attributes/materials', labelKey: 'materials', icon: Beaker, adminOnly: true },
      { href: '/admin/attributes/scents', labelKey: 'scents', icon: Wind, adminOnly: true },
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
  { href: '/admin/sessions', labelKey: 'sessions', icon: Users, adminOnly: true }, // New Sessions Link
  { href: '/admin/settings', labelKey: 'settings', icon: Settings, adminOnly: true },
  { href: '/admin/users', labelKey: 'management', icon: UserManagementIcon, adminOnly: true },
];


function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { currentAdminUser, logout, isLoading: isLoadingAuth, isAdmin, isManager } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dictionary, setDictionary] = useState<AdminLayoutStrings | null>(null);
  const [currentLocale, setCurrentLocale] = useState<AdminLocale>(i18nAdmin.defaultLocale);
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    setIsSidebarCollapsed(storedCollapsed);

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
    if(isClient) { 
      localStorage.setItem('sidebar-collapsed', String(isSidebarCollapsed));
    }
  }, [isSidebarCollapsed, isClient]);

  useEffect(() => {
    async function loadDictionary() {
      const dictModule = await getAdminDictionary(currentLocale);
      setDictionary(dictModule.adminLayout);
    }
    if(isClient) loadDictionary();
  }, [currentLocale, isClient]);
  
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

  useEffect(() => {
    if (!isLoadingAuth && !currentAdminUser && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isLoadingAuth, currentAdminUser, pathname, router]);

  if (isLoadingAuth || !dictionary) {
    return <div className="flex h-screen items-center justify-center bg-muted"><p>Loading Admin Panel...</p></div>;
  }
  
  if (pathname !== '/admin/login' && isClient && isMobile && currentAdminUser) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-8 text-center">
            <ShieldCheck className="h-16 w-16 text-primary mb-6" />
            <h2 className="text-2xl font-semibold mb-3">Admin Panel Access</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                For the best experience and full functionality, please access the Askim candles Admin Panel on a desktop or laptop computer.
            </p>
            <Button onClick={() => router.push(`/${currentLocale}`)} variant="outline">Go to Main Site</Button>
            <p className="text-xs text-muted-foreground mt-8">
                If you need to log in, you can still do so, but management features are optimized for larger screens.
                <Link href="/admin/login" className="text-primary hover:underline ml-1">Admin Login</Link>
            </p>
        </div>
    );
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
    const isParentOfActive = item.subItems?.some(subItem => pathname.startsWith(subItem.href));
    const isDesktopExpanded = !isMobileContext && !isSidebarActuallyCollapsed;

    if (item.isAccordion && isDesktopExpanded) {
      return (
        <AccordionItem value={item.labelKey} key={item.labelKey} className="border-b-0">
          <AccordionTrigger
            className={cn(
              "w-full text-sm h-9 flex items-center group hover:bg-muted/80 focus:bg-muted/80 rounded-md transition-colors duration-100 ease-in-out justify-between px-2 py-1.5",
              (isParentOfActive || isActive) && "bg-muted font-semibold" 
            )}
          >
            <div className="flex items-center">
              <item.icon className="h-5 w-5 shrink-0 mr-3" />
              <span className="truncate flex-1 text-left">{label}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-0 pl-2">
            <div className="flex flex-col space-y-1 py-1 pl-5 border-l border-muted-foreground/30 ml-2">
              {item.subItems?.filter(subItem => subItem.adminOnly ? isAdmin : (subItem.managerOrAdmin ? (isManager || isAdmin) : true)).map(subItem => {
                const subLabel = dictionary[subItem.labelKey] || subItem.labelKey;
                const isSubActive = pathname === subItem.href;
                return (
                  <Link key={subItem.href} href={subItem.href}>
                    <Button
                      variant={isSubActive ? 'secondary' : 'ghost'}
                      className={cn(
                        "w-full text-xs h-8 justify-start px-2 py-1 hover:bg-muted/50",
                        isSubActive && "font-semibold"
                      )}
                    >
                      <subItem.icon className="h-4 w-4 mr-2 shrink-0" />
                      <span className="truncate">{subLabel}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    }
    
    if (item.subItems && (isMobileContext || (isSidebarActuallyCollapsed && !item.isAccordion) )) {
       return (
        <DropdownMenu key={item.href}>
          <TooltipProvider delayDuration={isMobileContext || !isSidebarActuallyCollapsed ? 999999 : 0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isActive || isParentOfActive ? 'secondary' : 'ghost'}
                    className={cn(
                      "w-full text-sm h-9 flex items-center group hover:bg-muted/80",
                      isSidebarActuallyCollapsed && !isMobileContext ? "justify-center px-2" : "justify-start px-2",
                      (isActive || isParentOfActive) && "font-semibold"
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
            sideOffset={isMobileContext ? 4 : (isSidebarActuallyCollapsed ? (isMobile ? 4 : 2) : 8)}
            className={cn("z-50", isMobileContext ? "w-[calc(100vw-4rem)]" : "min-w-[180px]")}
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

    // Regular Link
    return (
      <TooltipProvider key={item.href} delayDuration={isMobileContext || !isSidebarActuallyCollapsed ? 999999 : 0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href} onClick={() => isMobileContext && setIsMobileMenuOpen(false)}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn("w-full text-sm h-9 hover:bg-muted/80", isSidebarActuallyCollapsed && !isMobileContext ? "justify-center px-2" : "justify-start px-2")}
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

  const SidebarNav = ({ isMobileNav = false, isCollapsedNav = false }: { isMobileNav?: boolean, isCollapsedNav?: boolean }) => {
    const isDesktopExpanded = !isMobileNav && !isCollapsedNav;

    if (isDesktopExpanded) {
      return (
        <Accordion type="multiple" className="w-full px-2 py-4 space-y-0.5">
          {filteredNavItems.map((item) => renderNavItem(item, false, false))}
        </Accordion>
      );
    } else {
      return (
        <nav className={cn("flex flex-col space-y-1 py-4", isCollapsedNav ? "px-2 items-center" : "px-2")}>
          {filteredNavItems.map((item) => renderNavItem(item, isMobileNav, isCollapsedNav))}
        </nav>
      );
    }
  };
  
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
        <div className={cn("border-t shrink-0 px-2 py-3 mt-auto", isSidebarCollapsed ? "px-2 py-3" : "px-6 py-4")}>
            <div className={cn("leading-tight mb-2", isSidebarCollapsed ? "hidden" : "")}>
                <p className="font-semibold truncate text-sm">{currentAdminUser?.name}</p>
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
                 <Link href="/admin/dashboard" className="ml-2 md:hidden" aria-label={dictionary.adminPanelTitle}>
                    <Logo className="h-7"/>
                </Link>
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
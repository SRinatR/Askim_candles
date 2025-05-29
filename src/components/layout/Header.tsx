
"use client";

import Link from 'next/link';
import { ShoppingBag, User, Menu, Search, X, LogIn, LogOut, Globe, ChevronDown, Info } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useAuth as useSimulatedAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i1n-config';
import { i18n } from '@/lib/i1n-config';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  locale: Locale;
  dictionary: {
    home: string;
    products: string;
    about: string;
    usefulInfo: string;
    soyWaxInfoTitle: string;
    aromaSachetInfoTitle: string;
    cart: string;
    account: string;
    login: string;
    logout: string;
    searchPlaceholder: string;
    mainMenuTitle: string;
    langUz: string;
    langRu: string;
    langEn: string;
  };
}

export function Header({ locale, dictionary }: HeaderProps) {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const { currentUser: simulatedUser, logout: simulatedLogout, isLoading: isLoadingSimulatedAuth } = useSimulatedAuth();
  
  const isAuthenticated = !!nextAuthSession || !!simulatedUser;
  const isLoadingAuth = nextAuthStatus === "loading" || isLoadingSimulatedAuth;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const currentPathWithoutLocale = pathname.startsWith(`/${locale}`) ? pathname.substring(`/${locale}`.length) : pathname;
  if (currentPathWithoutLocale === "") {
    // Ensures that the root path remains / and not //
    // currentPathWithoutLocale = '/';
  }


  const isAdminPath = pathname.split('/').includes('admin');
  if (isAdminPath) {
    return null;
  }

  const navLinks = [
    { href: '/', label: dictionary.home },
    { href: '/products', label: dictionary.products },
    { href: '/about', label: dictionary.about },
  ];

  const usefulInfoLinks = [
    { href: '/info/soy-wax', label: dictionary.soyWaxInfoTitle },
    { href: '/info/aroma-sachet', label: dictionary.aromaSachetInfoTitle },
  ];

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery.trim())}`);
      if (isMobileMenuOpen) setIsMobileMenuOpen(false); 
    }
  };

  const handleLogout = async () => {
    if (nextAuthSession) {
      await nextAuthSignOut({ callbackUrl: `/${locale}/` });
    }
    if (simulatedUser) {
      simulatedLogout();
      router.push(`/${locale}/`);
    }
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const accountLink = isAuthenticated ? `/${locale}/account/profile` : `/${locale}/login`;
  
  let userName = "";
  if (nextAuthSession?.user?.name) {
    userName = nextAuthSession.user.name;
  } else if (simulatedUser?.name) {
    userName = simulatedUser.name;
  } else if (nextAuthSession?.user?.email) {
    userName = nextAuthSession.user.email;
  } else if (simulatedUser?.email) {
    userName = simulatedUser.email;
  }

  const LanguageSwitcher = () => {
    const getLangName = (loc: Locale) => {
      if (loc === 'uz') return dictionary.langUz;
      if (loc === 'ru') return dictionary.langRu;
      return dictionary.langEn;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Change language">
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {i18n.locales.map((loc) => (
            <DropdownMenuItem key={loc} asChild>
              <Link
                href={`/${loc}${currentPathWithoutLocale || '/'}`}
                className={cn(
                  "w-full flex items-center",
                  locale === loc ? "font-semibold text-primary" : ""
                )}
              >
                {getLangName(loc)}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}/`} className="flex items-center" aria-label="Back to homepage">
          <Logo className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center space-x-4 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground p-0 h-auto">
                {dictionary.usefulInfo} <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {usefulInfoLinks.map(link => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={`/${locale}${link.href}`}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        <div className="flex items-center space-x-1 sm:space-x-3">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center relative">
            <Input type="search" name="search" placeholder={dictionary.searchPlaceholder} className="h-9 pr-10 w-32 sm:w-48 lg:w-64" />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>

          {!isLoadingAuth && (
            <>
              {isAuthenticated ? (
                <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex" title={userName || dictionary.account}>
                  <Link href={accountLink}>
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                 <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex" title={dictionary.login}>
                   <Link href={`/${locale}/login`}>
                     <LogIn className="mr-1 h-4 w-4" /> {dictionary.login}
                   </Link>
                </Button>
              )}
            </>
          )}
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${locale}/cart`} className="relative" aria-label={`${dictionary.cart}, ${cartCount} items`}>
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          
          <div className="hidden md:flex"> 
            <LanguageSwitcher />
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background p-0 text-foreground">
              <div className="flex flex-col h-full"> 
                <SheetHeader className="flex flex-row justify-between items-center border-b p-4 shrink-0">
                   <Link href={`/${locale}/`} onClick={() => setIsMobileMenuOpen(false)}>
                      <Logo className="h-7 w-auto" />
                   </Link>
                   <SheetTitle className="sr-only">{dictionary.mainMenuTitle}</SheetTitle>
                   <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                         <X className="h-6 w-6" />
                         <span className="sr-only">Close menu</span>
                      </Button>
                   </SheetClose>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto px-4 space-y-4 py-4"> 
                  <form onSubmit={handleSearch} className="flex items-center relative">
                    <Input type="search" name="search" placeholder={dictionary.searchPlaceholder} className="h-10 pr-12 w-full" />
                    <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10">
                      <Search className="h-5 w-5" />
                      <span className="sr-only">Search</span>
                    </Button>
                  </form>

                  <nav className="flex flex-col space-y-3">
                    {navLinks.map(link => (
                      <Link
                        key={link.href}
                        href={`/${locale}${link.href}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-base font-medium text-foreground/80 transition-colors hover:text-foreground p-0 h-auto justify-start">
                          {dictionary.usefulInfo} <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[calc(100%-2rem)] ml-4"> {/* Adjust width and margin as needed */}
                        {usefulInfoLinks.map(link => (
                          <DropdownMenuItem key={link.href} asChild>
                            <Link href={`/${locale}${link.href}`} onClick={() => setIsMobileMenuOpen(false)}>{link.label}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </nav>
                  
                  <div className="pt-3 border-t md:hidden">
                     <p className="text-sm text-muted-foreground mb-1">Language:</p>
                     <div className="flex items-center space-x-1">
                        {i18n.locales.map((loc) => ( 
                          <Link
                            key={loc}
                            href={`/${loc}${currentPathWithoutLocale || '/'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "rounded-md px-2 py-1 text-xs hover:bg-muted flex-1 text-center",
                              locale === loc ? "font-semibold text-primary bg-muted" : "text-foreground/80"
                            )}
                          >
                            {loc === 'uz' ? dictionary.langUz : loc === 'ru' ? dictionary.langRu : dictionary.langEn}
                          </Link>
                        ))}
                     </div>
                  </div>
                </div>
                
                <div className="border-t border-border p-4 space-y-3 shrink-0">
                  {!isLoadingAuth && (
                    <>
                      {isAuthenticated ? (
                        <>
                          <Link
                            href={accountLink}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-2 text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
                          >
                            <User className="h-5 w-5" />
                            <span>{userName || dictionary.account}</span>
                          </Link>
                          <Button variant="outline" 
                            onClick={handleLogout}
                            className="w-full text-base"
                          >
                            <LogOut className="mr-2 h-5 w-5" />
                            <span>{dictionary.logout}</span>
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="ghost" 
                          onClick={() => { router.push(`/${locale}/login`); setIsMobileMenuOpen(false); }}
                          className="flex items-center space-x-2 text-base font-medium text-foreground/80 transition-colors hover:text-foreground w-full justify-start p-0 h-auto"
                        >
                          <LogIn className="h-5 w-5" />
                          <span>{dictionary.login}</span>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

    
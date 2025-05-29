
"use client";

import Link from 'next/link';
import { ShoppingBag, User, Menu, Search, X, LogIn, LogOut, Globe } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  locale: Locale;
  dictionary: {
    home: string;
    products: string;
    about: string;
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

  const currentPathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  const isAdminPath = pathname.split('/').includes('admin');
  if (isAdminPath) {
    return null;
  }

  const navLinks = [
    { href: '/', label: dictionary.home },
    { href: '/products', label: dictionary.products },
    { href: '/about', label: dictionary.about },
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
                href={`/${loc}${currentPathWithoutLocale}`}
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

        <nav className="hidden items-center space-x-6 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
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
          
          <div className="hidden md:flex"> {/* Language switcher for desktop */}
            <LanguageSwitcher />
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background p-0">
              <div className="flex flex-col h-full"> {/* Ensure flex-col and h-full for proper layout */}
                <SheetHeader className="flex flex-row justify-between items-center border-b p-6 shrink-0">
                   <Link href={`/${locale}/`} onClick={() => setIsMobileMenuOpen(false)}>
                      <Logo className="h-7 w-auto" />
                   </Link>
                   <SheetTitle className="sr-only">{dictionary.mainMenuTitle}</SheetTitle>
                   <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                         <X className="h-6 w-6" />
                      </Button>
                   </SheetClose>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto px-6 space-y-6 py-6"> {/* Added py-6 for padding */}
                  <form onSubmit={handleSearch} className="flex items-center relative">
                    <Input type="search" name="search" placeholder={dictionary.searchPlaceholder} className="h-10 pr-12 w-full" />
                    <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10">
                      <Search className="h-5 w-5" />
                      <span className="sr-only">Search</span>
                    </Button>
                  </form>

                  <nav className="flex flex-col space-y-4">
                    {navLinks.map(link => (
                      <Link
                        key={link.href}
                        href={`/${locale}${link.href}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="pt-4 border-t md:hidden">
                     <p className="text-sm text-muted-foreground mb-2">Language:</p>
                     <div className="flex items-center justify-around space-x-1"> {/* Changed to flex for horizontal layout */}
                        {i18n.locales.map((loc) => ( 
                          <Link
                            key={loc}
                            href={`/${loc}${currentPathWithoutLocale}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "rounded-md px-2.5 py-1.5 text-sm hover:bg-muted", // Adjusted padding for compactness
                              locale === loc ? "font-semibold text-primary bg-muted" : "text-foreground/80"
                            )}
                          >
                            {loc === 'uz' ? dictionary.langUz : loc === 'ru' ? dictionary.langRu : dictionary.langEn}
                          </Link>
                        ))}
                     </div>
                  </div>
                </div>
                
                <div className="border-t border-border p-6 space-y-3 shrink-0"> {/* Added shrink-0 */}
                  {!isLoadingAuth && (
                    <>
                      {isAuthenticated ? (
                        <>
                          <Link
                            href={accountLink}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-2 text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                          >
                            <User className="h-5 w-5" />
                            <span>{userName || dictionary.account}</span>
                          </Link>
                          <Button variant="outline" 
                            onClick={handleLogout}
                            className="w-full text-lg"
                          >
                            <LogOut className="mr-2 h-5 w-5" />
                            <span>{dictionary.logout}</span>
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="ghost" 
                          onClick={() => { router.push(`/${locale}/login`); setIsMobileMenuOpen(false); }}
                          className="flex items-center space-x-2 text-lg font-medium text-foreground/80 transition-colors hover:text-foreground w-full justify-start p-0"
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

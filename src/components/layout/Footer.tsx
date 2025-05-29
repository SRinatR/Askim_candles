
"use client";

import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i1n-config';
import Link from 'next/link';

interface FooterProps {
  locale: Locale;
  dictionary: {
    rightsReserved: string;
    privacyPolicy: string;
    termsOfService: string;
  };
}

export function Footer({ locale, dictionary }: FooterProps) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Check if the current path starts with the admin path, irrespective of locale
  // e.g., /admin, /uz/admin, /en/admin
  const isAdminPath = pathname.split('/').includes('admin');

  if (isAdminPath) {
    return null;
  }
  
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>&copy; {currentYear} ScentSational Showcase. {dictionary.rightsReserved}</p>
        <div className="flex space-x-4">
          <Link href={`/${locale}/privacy`} className="hover:text-foreground">{dictionary.privacyPolicy}</Link> {/* TODO: Create /privacy page */}
          <Link href={`/${locale}/terms`} className="hover:text-foreground">{dictionary.termsOfService}</Link> {/* TODO: Create /terms page */}
        </div>
      </div>
    </footer>
  );
}

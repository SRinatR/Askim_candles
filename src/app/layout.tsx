
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { i18n } from '@/lib/i1n-config';

// This root layout only redirects to the default locale
// All actual content and main layout are in /app/[locale]/layout.tsx

export const metadata: Metadata = {
  title: 'ScentSational Showcase', // Generic title, will be overridden by locale specific
  description: 'Discover artisanal candles, wax figures, and gypsum products.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This component will not be rendered directly as page.tsx redirects.
  // However, Next.js requires a root layout.
  return (
    <html lang={i18n.defaultLocale}>
      <body>
        {children}
      </body>
    </html>
  );
}

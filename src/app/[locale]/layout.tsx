import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '../providers';
import { getDictionary } from '@/lib/getDictionary';
import type { Locale } from '@/lib/i1n-config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const locale = params.locale;
  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  const locale = params.locale;
  const dictionary = await getDictionary(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <Header locale={locale} dictionary={dictionary.navigation} />
          <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer locale={locale} dictionary={dictionary.footer} />
        </Providers>
      </body>
    </html>
  );
}
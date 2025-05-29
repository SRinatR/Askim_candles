
"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from '@/lib/i1n-config';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, BookText, Leaf, Droplet } from 'lucide-react'; // Added icons
import { Slash } from 'lucide-react';

// Placeholder for dictionary loading
import enMessages from '@/dictionaries/en.json';
import ruMessages from '@/dictionaries/ru.json';
import uzMessages from '@/dictionaries/uz.json';

type Dictionary = typeof enMessages;

const dictionaries: Record<Locale, Dictionary> = {
  en: enMessages,
  ru: ruMessages,
  uz: uzMessages,
};

const getUsefulInfoPageDictionary = (locale: Locale) => {
  return {
    page: dictionaries[locale]?.usefulInfoPage || dictionaries.en.usefulInfoPage,
    nav: dictionaries[locale]?.navigation || dictionaries.en.navigation,
  }
};


export default function UsefulInfoPage() {
  const params = useParams();
  const locale = params.locale as Locale || 'uz';
  const dictBundle = getUsefulInfoPageDictionary(locale);
  const dictionary = dictBundle.page;
  const navDictionary = dictBundle.nav;

  const articles = [
    { 
      title: navDictionary.soyWaxInfoTitle, 
      href: `/${locale}/info/soy-wax`,
      description: dictionary.soyWaxTeaser, // Assuming you add these to your dictionary
      icon: Leaf
    },
    { 
      title: navDictionary.aromaSachetInfoTitle, 
      href: `/${locale}/info/aroma-sachet`,
      description: dictionary.aromaSachetTeaser, // Assuming you add these to your dictionary
      icon: Droplet
    },
    // Add more articles here as needed
  ];

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/`}>{navDictionary.home}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{dictionary.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">{dictionary.title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{dictionary.description}</p>
      </header>
      
      <div className="grid md:grid-cols-2 gap-6">
        {articles.map((article) => {
          const Icon = article.icon;
          return (
            <Card key={article.href} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-3 pb-3">
                 <div className="p-2 bg-primary/10 rounded-md">
                    <Icon className="h-6 w-6 text-primary" />
                 </div>
                 <CardTitle className="text-xl">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription>{article.description}</CardDescription>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href={article.href}>
                    {dictionary.readMoreButton} <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

    

"use client";
// This file needs to be moved into src/app/[locale]/about/page.tsx
// and adapted to use the dictionary from getDictionary(locale)

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Slash, Heart, Leaf, Lightbulb } from 'lucide-react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/lib/i1n-config';
// import { getDictionary } from '@/lib/getDictionary'; // This would be for Server Component

// For client components, translations would typically come via context or props
// For simplicity in this step, we'll use hardcoded or placeholder text
// A full solution would involve a client-side i18n library or passing dictionary via props

export default function AboutUsPage() {
  const params = useParams();
  const locale = params.locale as Locale || 'uz'; // Fallback, ensure locale is available

  // Placeholder text, replace with dictionary access
  const pageTitle = "About Us"; 
  const heroTitleMain = "About";
  const heroTitleHighlight = "ScentSational Showcase";
  const heroSubtitle = "Discover the passion, craftsmanship, and inspiration behind every product we create.";
  const ourStoryTitle = "Our Story";
  const ourStoryP1 = "ScentSational Showcase was born from a love for artisanal craftsmanship and the transformative power of scent. We believe that everyday items can be sources of joy and tranquility. Our journey began with a simple desire: to create high-quality, handcrafted products that elevate your space and soothe your senses.";
  const ourStoryP2 = "From hand-poured candles with captivating fragrances to unique wax figures and elegant gypsum decor, each item is meticulously designed and crafted with care. We are dedicated to using quality materials and sustainable practices wherever possible.";
  const valuesTitle = "Our Values";
  const passionTitle = "Passion & Craftsmanship";
  const passionDesc = "Every item is made with love and attention to detail, ensuring a unique and high-quality product.";
  const qualityTitle = "Quality Ingredients";
  const qualityDesc = "We source the finest materials, from natural waxes to premium fragrance oils, for a superior experience.";
  const inspiredTitle = "Inspired Designs";
  const inspiredDesc = "Our products are thoughtfully designed to bring beauty, warmth, and a touch of elegance to your home.";
  const communityTitle = "Join Our Community";
  const communityDesc = "We're more than just a store; we're a community of scent enthusiasts and lovers of handcrafted beauty. Follow us on social media and sign up for our newsletter for updates, new arrivals, and special offers.";


  return (
    <div className="space-y-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/`}>Home</BreadcrumbLink> {/* TODO: Translate */}
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {heroTitleMain} <span className="text-primary">{heroTitleHighlight}</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {heroSubtitle}
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-semibold text-foreground mb-4">{ourStoryTitle}</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {ourStoryP1}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {ourStoryP2}
          </p>
        </div>
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
          <Image 
            src="https://placehold.co/600x400.png" 
            alt="Artisanal workshop" 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            data-ai-hint="artisanal workshop"
          />
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center text-foreground mb-8">{valuesTitle}</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center">
              <div className="p-3 bg-primary/20 rounded-full mb-3">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">{passionTitle}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              {passionDesc}
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center">
              <div className="p-3 bg-primary/20 rounded-full mb-3">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">{qualityTitle}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              {qualityDesc}
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center">
              <div className="p-3 bg-primary/20 rounded-full mb-3">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">{inspiredTitle}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              {inspiredDesc}
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="text-center bg-secondary/50 rounded-xl p-8 md:p-12 shadow-md">
        <h2 className="text-2xl md:text-3xl font-semibold text-secondary-foreground mb-4">{communityTitle}</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          {communityDesc}
        </p>
      </section>
    </div>
  );
}

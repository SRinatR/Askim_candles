
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProductList } from '@/components/products/ProductList';
import type { ProductCardDictionary } from '@/components/products/ProductCard';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getDictionary } from '@/lib/getDictionary';
import type { Locale } from '@/lib/i1n-config';

export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);
  const activeProducts = mockProducts.filter(p => p.isActive);
  const featuredProducts = activeProducts.slice(0, 4);

  const productCardStrings: ProductCardDictionary = dictionary.productCard || {
    addToCart: "Add to Cart (HomePage Fallback)",
    addedToCartTitle: "Added to cart (HomePage Fallback)",
    addedToCartDesc: "{productName} has been added (HomePage Fallback).",
    outOfStock: "Out of Stock (HomePage Fallback)"
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/30 via-background to-background rounded-xl p-8 md:p-16 text-center overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-20">
           {/* You can add a subtle background pattern or image here if desired */}
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            {dictionary.homepage.heroTitle.main} <span className="text-primary">{dictionary.homepage.heroTitle.highlight}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {dictionary.homepage.heroSubtitle}
          </p>
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-all transform hover:scale-105">
            <Link href={`/${locale}/products`}>
              {dictionary.homepage.shopAllButton} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-semibold tracking-tight text-center mb-8">{dictionary.homepage.categoriesTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mockCategories.map(category => (
            <Link key={category.id} href={`/${locale}/products?category=${category.slug}`} className="group block">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={`https://placehold.co/400x300.png?text=${encodeURIComponent(dictionary.categories[category.slug as keyof typeof dictionary.categories] || category.name)}`}
                  alt={dictionary.categories[category.slug as keyof typeof dictionary.categories] || category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={`${category.slug} items`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-colors duration-300 flex items-center justify-center">
                  <h3 className="text-2xl font-semibold text-white text-center p-4">{dictionary.categories[category.slug as keyof typeof dictionary.categories] || category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold tracking-tight">{dictionary.homepage.featuredProductsTitle}</h2>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/products`}>{dictionary.homepage.viewAllButton} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <ProductList products={featuredProducts} locale={locale} dictionary={productCardStrings} />
      </section>

      {/* Call to Action / Brand Story Snippet */}
      <section className="bg-secondary/50 rounded-xl p-8 md:p-12 text-center shadow-md">
        <h2 className="text-2xl md:text-3xl font-semibold text-secondary-foreground mb-4">{dictionary.homepage.ctaTitle}</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          {dictionary.homepage.ctaSubtitle}
        </p>
        <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Link href={`/${locale}/about`}>{dictionary.homepage.learnMoreButton}</Link>
        </Button>
      </section>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProductList } from '@/components/products/ProductList';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = mockProducts.slice(0, 4); // Show first 4 products as featured

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/30 via-background to-background rounded-xl p-8 md:p-16 text-center overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-20">
           {/* You can add a subtle background pattern or image here if desired */}
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Discover Your Perfect <span className="text-primary">Scent</span>sation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our exquisite collection of handcrafted candles, unique wax figures, and elegant gypsum products.
          </p>
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-all transform hover:scale-105">
            <Link href="/products">
              Shop All Products <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-semibold tracking-tight text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mockCategories.map(category => (
            <Link key={category.id} href={`/products?category=${category.slug}`} className="group block">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image 
                  src={`https://placehold.co/400x300.png?text=${encodeURIComponent(category.name)}`} 
                  alt={category.name} 
                  layout="fill" 
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={`${category.slug} items`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-colors duration-300 flex items-center justify-center">
                  <h3 className="text-2xl font-semibold text-white text-center p-4">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold tracking-tight">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link href="/products">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <ProductList products={featuredProducts} />
      </section>

      {/* Call to Action / Brand Story Snippet */}
      <section className="bg-secondary/50 rounded-xl p-8 md:p-12 text-center shadow-md">
        <h2 className="text-2xl md:text-3xl font-semibold text-secondary-foreground mb-4">Crafted with Passion, Designed for You</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          At ScentSational Showcase, we believe in the art of creation. Each piece is thoughtfully designed and meticulously crafted to bring warmth, beauty, and tranquility to your space.
        </p>
        <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Link href="#">Learn More About Us</Link>
        </Button>
      </section>
    </div>
  );
}

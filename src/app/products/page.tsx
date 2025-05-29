"use client";
import { ProductList } from '@/components/products/ProductList';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductSort } from '@/components/products/ProductSort';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';


export default function ProductsPage() {
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get('search')?.toLowerCase();
  const categories = searchParams.getAll('category');
  const scents = searchParams.getAll('scent');
  const materials = searchParams.getAll('material');
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || Infinity;
  const sortOption = searchParams.get('sort') || 'relevance';

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = searchTerm ? product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm) : true;
    const matchesCategory = categories.length > 0 ? categories.includes(product.category.toLowerCase().replace(/\s+/g, '-')) : true; // Assuming category in product is "Artisanal Candles" and slug is "artisanal-candles"
    const matchesScent = scents.length > 0 && product.scent ? scents.includes(product.scent) : scents.length === 0;
    const matchesMaterial = materials.length > 0 && product.material ? materials.includes(product.material) : materials.length === 0;
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesScent && matchesMaterial && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      // 'newest' and 'relevance' would typically require backend logic (e.g., creation date or search score)
      // For mock data, 'newest' could be reverse order of IDs if IDs are sequential, or just default.
      case 'newest': // Assuming higher ID is newer for mock data
         return parseInt(b.id) - parseInt(a.id);
      default: // relevance or default
        return 0; 
    }
  });
  
  const pageTitle = searchTerm ? `Search results for "${searchTerm}"` : "All Products";
  const productsCount = sortedProducts.length;

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-center justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{productsCount} product{productsCount !== 1 ? 's' : ''} found</p>
        </div>
        <ProductSort />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <ProductFilters />
        <div className="flex-1">
          {sortedProducts.length > 0 ? (
            <ProductList products={sortedProducts} />
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
              <p className="text-muted-foreground">
                {searchTerm ? `Your search for "${searchTerm}" did not match any products.` : "We couldn't find products matching your current filters."}
              </p>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

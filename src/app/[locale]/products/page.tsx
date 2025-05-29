
"use client";
import { ProductList } from '@/components/products/ProductList';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductSort } from '@/components/products/ProductSort';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { useSearchParams, useParams } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';
import type { Locale } from '@/lib/i1n-config';
import type { ProductCardDictionary } from '@/components/products/ProductCard';

// Importing main dictionaries
import enMessages from '@/dictionaries/en.json';
import ruMessages from '@/dictionaries/ru.json';
import uzMessages from '@/dictionaries/uz.json';

type FullDictionary = typeof enMessages; // Assuming en.json has all keys

const dictionaries: Record<Locale, FullDictionary> = {
  en: enMessages,
  ru: ruMessages,
  uz: uzMessages,
};

const getCombinedDictionary = (locale: Locale) => {
  const dict = dictionaries[locale] || dictionaries.en;
  return {
    productsPage: dict.productsPage,
    productFilters: dict.productFilters,
    productSort: dict.productSort,
    productCard: dict.productCard || { // Fallback for productCard
      addToCart: "Add to Cart (ProductsPage Fallback)",
      addedToCartTitle: "Added to cart (ProductsPage Fallback)",
      addedToCartDesc: "{productName} has been added (ProductsPage Fallback)."
    },
  };
};


export default function ProductsPage() {
  const searchParams = useSearchParams();
  const routeParams = useParams();
  const locale = routeParams.locale as Locale || 'uz';
  const combinedDict = getCombinedDictionary(locale);
  const dictionary = combinedDict.productsPage;
  const filtersDictionary = combinedDict.productFilters;
  const sortDictionary = combinedDict.productSort;
  const productCardDictionaryForList = combinedDict.productCard as ProductCardDictionary;


  const searchTerm = searchParams.get('search')?.toLowerCase();
  const categories = searchParams.getAll('category');
  const scents = searchParams.getAll('scent');
  const materials = searchParams.getAll('material');
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || Infinity;
  const sortOption = searchParams.get('sort') || 'relevance';

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = searchTerm ? product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm) : true;
    const productCategorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
    const matchesCategory = categories.length > 0 ? categories.includes(productCategorySlug) : true;
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
      case 'newest':
         return parseInt(b.id) - parseInt(a.id); // Assuming IDs are numeric strings
      default:
        return 0;
    }
  });

  const pageTitle = searchTerm ? dictionary.searchResultsTitle.replace('{searchTerm}', searchTerm) : dictionary.allProductsTitle;
  const productsCount = sortedProducts.length;

  let productsCountText = "";
  if (productsCount === 1) {
    productsCountText = dictionary.productsFound.replace('{count}', String(productsCount));
  } else if (locale === 'ru' && (productsCount % 10 >= 2 && productsCount % 10 <= 4) && !(productsCount % 100 >= 12 && productsCount % 100 <= 14) ) {
    productsCountText = (dictionary.productsFound_few || dictionary.productsFound_plural!).replace('{count}', String(productsCount));
  } else {
     productsCountText = (dictionary.productsFound_plural || dictionary.productsFound).replace('{count}', String(productsCount));
  }


  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/`}>{dictionary.homeBreadcrumb}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{dictionary.productsBreadcrumb}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-center justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: productsCountText.replace(String(productsCount), `<strong>${productsCount}</strong>`) }} />
        </div>
        <ProductSort dictionary={sortDictionary} />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <ProductFilters dictionary={filtersDictionary} categoriesData={mockCategories} />
        <div className="flex-1">
          {sortedProducts.length > 0 ? (
            <ProductList products={sortedProducts} locale={locale} dictionary={productCardDictionaryForList} />
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold mb-2">{dictionary.noProductsFound}</h2>
              <p className="text-muted-foreground">
                {searchTerm ? dictionary.searchNoMatch.replace('{searchTerm}', searchTerm) : dictionary.filterNoMatch}
              </p>
              <p className="text-muted-foreground mt-2">{dictionary.tryAdjusting}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
    
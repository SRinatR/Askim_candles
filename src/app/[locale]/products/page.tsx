
"use client";
import { ProductList } from '@/components/products/ProductList';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductSort } from '@/components/products/ProductSort';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { useSearchParams, useParams } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Slash, SlidersHorizontal } from 'lucide-react';
import type { Locale } from '@/lib/i1n-config';
import type { ProductCardDictionary } from '@/components/products/ProductCard';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import React, { useState, useMemo } from 'react';

// Importing main dictionaries
import enMessages from '@/dictionaries/en.json';
import ruMessages from '@/dictionaries/ru.json';
import uzMessages from '@/dictionaries/uz.json';

type FullDictionary = typeof enMessages; // Assuming en.json has all keys
// Consistent price divisor for filter logic
const PRICE_DIVISOR = 1; // Assuming prices in mockProducts are direct UZS values

const dictionaries: Record<Locale, FullDictionary> = {
  en: enMessages,
  ru: ruMessages,
  uz: uzMessages,
};

const getCombinedDictionary = (locale: Locale) => {
  const dict = dictionaries[locale] || dictionaries.en;
  return {
    productsPage: dict.productsPage || {
      homeBreadcrumb: "Home",
      productsBreadcrumb: "Products",
      allProductsTitle: "All Products",
      searchResultsTitle: "Search results for \"{searchTerm}\"",
      productsFound: "{count} product found",
      productsFound_plural: "{count} products found",
      productsFound_few: "{count} products found",
      noProductsFound: "No Products Found",
      searchNoMatch: "Your search for \"{searchTerm}\" did not match any products.",
      filterNoMatch: "We couldn't find products matching your current filters.",
      tryAdjusting: "Try adjusting your search or filters."
    },
    productFilters: dict.productFilters || {
      filtersTitle: "Filters",
      clearAllButton: "Clear All",
      categoryTitle: "Category",
      priceRangeTitle: "Price Range",
      scentTitle: "Scent",
      materialTitle: "Material",
      applyFiltersButton: "Show Results"
    },
    productSort: dict.productSort || {
      sortByLabel: "Sort by:",
      sortPlaceholder: "Sort by",
      relevanceOption: "Relevance",
      priceAscOption: "Price: Low to High",
      priceDescOption: "Price: High to Low",
      nameAscOption: "Name: A to Z",
      nameDescOption: "Name: Z to A",
      newestOption: "Newest Arrivals"
    },
    productCard: dict.productCard || { 
      addToCart: "Add to Cart (ProductsPage Fallback)",
      addedToCartTitle: "Added to cart (ProductsPage Fallback)",
      addedToCartDesc: "{productName} has been added (ProductsPage Fallback).",
      outOfStock: "Out of Stock (ProductsPage Fallback)"
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

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { minProductPrice, maxProductPrice } = useMemo(() => {
    if (!mockProducts || mockProducts.length === 0) {
      return { minProductPrice: 0, maxProductPrice: 500000 }; // Default if no products
    }
    const prices = mockProducts.map(p => p.price / PRICE_DIVISOR);
    return {
      minProductPrice: Math.floor(Math.min(...prices)),
      maxProductPrice: Math.ceil(Math.max(...prices)),
    };
  }, []);


  const searchTerm = searchParams.get('search')?.toLowerCase();
  const categories = searchParams.getAll('category');
  const scents = searchParams.getAll('scent');
  const materials = searchParams.getAll('material');

  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');

  const minPrice = minPriceParam !== null ? Number(minPriceParam) : minProductPrice;
  const maxPrice = maxPriceParam !== null ? Number(maxPriceParam) : maxProductPrice;
  
  const sortOption = searchParams.get('sort') || 'relevance';

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = searchTerm ? product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm) : true;
    const productCategorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
    const matchesCategory = categories.length > 0 ? categories.includes(productCategorySlug) : true;
    const matchesScent = scents.length > 0 && product.scent ? scents.includes(product.scent) : scents.length === 0;
    const matchesMaterial = materials.length > 0 && product.material ? materials.includes(product.material) : materials.length === 0;
    const productPrice = product.price / PRICE_DIVISOR;
    const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;


    return matchesSearch && matchesCategory && matchesScent && matchesMaterial && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return (a.price / PRICE_DIVISOR) - (b.price / PRICE_DIVISOR);
      case 'price-desc':
        return (b.price / PRICE_DIVISOR) - (a.price / PRICE_DIVISOR);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'newest':
         // Assuming newer products have higher IDs (or timestamp in real data)
         const idA = parseInt(a.id.replace (/[^0-9]/g, ""), 10); // Extract numbers from ID
         const idB = parseInt(b.id.replace (/[^0-9]/g, ""), 10);
         if (!isNaN(idA) && !isNaN(idB)) {
           return idB - idA; 
         }
         return b.id.localeCompare(a.id); // Fallback to string comparison
      default: // relevance or unknown
        return 0;
    }
  });

  const pageTitle = searchTerm ? dictionary.searchResultsTitle.replace('{searchTerm}', searchTerm) : dictionary.allProductsTitle;
  const productsCount = sortedProducts.length;

  let productsCountText = "";
  if (productsCount === 1 && dictionary.productsFound) {
    productsCountText = dictionary.productsFound.replace('{count}', String(productsCount));
  } else if (locale === 'ru' && (productsCount % 10 >= 2 && productsCount % 10 <= 4) && !(productsCount % 100 >= 12 && productsCount % 100 <= 14) && dictionary.productsFound_few) {
    productsCountText = (dictionary.productsFound_few).replace('{count}', String(productsCount));
  } else if (dictionary.productsFound_plural) {
     productsCountText = (dictionary.productsFound_plural).replace('{count}', String(productsCount));
  } else if (dictionary.productsFound) { 
    productsCountText = dictionary.productsFound.replace('{count}', String(productsCount));
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
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {filtersDictionary.filtersTitle}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-full max-w-xs sm:max-w-sm">
                <SheetHeader className="p-4 border-b flex flex-row justify-between items-center">
                  <SheetTitle>{filtersDictionary.filtersTitle}</SheetTitle>
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon"><X className="h-5 w-5"/></Button>
                  </SheetClose>
                </SheetHeader>
                <div className="overflow-y-auto p-1">
                  <ProductFilters 
                    dictionary={filtersDictionary} 
                    categoriesData={mockCategories}
                    allProducts={mockProducts}
                    onApplyFilters={() => setIsMobileFiltersOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <ProductSort dictionary={sortDictionary} />
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <div className="hidden lg:block lg:w-72 lg:sticky lg:top-24 self-start">
          <ProductFilters 
            dictionary={filtersDictionary} 
            categoriesData={mockCategories}
            allProducts={mockProducts}
          />
        </div>
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

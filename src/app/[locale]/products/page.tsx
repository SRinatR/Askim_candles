
"use client";
import { ProductList } from '@/components/products/ProductList';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductSort } from '@/components/products/ProductSort';
import { mockProducts, mockCategories } from '@/lib/mock-data'; // mockCategories might be useful for filter labels
import type { Product } from '@/lib/types';
import { useSearchParams, useParams } from 'next/navigation'; // Added useParams
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';
import type { Locale } from '@/lib/i1n-config';

// Placeholder dictionary - in a real app, this would come from getDictionary or a client i18n solution
const getProductsPageDictionary = (locale: Locale) => {
  if (locale === 'uz') {
    return {
      home: "Bosh sahifa",
      productsBreadcrumb: "Mahsulotlar",
      allProductsTitle: "Barcha Mahsulotlar",
      searchResultsTitle: (term: string) => `"${term}" uchun qidiruv natijalari`,
      productsFound: (count: number) => `${count} ta mahsulot topildi`,
      product: "mahsulot",
      products: "mahsulotlar",
      noProductsFound: "Mahsulotlar Topilmadi",
      searchNoMatch: (term: string) => `Sizning "${term}" qidiruvingiz hech qanday mahsulotga mos kelmadi.`,
      filterNoMatch: "Joriy filtrlaringizga mos keladigan mahsulotlarni topa olmadik.",
      tryAdjusting: "Qidiruv yoki filtrlaringizni o'zgartirib ko'ring.",
    };
  }
  if (locale === 'ru') {
    return {
      home: "Главная",
      productsBreadcrumb: "Товары",
      allProductsTitle: "Все товары",
      searchResultsTitle: (term: string) => `Результаты поиска для "${term}"`,
      productsFound: (count: number) => `Найдено ${count} товар(ов)`,
      product: "товар",
      products: "товаров",
      noProductsFound: "Товары не найдены",
      searchNoMatch: (term: string) => `По вашему запросу "${term}" ничего не найдено.`,
      filterNoMatch: "Мы не смогли найти товары, соответствующие вашим текущим фильтрам.",
      tryAdjusting: "Попробуйте изменить параметры поиска или фильтры.",
    };
  }
  return { // en
    home: "Home",
    productsBreadcrumb: "Products",
    allProductsTitle: "All Products",
    searchResultsTitle: (term: string) => `Search results for "${term}"`,
    productsFound: (count: number) => `${count} product${count !== 1 ? 's' : ''} found`,
    product: "product",
    products: "products",
    noProductsFound: "No Products Found",
    searchNoMatch: (term: string) => `Your search for "${term}" did not match any products.`,
    filterNoMatch: "We couldn't find products matching your current filters.",
    tryAdjusting: "Try adjusting your search or filters.",
  };
};


export default function ProductsPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as Locale || 'uz';
  const dictionary = getProductsPageDictionary(locale);

  const searchTerm = searchParams.get('search')?.toLowerCase();
  const categories = searchParams.getAll('category');
  const scents = searchParams.getAll('scent');
  const materials = searchParams.getAll('material');
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || Infinity;
  const sortOption = searchParams.get('sort') || 'relevance';

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = searchTerm ? product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm) : true;
    // Assuming category in product is "Artisanal Candles" and slug is "artisanal-candles"
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
         return parseInt(b.id) - parseInt(a.id); // Assuming higher ID is newer for mock data
      default: // relevance or default
        return 0; 
    }
  });
  
  const pageTitle = searchTerm ? dictionary.searchResultsTitle(searchTerm) : dictionary.allProductsTitle;
  const productsCount = sortedProducts.length;
  const productsCountText = dictionary.productsFound(productsCount).replace(String(productsCount), `<strong>${productsCount}</strong>`);


  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/`}>{dictionary.home}</BreadcrumbLink>
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
          <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: productsCountText }} />
        </div>
        <ProductSort /> {/* TODO: Localize Sort options */}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <ProductFilters /> {/* TODO: Localize Filter titles/options */}
        <div className="flex-1">
          {sortedProducts.length > 0 ? (
            <ProductList products={sortedProducts} locale={locale} />
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold mb-2">{dictionary.noProductsFound}</h2>
              <p className="text-muted-foreground">
                {searchTerm ? dictionary.searchNoMatch(searchTerm) : dictionary.filterNoMatch}
              </p>
              <p className="text-muted-foreground mt-2">{dictionary.tryAdjusting}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

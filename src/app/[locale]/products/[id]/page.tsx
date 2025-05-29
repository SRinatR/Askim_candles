
"use client";

import { mockProducts } from '@/lib/mock-data';
import { notFound, useParams } from 'next/navigation';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Zap, ShieldCheck, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';
import type { Locale } from '@/lib/i1n-config';
import Image from 'next/image'; 

import enMessages from '@/dictionaries/en.json';
import ruMessages from '@/dictionaries/ru.json';
import uzMessages from '@/dictionaries/uz.json';

type Dictionary = typeof enMessages;

const dictionaries: Record<Locale, Dictionary> = {
  en: enMessages,
  ru: ruMessages,
  uz: uzMessages,
};

const getProductDetailPageDictionary = (locale: Locale) => {
  const dict = dictionaries[locale] || dictionaries.en;
  return dict.productDetailPage;
};

export default function ProductDetailPage({ params: routeParams }: { params: { id: string; locale: Locale } }) { 
  const clientParams = useParams(); 
  const locale = routeParams.locale || clientParams.locale as Locale || 'uz';
  const dictionary = getProductDetailPageDictionary(locale);

  const product = mockProducts.find(p => p.id === routeParams.id);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: dictionary.addedToCartTitle,
      description: dictionary.addedToCartDesc.replace('{name}', product.name),
    });
  };

  const relatedProducts = mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0,3);
  const productCategorySlug = product.category.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/`}>{dictionary.home}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/products`}>{dictionary.products}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <ProductImageGallery images={product.images} altText={product.name} />
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary">${product.price.toFixed(2)}</p>
            {product.stock > 0 && product.stock <= 5 && (
              <Badge variant="destructive" className="text-xs">{dictionary.onlyLeftInStock.replace('{stock}', String(product.stock))}</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="outline" className="text-xs">{dictionary.outOfStock}</Badge>
            )}
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">{product.description}</p>

          <Separator />

          <div className="space-y-3">
            {product.category && <p><strong className="font-medium">{dictionary.categoryLabel}:</strong> <Link href={`/${locale}/products?category=${productCategorySlug}`} className="text-primary hover:underline">{product.category}</Link></p>}
            {product.scent && <p><strong className="font-medium">{dictionary.scentLabel}:</strong> {product.scent}</p>}
            {product.material && <p><strong className="font-medium">{dictionary.materialLabel}:</strong> {product.material}</p>}
            {product.dimensions && <p><strong className="font-medium">{dictionary.dimensionsLabel}:</strong> {product.dimensions}</p>}
            {product.attributes && product.attributes.map(attr => (
              <p key={attr.key}><strong className="font-medium">{attr.key}:</strong> {attr.value}</p>
            ))}
          </div>
          
          <Button 
            size="lg" 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" /> {product.stock > 0 ? dictionary.addToCartButton : dictionary.outOfStockButton}
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Zap className="h-5 w-5 text-primary" />
              <span>{dictionary.fastDispatch}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>{dictionary.secureCheckout}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Package className="h-5 w-5 text-primary" />
              <span>{dictionary.easyReturns}</span>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">{dictionary.relatedProductsTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(related => (
              <Link key={related.id} href={`/${locale}/products/${related.id}`} className="group block border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <Image src={related.images[0]} alt={related.name} fill objectFit="cover" className="group-hover:scale-105 transition-transform" data-ai-hint={`${related.category.toLowerCase().replace(' ', '-')} product`} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg group-hover:text-primary">{related.name}</h3>
                  <p className="text-muted-foreground text-sm">${related.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

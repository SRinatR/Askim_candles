
"use client";

import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";
import type { Locale } from '@/lib/i1n-config';

export interface ProductCardDictionary {
  addToCart: string;
  addedToCartTitle: string;
  addedToCartDesc: string; // Expects a string with {productName} placeholder
  outOfStock?: string;
}

const defaultProductCardDictionary: ProductCardDictionary = {
  addToCart: "Add to Cart (Default Fallback)",
  addedToCartTitle: "Added to cart (Default Fallback)",
  addedToCartDesc: "{productName} has been added (Default Fallback).",
  outOfStock: "Out of Stock (Default Fallback)"
};

interface ProductCardProps {
  product: Product;
  locale: Locale;
  dictionary?: ProductCardDictionary;
}

export function ProductCard({ product, locale, dictionary }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const currentDictionary = dictionary || defaultProductCardDictionary;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: currentDictionary.addedToCartTitle,
      description: currentDictionary.addedToCartDesc.replace('{productName}', product.name),
    });
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col rounded-lg border border-border/60">
      <Link href={`/${locale}/products/${product.id}`} className="block group h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="aspect-square overflow-hidden relative">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={`${product.category.toLowerCase().replace(' ', '-')} product`}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold leading-tight mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
          <p className="text-lg font-bold text-foreground">{product.price.toLocaleString('en-US')} UZS</p>
        </CardContent>
        <CardFooter className="p-4 border-t border-border/60 mt-auto">
          <Button
            variant="outline"
            className="w-full hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={handleAddToCart}
            aria-label={`${currentDictionary.addToCart} ${product.name}`}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock === 0 ? (currentDictionary.outOfStock || "Out of Stock") : currentDictionary.addToCart}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
    

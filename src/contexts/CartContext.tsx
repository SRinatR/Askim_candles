"use client";

import type { CartItem, Product } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import type { Locale } from '@/lib/i1n-config';

// Simulating dictionary loading for client component
import enMessages from '@/dictionaries/en.json';
import ruMessages from '@/dictionaries/ru.json';
import uzMessages from '@/dictionaries/uz.json';

type FullDictionary = typeof enMessages;
type CartContextToastsDictionary = FullDictionary['cartContextToasts']; // Assuming toasts are in a top-level key or nested

const dictionaries: Record<Locale, FullDictionary> = {
  en: enMessages,
  ru: ruMessages,
  uz: uzMessages,
};

const getCartContextToastsDictionary = (locale: Locale): CartContextToastsDictionary => {
  return dictionaries[locale]?.cartContextToasts || dictionaries.en.cartContextToasts;
};


interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'askimCart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const params = useParams();
  const locale = (params.locale as Locale) || 'uz';
  const dictionary = getCartContextToastsDictionary(locale);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          if (Array.isArray(parsedCart)) {
            return parsedCart;
          }
        } catch (error) {
          console.error("Failed to parse cart from localStorage on init:", error);
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    if (!product || product.stock === undefined) {
      console.error("Product data is invalid or stock is undefined", product);
      toast({
        title: dictionary.errorTitle || "Error",
        description: dictionary.genericError || "An unexpected error occurred.",
        variant: "destructive",
      });
      return;
    }
    
    if (product.stock === 0) {
      toast({
        title: dictionary.errorTitle || "Error",
        description: (dictionary.productOutOfStockToast || "{productName} is out of stock.").replace('{productName}', product.name[locale] || product.name.en),
        variant: "destructive",
      });
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      let finalQuantity;

      if (existingItem) {
        const potentialQuantity = existingItem.quantity + quantityToAdd;
        if (potentialQuantity > product.stock) {
          finalQuantity = product.stock;
          toast({
            title: dictionary.infoTitle || "Info",
            description: (dictionary.stockAvailableToast || "Not enough stock. Quantity updated to {availableStock}.")
                            .replace('{availableStock}', String(product.stock)),
          });
        } else {
          finalQuantity = potentialQuantity;
        }
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.max(0, finalQuantity) } // Ensure quantity is not negative
            : item
        );
      } else {
        if (quantityToAdd > product.stock) {
          finalQuantity = product.stock;
          toast({
            title: dictionary.infoTitle || "Info",
            description: (dictionary.addedToCartLimitedStockToast || "Not enough stock. Added {availableStock} to cart.")
                            .replace('{availableStock}', String(product.stock)),
          });
        } else {
          finalQuantity = quantityToAdd;
        }
        return [...prevItems, { ...product, quantity: Math.max(1, finalQuantity) }]; // Ensure at least 1 item added
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const itemInCart = cartItems.find(item => item.id === productId);
    if (!itemInCart) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > itemInCart.stock) {
      newQuantity = itemInCart.stock;
      toast({
        title: dictionary.infoTitle || "Info",
        description: (dictionary.stockAvailableToast || "Not enough stock. Quantity updated to {availableStock}.")
                        .replace('{availableStock}', String(itemInCart.stock)),
      });
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
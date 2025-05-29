
"use client";

import type { CartItem, Product } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial client-side mount
  useEffect(() => {
    const storedCart = localStorage.getItem('scentSationalCart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Basic validation to ensure it's an array (or whatever structure you expect)
        if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
        } else {
            // Handle cases where localStorage might have invalid data
            localStorage.removeItem('scentSationalCart');
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem('scentSationalCart'); // Clear corrupted data
      }
    }
  }, []); // Empty dependency array: runs only once on the client after mount

  // Save cart to localStorage whenever it changes, only on client
  useEffect(() => {
    // This useEffect runs on the client, after the initial render and after cartItems changes.
    // So, direct localStorage access here is safe.
    localStorage.setItem('scentSationalCart', JSON.stringify(cartItems));
  }, [cartItems]); // Run whenever cartItems changes

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.max(0, item.quantity + quantity) } // Ensure quantity doesn't go below 0
            : item
        );
      }
      // Ensure product being added has a valid stock if you track it
      return [...prevItems, { ...product, quantity: Math.max(1, quantity) }]; // Ensure quantity is at least 1 for new items
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Always render the provider and its children.
  // The context value will be initially an empty array / 0 for cart,
  // then update on the client after localStorage is read.
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

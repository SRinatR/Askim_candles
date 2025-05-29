
import type { Locale } from './i1n-config';

export interface Product {
  id: string;
  sku?: string;
  name: { [key in Locale]?: string } & { en: string }; // Ensure 'en' is always there as a fallback
  description: { [key in Locale]?: string } & { en: string }; // Ensure 'en' is always there
  price: number; 
  category: string; // Stores the category name/slug
  images: string[];
  mainImage?: string;
  scent?: string;
  material?: string;
  dimensions?: string;
  burningTime?: string;
  stock: number;
  attributes?: { key: string; value: string }[];
  isActive: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string; // Typically the slug
  name: string; // Base name, often English or a key for translation
  slug: string;
  description?: string;
}

export interface SimulatedUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  isRegistered?: boolean;
  isConfirmed?: boolean;
  phone?: string; 
}

export type AdminRole = 'ADMIN' | 'MANAGER';
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  password?: string;
}


export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string; 
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number; 
  items: CartItem[];
}

export interface MockAdminClient {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number; 
  isBlocked: boolean;
}

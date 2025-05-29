
import type { Locale } from './i1n-config';

export interface Product {
  id: string;
  sku?: string;
  name: { [key in Locale | 'en']: string };
  description: { [key in Locale | 'en']: string };
  price: number;
  category: string;
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
  id: string;
  name: string;
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

export interface Article {
  id: string; // slug can serve as id for simplicity with localStorage
  slug: string;
  title: { [key in Locale | 'en']: string };
  content: { [key in Locale | 'en']: string };
  sharedMainImage?: string; // Data URL or external URL
  mainImage_en?: string;    // Data URL or external URL
  mainImage_ru?: string;    // Data URL or external URL
  mainImage_uz?: string;    // Data URL or external URL
  useSharedImage: boolean;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

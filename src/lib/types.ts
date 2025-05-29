
export interface Product {
  id: string;
  sku?: string; // Stock Keeping Unit
  name: string;
  description: string;
  price: number; // Represents the price in the smallest currency unit (e.g., tiyin for UZS)
  category: string;
  images: string[]; // Array of image URLs
  mainImage?: string; // URL of the main image
  scent?: string;
  material?: string;
  dimensions?: string; // e.g., "10cm x 5cm x 5cm"
  burningTime?: string; // e.g., "Approx. 40 hours"
  stock: number; // Available stock
  attributes?: { key: string; value: string }[]; // For other attributes like color, size
  isActive: boolean; // New field to control visibility on the main site
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

// User type for client-side email/password auth simulation (FRONTEND USERS)
export interface SimulatedUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string; // For registration step
  lastName?: string; // For registration step
  password?: string; // Only for form handling/mock storage, not secure
  isRegistered?: boolean;
  isConfirmed?: boolean;
  phone?: string; 
}

// User type for client-side ADMIN PANEL auth simulation
export type AdminRole = 'ADMIN' | 'MANAGER';
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  password?: string; // For form handling/mock storage in simulation
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
  date: string; // Or Date object
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number; // Represents the total amount in the smallest currency unit
  items: CartItem[]; // Simplified, ideally OrderItem with price snapshot
}

export interface MockAdminClient {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number; // in UZS
  isBlocked: boolean;
}

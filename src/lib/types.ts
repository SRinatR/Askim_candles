export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[]; // Array of image URLs
  scent?: string;
  material?: string;
  dimensions?: string; // e.g., "10cm x 5cm x 5cm"
  stock: number; // Available stock
  attributes?: { key: string; value: string }[]; // For other attributes like color, size
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

export interface User {
  id: string;
  email: string;
  name?: string;
  addresses?: Address[];
  // other user fields
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
  totalAmount: number;
  items: CartItem[]; // Simplified, ideally OrderItem with price snapshot
}

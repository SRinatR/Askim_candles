
import type { Product, Category, Order, AdminUser, MockAdminClient } from '@/lib/types';

export const mockCategories: Category[] = [
  { id: 'candles', name: 'Artisanal Candles', slug: 'artisanal-candles', description: 'Hand-poured artisanal candles with unique scents.' },
  { id: 'wax-figures', name: 'Wax Figures', slug: 'wax-figures', description: 'Intricately crafted wax figures for decoration.' },
  { id: 'gypsum-products', name: 'Gypsum Products', slug: 'gypsum-products', description: 'Elegant gypsum decor items.' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Lavender Bliss Candle',
    description: 'Soothing lavender scented candle, perfect for relaxation. Made with natural soy wax.',
    price: 229900, 
    category: 'Artisanal Candles',
    images: ['https://placehold.co/600x400.png?text=Lavender+Candle+1', 'https://placehold.co/600x400.png?text=Lavender+Candle+2', 'https://placehold.co/600x400.png?text=Lavender+Candle+3'],
    mainImage: 'https://placehold.co/600x400.png?text=Lavender+Candle+1',
    scent: 'Lavender',
    material: 'Soy Wax',
    dimensions: '8cm x 10cm',
    burningTime: 'Approx. 45 hours',
    stock: 15,
    attributes: [{key: 'Color', value: 'Purple'}],
  },
  {
    id: '2',
    name: 'Vanilla Dream Candle',
    description: 'A warm and inviting vanilla bean fragrance that fills your home with comfort.',
    price: 245000, 
    category: 'Artisanal Candles',
    images: ['https://placehold.co/600x400.png?text=Vanilla+Candle+1', 'https://placehold.co/600x400.png?text=Vanilla+Candle+2'],
    mainImage: 'https://placehold.co/600x400.png?text=Vanilla+Candle+1',
    scent: 'Vanilla Bean',
    material: 'Beeswax Blend',
    dimensions: '9cm x 12cm',
    burningTime: 'Approx. 60 hours',
    stock: 20,
    attributes: [{key: 'Color', value: 'Cream'}],
  },
  {
    id: '3',
    name: 'Elegant Swan Wax Figure',
    description: 'A beautifully detailed wax figure of a swan, perfect as a centerpiece.',
    price: 350000, 
    category: 'Wax Figures',
    images: ['https://placehold.co/600x400.png?text=Swan+Wax+Figure'],
    mainImage: 'https://placehold.co/600x400.png?text=Swan+Wax+Figure',
    material: 'Paraffin Wax',
    dimensions: '15cm x 12cm x 10cm',
    stock: 8,
     attributes: [{key: 'Color', value: 'White'}],
  },
  {
    id: '4',
    name: 'Geometric Gypsum Planter',
    description: 'Modern gypsum planter with a minimalist geometric design. Ideal for succulents.',
    price: 187500, 
    category: 'Gypsum Products',
    images: ['https://placehold.co/600x400.png?text=Gypsum+Planter'],
    mainImage: 'https://placehold.co/600x400.png?text=Gypsum+Planter',
    material: 'Natural Gypsum',
    dimensions: '10cm x 10cm x 8cm',
    stock: 25,
    attributes: [{key: 'Finish', value: 'Matte White'}],
  },
  {
    id: '5',
    name: 'Rose Garden Candle',
    description: 'Experience the fragrance of a blooming rose garden with this exquisite candle.',
    price: 260000, 
    category: 'Artisanal Candles',
    images: ['https://placehold.co/600x400.png?text=Rose+Candle'],
    mainImage: 'https://placehold.co/600x400.png?text=Rose+Candle',
    scent: 'Fresh Roses',
    material: 'Soy Wax',
    dimensions: '8.5cm x 11cm',
    burningTime: 'Approx. 50 hours',
    stock: 12,
    attributes: [{key: 'Color', value: 'Pink'}],
  },
  {
    id: '6',
    name: 'Abstract Gypsum Coasters (Set of 4)',
    description: 'Protect your surfaces with style using these unique abstract design gypsum coasters.',
    price: 299900, 
    category: 'Gypsum Products',
    images: ['https://placehold.co/600x400.png?text=Gypsum+Coasters'],
    mainImage: 'https://placehold.co/600x400.png?text=Gypsum+Coasters',
    material: 'Reinforced Gypsum',
    dimensions: '10cm diameter, 1cm thick (each)',
    stock: 0, // Example of out of stock item
    attributes: [{key: 'Pattern', value: 'Abstract Swirl'}],
  },
];

export const mockOrders: Order[] = [
  {
    id: 'order123',
    orderNumber: 'ASKM-001', // Updated prefix
    date: '2023-10-26',
    status: 'Delivered',
    totalAmount: mockProducts[0].price + mockProducts[3].price, 
    items: [
      { ...mockProducts[0], quantity: 1, price: mockProducts[0].price },
      { ...mockProducts[3], quantity: 1, price: mockProducts[3].price },
    ],
  },
  {
    id: 'order124',
    orderNumber: 'ASKM-002', // Updated prefix
    date: '2023-11-05',
    status: 'Shipped',
    totalAmount: mockProducts[1].price,
    items: [{ ...mockProducts[1], quantity: 1, price: mockProducts[1].price }],
  },
  {
    id: 'order125',
    orderNumber: 'ASKM-003', // Updated prefix
    date: '2023-11-10',
    status: 'Processing',
    totalAmount: mockProducts[2].price + mockProducts[4].price, 
    items: [
      { ...mockProducts[2], quantity: 1, price: mockProducts[2].price },
      { ...mockProducts[4], quantity: 1, price: mockProducts[4].price },
    ],
  },
];

export const mockAdminClients: MockAdminClient[] = [
  { id: 'client-001', name: 'Alisher Usmanov', email: 'alisher.u@example.com', registrationDate: '2023-01-15T10:00:00Z', totalOrders: 5, totalSpent: 125000000, isBlocked: false }, // Prices adjusted for UZS
  { id: 'client-002', name: 'Gulnara Karimova', email: 'gulnara.k@example.com', registrationDate: '2023-03-22T14:30:00Z', totalOrders: 2, totalSpent: 45000000, isBlocked: false },
  { id: 'client-003', name: 'Timur Begaliev', email: 'timur.b@example.com', registrationDate: '2023-05-10T09:15:00Z', totalOrders: 8, totalSpent: 210000000, isBlocked: true },
  { id: 'client-004', name: 'Dildora Ahmedova', email: 'dildora.a@example.com', registrationDate: '2023-07-01T11:00:00Z', totalOrders: 1, totalSpent: 22990000, isBlocked: false },
  { id: 'client-005', name: 'Rustam Qosimov', email: 'rustam.q@example.com', registrationDate: '2023-08-19T18:45:00Z', totalOrders: 12, totalSpent: 350000000, isBlocked: false },
];

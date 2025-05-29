
# Product Context: Askim candles

## 1. Why This Project Exists

Askim candles aims to provide an online platform for customers to discover and purchase unique, handcrafted scented products and home decor items. It caters to individuals seeking artisanal quality and a personalized shopping experience for items that enhance their living spaces and well-being. A key part of the project is also an administrative panel for store owners/managers to manage the shop's operations.

## 2. Problems It Solves

*   Provides a dedicated marketplace for a niche set of products (candles, wax figures, gypsum items).
*   Offers a curated selection, potentially differentiating from larger, less specialized e-commerce sites.
*   Allows artisans or a small business to reach a wider customer base.
*   Simplifies the purchasing process for these specialized items.
*   Provides tools for store administrators/managers to manage products, orders, users, and other store aspects efficiently.

## 3. How It Should Work

### A. Customer-Facing Application (Localized: UZ default, RU, EN):

1.  **Discovery:** Users land on the homepage, see featured products and categories.
2.  **Browsing:** Users navigate to the product listing page, use filters (category, price, scent, material) and sorting options.
3.  **Product Details:** Users view individual product pages with multiple images, detailed descriptions, specifications, and pricing.
4.  **Cart Management:** Users add products to their shopping cart, adjust quantities, and remove items.
5.  **Checkout:** Users proceed through a streamlined checkout process, providing shipping and (mock) payment information.
6.  **Account Management:** Registered users can log in to view their profile, manage (mock) shipping addresses, and see their (mock) order history.
7.  **Authentication:** Users can register for an account via a multi-step process (email/password, simulated confirmation) or sign in using Google (NextAuth). Placeholders for Telegram/Yandex exist.
8.  **Language Selection:** Users can switch site language.

### B. Admin Panel (`/admin` path - Localized: EN default, RU - Dark Theme available):

1.  **Login:** Separate login for admin/manager roles (email/password, currently simulated).
2.  **Dashboard:** View key statistics and summaries (sales, orders, product stock - UI stubs exist).
3.  **Product Management:** Add, view, edit, delete products. Filter and search products. (UI stubs exist).
4.  **Order Management (Sales):** View orders, filter by status, view details, update status (confirm, cancel). (UI stubs exist).
5.  **User Management (Management - Admin Only):** View registered users, manage roles (assign manager), block/unblock accounts. (UI stubs exist).
6.  **Discount Management:** Create and manage promo codes and sales. (UI stubs exist).
7.  **Content Management:** Edit homepage content, banners, informational pages. (UI stubs exist).
8.  **Store Settings (Admin Only):** Configure taxes, currency, shipping, payment methods, email notifications. (UI stubs exist).
9.  **Additional Sections:** Clients, Marketing, Reports, Finances (UI stubs exist).
10. **Language and Theme Selection:** Admins can switch language (EN/RU) and theme (Light/Dark).

## 4. User Experience Goals

*   **Main Site:**
    *   Elegant & Calming: The UI should reflect the "Askim candles" brand with its specified color palette and minimalist design.
    *   Intuitive Navigation: Users should easily find products and navigate through the site.
    *   Visually Appealing: High-quality product imagery is key.
    *   Trustworthy & Secure: Especially for checkout and account management.
    *   Responsive: The app should work seamlessly across various devices.
*   **Admin Panel:**
    *   Modern & Professional: Inspired by interfaces like Turo, MoscowDreamCars.
    *   Efficient & Task-Oriented: Easy to manage store operations.
    *   Clear & Readable: Minimal visual noise, good information hierarchy.
    *   Responsive.
    *   Informative: Provide feedback on actions (loading, success, error).
    *   Customizable: Dark/Light theme and EN/RU language options.

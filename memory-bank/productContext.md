
# Product Context: Askim candles

## 1. Why This Project Exists

Askim candles aims to provide an online platform for customers to discover and purchase unique, handcrafted scented products and home decor items. It caters to individuals seeking artisanal quality and a personalized shopping experience for items that enhance their living spaces and well-being. A key part of the project is also an administrative panel for store owners/managers to manage the shop's operations.

## 2. Problems It Solves

*   Provides a dedicated marketplace for a niche set of products (candles, wax figures, gypsum items).
*   Offers a curated selection, potentially differentiating from larger, less specialized e-commerce sites.
*   Allows artisans or a small business to reach a wider customer base.
*   Simplifies the purchasing process for these specialized items.
*   Provides tools for store administrators/managers to manage products, orders, users, content, discounts, and other store aspects efficiently.

## 3. How It Should Work

### A. Customer-Facing Application (Localized: UZ default, RU, EN):

1.  **Discovery & Browsing:** Users land on the homepage, see featured products, categories. Navigate to product listings, use filters (category, price, scent, material) and sorting.
2.  **Product Details & Cart:** View individual product pages with images, descriptions, add to cart.
3.  **Checkout & Account:** Streamlined checkout, (mock) payment. Registered users manage profile, (mock) addresses, (mock) order history.
4.  **Authentication:** Hybrid - NextAuth (Google), client-simulated (email/password with multi-step registration & confirmation).
5.  **Language Selection:** Users can switch site language.

### B. Admin Panel (`/admin` path - Localized: EN default, RU - Dark/Light Theme available):

1.  **Login:** Separate login for admin/manager roles (simulated email/password via `AdminAuthContext`).
2.  **Dashboard:** View key statistics (UI stubs with mock values exist).
3.  **Product Management:** Add, view, edit, delete products. Filter and search. (UI for list, add, edit forms implemented, client-side simulated actions).
4.  **Order Management (Sales):** View orders, filter, update status. (UI stubs exist).
5.  **User Management (Management - Admin Only):**
    *   View registered site users (requires backend).
    *   Manage admin panel roles: **UI for listing managers (predefined & dynamically "added" via localStorage) and form for "adding" new managers by Admin (client-side simulated).**
    *   Block/unblock accounts (requires backend).
6.  **Discount Management:** Create/manage promo codes. (UI stubs exist).
7.  **Content Management:** Edit homepage content, banners, info pages. (UI stubs exist).
8.  **Store Settings (Admin Only):** Configure store parameters. (UI stubs exist).
9.  **Logs:** View system/admin/session logs (placeholder page exists, requires backend).
10. **Additional Sections:** Clients, Marketing, Reports, Finances (UI stubs exist).
11. **Language and Theme Selection:** Admins can switch language (EN/RU) and theme (Light/Dark).

## 4. User Experience Goals

*   **Main Site:** Elegant, calming, intuitive, visually appealing, trustworthy, responsive.
*   **Admin Panel:** Modern, professional (Turo/MoscowDreamCars style), efficient, task-oriented, clear, readable, responsive, informative, customizable (theme/language).

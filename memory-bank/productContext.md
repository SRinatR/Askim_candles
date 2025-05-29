
# Product Context: Askim candles

## 1. Why This Project Exists

Askim candles aims to provide an online platform for customers to discover and purchase unique, handcrafted scented products and home decor items. It caters to individuals seeking artisanal quality and a personalized shopping experience for items that enhance their living spaces and well-being. A key part of the project is also an administrative panel for store owners/managers to manage the shop's operations.

## 2. Problems It Solves

*   Provides a dedicated marketplace for a niche set of products (candles, wax figures, gypsum items).
*   Offers a curated selection, potentially differentiating from larger, less specialized e-commerce sites.
*   Allows artisans or a small business to reach a wider customer base.
*   Simplifies the purchasing process for these specialized items.
*   Provides tools for store administrators/managers to manage products (including detailed attributes and images), orders, users, content, discounts, and other store aspects efficiently.

## 3. How It Should Work

### A. Customer-Facing Application (Localized: UZ default, RU, EN):

1.  **Discovery & Browsing:** Users land on the homepage, see featured products, categories. Navigate to product listings, use filters (category, dynamic price range, dynamic scent, dynamic material) and sorting.
2.  **Product Details & Cart:** View individual product pages with images, detailed attributes (scent, material, dimensions, burning time), add to cart. Prices in UZS.
3.  **Checkout & Account:** Streamlined checkout, (mock) payment. Registered users manage profile, (mock) addresses, (mock) order history. Forced login before checkout.
4.  **Authentication:** Hybrid - NextAuth (Google), client-simulated (email/password with multi-step registration & confirmation).
5.  **Language Selection:** Users can switch site language using a functional switcher.

### B. Admin Panel (`/admin` path - Localized: EN default, RU - Dark/Light Theme available):

1.  **Login:** Separate login for admin/manager roles (simulated email/password via `AdminAuthContext`).
2.  **Dashboard:** View key statistics (UI stubs with mock values, "Recent Activity" from simulated logs).
3.  **Product Management:** Add, view, edit, delete products. Filter and search.
    *   Forms include fields for name, description, price, category, stock, scent, material, dimensions, burningTime.
    *   Image management with drag-and-drop upload, previews, and main image selection (Data URL based).
    *   Product list displays main image.
4.  **Order Management (Sales):** View orders, filter, update status. (UI stubs exist).
5.  **User Management (Management - Admin Only):**
    *   View registered site users (requires backend).
    *   Manage admin panel roles: UI for listing managers (predefined & dynamically "added" via localStorage) and form for "adding" new managers by Admin (client-side simulated).
    *   Block/unblock accounts (requires backend).
6.  **Client Management:** View list of mock clients, client-side search, simulated block/unblock.
7.  **Discount Management:** Create/manage promo codes. (UI stubs exist).
8.  **Content Management:** Edit homepage content, banners, info pages. (UI stubs exist).
9.  **Store Settings (Admin Only):** Configure store parameters. (UI stubs exist).
10. **Logs (Admin Only):** View simulated admin action logs from `localStorage`. Allow clearing all logs.
11. **Additional Sections:** Marketing, Reports, Finances (UI stubs exist).
12. **Language and Theme Selection:** Admins can switch language (EN/RU) and theme (Light/Dark).
13. **Mobile Access Restriction:** Panel (except login) is not usable on mobile; prompts to use desktop.
14. **Version Display:** Footer shows simulated app version and last update date.

## 4. User Experience Goals

*   **Main Site:** Elegant, calming, intuitive, visually appealing, trustworthy, responsive. Prices in UZS.
*   **Admin Panel:** Modern, professional (Turo/MoscowDreamCars style), efficient, task-oriented, clear, readable, responsive, informative, customizable (theme/language).

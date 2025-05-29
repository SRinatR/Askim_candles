# Progress: ScentSational Showcase

## Date: 2024-08-01 (Simulated Date of Update)

## 1. What Works (Implemented Features)

*   **Core App Structure (Main Site):** Next.js App Router, basic layout (`Header`, `Footer`).
*   **Styling:** Tailwind CSS setup, ShadCN UI components available, custom theme in `globals.css`.
*   **Main Site Pages:**
    *   Homepage (`/`): Hero, category links, featured products, CTA.
    *   Product Listing (`/products`): Displays products, client-side filtering/sorting, search.
    *   Product Details (`/products/[id]`): Image gallery, details, add to cart, related products.
    *   Shopping Cart (`/cart`): Displays items, quantity updates, removal, total, proceed to checkout.
    *   Checkout (`/checkout`): Order summary, form for contact/shipping/mock payment.
    *   About Us (`/about`): Static content page.
*   **Frontend User Authentication (Hybrid):**
    *   **NextAuth.js with Google Provider:** Functional for Google sign-in/sign-out.
    *   **Client-Simulated Email/Password (`AuthContext`):**
        *   Multi-step registration (`/register`) with email/password, personal details, simulated confirmation.
        *   Login page (`/login`) with email/password form.
        *   Logout functionality.
    *   Placeholders for Telegram & Yandex social login buttons on login page.
*   **Frontend User Account Area (`/account/*` - Main Site):**
    *   Protected: Requires login (either NextAuth or simulated).
    *   Layout with sidebar navigation.
    *   Profile Page (`/account/profile`): Displays/updates (simulated) user info.
    *   Addresses Page (`/account/addresses`): UI for managing (mock) shipping addresses.
    *   Order History Page (`/account/orders`): Lists mock past orders, links to details.
    *   Order Detail Page (`/account/orders/[orderId]`): Displays details of a specific mock order.
    *   Account Linking Page (`/account/linking`): UI to show linked accounts (Google via NextAuth) and placeholders.
*   **Admin Panel Foundation (`/admin`):**
    *   **Simulated Authentication (`AdminAuthContext`):**
        *   Login page (`/admin/login`) for 'ADMIN' and 'MANAGER' roles (e.g., `admin@scentsational.com`/`adminpass`).
        *   Logout functionality.
    *   **Protected Routes:** All routes under `/admin` require admin/manager login.
    *   **Admin Layout:**
        *   Collapsible sidebar navigation.
        *   Header with sidebar toggle (desktop) and mobile menu trigger.
        *   Role display and role-based navigation item visibility.
    *   **Page Stubs:**
        *   Dashboard (`/admin/dashboard`): UI stubs for various statistics (sales, payments, products, etc.).
        *   Products (`/admin/products`).
        *   Orders (`/admin/sales` - renamed from "Заказы" to "Продажи" in nav, will be `/admin/orders` or `/admin/sales` as per consistency).
        *   Clients (`/admin/clients`).
        *   Marketing (`/admin/marketing`).
        *   Reports (`/admin/reports`).
        *   Finances (`/admin/finances`).
        *   Users (`/admin/users` - Admin only).
        *   Discounts (`/admin/discounts`).
        *   Content (`/admin/content`).
        *   Settings (`/admin/settings` - Admin only).
*   **UI Components:** Extensive use of ShadCN UI, custom `Logo` component.
*   **Context Providers:** `SessionProvider` (NextAuth), `SimulatedAuthProvider`, `CartProvider`, `AdminAuthProvider`, `Toaster` grouped appropriately.
*   **Error Handling:** Some client-side toast notifications. Basic accessibility considerations for dialogs/sheets.

## 2. What's Left to Build (Key Areas)

*   **Full Admin Panel Functionality:**
    *   CRUD operations for Products, with real data interaction (Prisma).
    *   Order management (viewing, status updates) with real data.
    *   User management (role assignment, blocking) with real data (Admin only).
    *   Discount/promo code creation and management.
    *   Content management system for banners, static pages.
    *   Store settings configuration (taxes, shipping, etc. - Admin only).
    *   File manager (optional).
    *   Dashboard with real data visualization.
*   **Backend Integration (Prisma/PostgreSQL):**
    *   Define Prisma schema for all necessary models (User, Product, Order, Category, etc.).
    *   Implement API routes or Server Actions for all CRUD operations.
    *   Migrate main site user authentication (email/password) to use the database instead of `localStorage`.
    *   Implement real NextAuth Credentials provider for admin login using the database.
*   **Payment Processing:** Stripe integration for actual payments.
*   **Genkit AI Features:** No specific Genkit AI features have been implemented yet.
*   **Image Handling:** Replace placeholders with actual image uploads/management (potentially via Admin file manager).
*   **Inventory Management:** Real stock updates reflected in DB.
*   **Search/Filtering/Sorting:** Server-side implementation for better performance (main site & admin).
*   **User Account Features (Backend - Main Site):**
    *   Saving profile updates, addresses to DB.
    *   Real order history from DB.
    *   Password reset functionality.
    *   Actual account linking logic if other social providers are fully implemented.
*   **Email Notifications:** Order confirmations, shipping updates, etc.
*   **Testing:** Unit, integration, and end-to-end tests.
*   **Deployment:** Configuration and instructions for production deployment on user's VPS (including DB).
*   **Further UI/UX Refinements:** Including dark/light theme for admin panel.

## 3. Current Status

*   **Main Site:** MVP with many core e-commerce UI flows implemented. Authentication is hybrid. Most data is mocked.
*   **Admin Panel:** UI shell created with simulated authentication and navigation. Pages are stubs. No backend interaction yet.
*   **Memory Bank system active.**

## 4. Known Issues/Previous Errors Addressed (Recent)

*   `useCart()` being called from server in `ProductCard.tsx` (fixed with `"use client";`).
*   Missing `Breadcrumb` component (fixed by adding the component file).
*   Direct access to `params.orderId` in `OrderDetailPage.tsx` (fixed with `React.use()`).
*   `CardFooter` not defined in `login/page.tsx` (fixed by adding import).
*   React Context unavailable in Server Components (addressed by creating `providers.tsx`).
*   `DialogContent` accessibility error (fixed by adding `SheetTitle` in mobile menus).
*   Main site header appearing on admin pages (fixed by conditional rendering in `Header.tsx`).
*   Missing imports for `X` icon and `SheetTrigger` in `admin/layout.tsx` (fixed).
*   Duplicate close icons in mobile sheet menu (fixed by modifying `SheetContent` default behavior).

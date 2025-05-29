
# Progress: Askim candles

## Date: 2024-07-29 (Simulated Date of Update)

## 1. What Works (Implemented Features)

*   **Brand Name:** "Askim candles" (updated in Logo, dictionaries).
*   **Main Site Internationalization (i18n - UZ default, RU, EN):**
    *   Path-based routing (`/[locale]/...`). Dictionary files and getters in place.
    *   All key e-commerce flow pages (`HomePage`, `About`, `Cart`, `Checkout`, `Login`, `Register`, `Account` section, `ProductDetail`, `ProductList`) moved to `/[locale]` and localized for static text.
    *   Functional language switcher in Header (desktop dropdown, compact mobile horizontal list).
    *   Middleware (`middleware.ts`) for locale handling and redirection.
*   **Styling:** Tailwind CSS, ShadCN UI. Custom theme. Main site header/footer hidden on admin pages. Global CSS applied to admin panel.
*   **Main Site User Authentication (Hybrid & Localized):**
    *   NextAuth.js with Google Provider: Functional.
    *   Client-Simulated Email/Password (`AuthContext`): Multi-step registration with simulated confirmation, login, logout. All locale-aware.
    *   **Password visibility toggles** added to login and registration forms.
    *   **Enhanced toast feedback** for login/registration errors from `AuthContext`.
*   **Checkout Flow:** Users must be logged in (either NextAuth or simulated) to proceed to checkout.
*   **Prices in UZS:** Product prices in `mock-data.ts` adjusted; display components show UZS using `toLocaleString`.
*   **Product Filters (Main Site):**
    *   Category, Scent, Material filters.
    *   Scent and Material options are **dynamically generated** from `mockProducts` (active products only).
    *   Price range filter with slider and input fields, with **dynamic min/max price calculation** based on `allProducts` (active products only).
    *   Filters available in a mobile-friendly sheet.
    *   Filter application logic refined.
*   **Product Sorting (Main Site):** UI for sorting by relevance, price, name, newest available. **Functionality verified** for mock data.
*   **Product Attributes:**
    *   `Product` type and `mock-data.ts` updated with `sku`, `isActive`, `scent`, `material`, `dimensions`, `burningTime`.
    *   Admin product forms updated to include these fields.
    *   Product Detail page updated to display these attributes.
*   **Product Deactivation:**
    *   Admin product list allows toggling `isActive` status (simulated).
    *   Admin product forms include `isActive` switch.
    *   Main site product listings (`HomePage`, `ProductsPage`) filter to show only active products.
*   **Admin Panel Foundation (`/admin`):**
    *   **Simulated Authentication (`AdminAuthContext`):** Login page (`/admin/login`) for 'ADMIN' and 'MANAGER' roles. Logout functionality. Dynamically added managers (via UI by Admin) are stored in `localStorage` and checked by `AdminAuthContext`.
    *   **Password visibility toggle** added to admin login form.
    *   **Enhanced toast feedback** for admin login errors from `AdminAuthContext`.
    *   **Role-Based Access:**
        *   Navigation items in `AdminLayout.tsx` are strictly visible based on 'ADMIN' or 'MANAGER' roles.
        *   Page-level access control for admin-only pages (`/admin/users`, `/admin/settings`, `/admin/logs`) with redirection.
    *   **Admin Layout (`src/app/admin/layout.tsx`):**
        *   Collapsible sidebar, header with toggles.
        *   **Dark/Light Theme Toggle:** Functional, preference saved in `localStorage`.
        *   **i18n (EN/RU):** Functional language switcher (dropdown), preference saved in `localStorage`. Admin layout text and some page titles (Dashboard, Login) are localized.
    *   **Mobile Access Restriction:** Admin panel shows a message to use desktop if accessed on mobile (except login).
    *   **Version Display:** Admin panel footer shows simulated version and update date.
    *   **Product Management Section (`/admin/products`, `/new`, `/edit/[id]`):**
        *   UI for listing products (mock data), including **product main image, ID, SKU, and Active status display**.
        *   Forms for product CRUD (client-side simulated actions) with `react-hook-form` and Zod.
        *   **Image Upload:** `ImageUploadArea.tsx` component with drag-and-drop, previews, and main image selection integrated into product forms (simulated using Data URLs).
        *   **Expanded attributes in forms:** SKU, Scent, Material, Dimensions, Burning Time, Active status.
    *   **User Management Section (`/admin/users`, `/new-manager` - Admin Only):**
        *   UI for listing managers (predefined + localStorage).
        *   Form for adding new managers (client-side simulated via `localStorage`).
        *   **Password visibility toggle** added to new manager form.
    *   **Client Management Section (`/admin/clients`):**
        *   **UI for listing mock clients** with search and simulated block/unblock functionality.
    *   **Logs Section (`/admin/logs` - Admin Only):**
        *   **UI for displaying simulated logs** from `localStorage`.
        *   **Functionality to clear all logs.**
        *   Basic logging for admin login/logout, product "delete", product status toggle, manager "add".
    *   **Dashboard (`/admin/dashboard`):**
        *   UI stubs for various statistics (revenue, payments, products, clients etc.).
        *   **"Recent Activity" section** displaying latest logs from the simulated logger.
    *   **Other Admin Sections (Sales, Marketing, Reports, Finances, Discounts, Content, Settings):** Placeholder pages created, navigation updated.

## 2. What's Left to Build (Key Areas)

*   **Admin Panel - Full Functionality & UI:**
    *   **Full CRUD UI & Logic for Orders, Discounts, Content, Settings.**
    *   Real data visualization on Dashboard.
    *   Advanced table features (pagination, server-side sort/filter) for Products, Orders, Users, Clients.
    *   Complete translation of all admin panel pages/components into EN/RU.
    *   UI for managing flexible key-value product attributes in admin forms (currently basic text inputs).
*   **Backend Integration (Prisma/PostgreSQL - Next Major Phase):**
    *   Define full Prisma schema (initial schema outlined in `deployment_guide.md`).
    *   Implement all API routes or Server Actions for data CUD for all admin sections.
    *   Migrate main site user authentication (email/password) to use the database via NextAuth Credentials.
    *   Implement real NextAuth Credentials provider for admin login using the database.
    *   Implement real logging to the database.
    *   Implement real client management.
*   **Full Content Localization (Main Site & Admin):**
    *   Translate all remaining text strings in all dictionary files (main site & admin).
    *   Localize dynamic content from `mock-data.ts` (or future DB).
    *   Localize Zod validation messages.
*   **Main Site Enhancements:**
    *   Address auto-suggestion for checkout.
    *   Visual indicator on product detail page if a product is inactive.
*   **Payment Processing:** Stripe integration.
*   **Genkit AI Features.**
*   **Search/Filtering/Sorting:** Server-side implementation for main site for performance with larger datasets.
*   **Testing, Deployment, Email Notifications.**

## 3. Current Status

*   **Main Site:** MVP with core e-commerce UI flows implemented and largely localized (UZ/RU/EN). Authentication is hybrid (NextAuth Google + Simulated Email/Pass). Product data is mocked, prices in UZS. Product filters are dynamic for categories/scent/material, with dynamic price range, and filter only active products. Sorting verified. Inactive products hidden from lists.
*   **Admin Panel:** UI shell created with simulated authentication (ADMIN/MANAGER roles), collapsible sidebar, role-based navigation, dark/light theme, and EN/RU i18n.
    *   Product management includes image display in list, ID, SKU, Active status. Forms with drag-and-drop image upload (simulated), and expanded attribute fields (SKU, Scent, Material, Dimensions, Burning Time, Active status).
    *   User (Manager) management includes adding new managers (simulated via `localStorage`).
    *   Clients section shows mock client data with search/simulated block.
    *   Logs section shows simulated admin actions from `localStorage` with a clear function.
    *   Dashboard shows mock stats and recent simulated activity.
    *   Mobile access is restricted. Version info displayed.
    *   Password visibility toggles added to admin login and new manager forms.
*   **Memory Bank system active.** `deployment_guide.md` created and updated.

## 4. Known Issues/Previous Errors Addressed (Recent)
*   "Cannot read properties of undefined (reading 'addToCart')" in ProductCard (addressed with dictionary fallbacks and prop passing checks).
*   Admin panel styling issues (addressed, global CSS applied).
*   Admin panel product image upload/selection UI implemented (simulated).
*   Product filters for scent/material are now dynamic; price range is dynamic.
*   Prices converted to UZS.
*   Password visibility toggles added to login/registration and admin forms.
*   Login/registration error feedback improved with clearer toast messages.
*   Admin `currentPathWithoutLocale` error in Header fixed.
*   "cn is not defined" error in Header fixed.
*   Admin panel access from mobile restricted.
*   Admin panel version/date display added.
*   Display of main product image in admin product list added.
*   Admin Clients and Logs sections have initial simulated UI and functionality.
*   Admin login issue due to dictionary access in context resolved.

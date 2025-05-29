
# Progress: Askim candles

## Date: 2024-07-30 (Simulated Date of Update)

## 1. What Works (Implemented Features)

*   **Brand Name:** "Askim candles" (updated in Logo, dictionaries).
*   **Main Site Internationalization (i18n - UZ default, RU, EN):**
    *   Path-based routing (`/[locale]/...`). Dictionary files and getters in place.
    *   All key e-commerce pages (`HomePage`, `About`, `Cart`, `Checkout`, `Login`, `Register`, `Account` section, `ProductDetail`, `ProductList`) moved to `/[locale]` and largely localized.
    *   Functional language switcher in Header (desktop dropdown, compact mobile list).
    *   Middleware (`middleware.ts`) for locale handling.
*   **Styling:** Tailwind CSS, ShadCN UI. Custom theme. Main site header/footer hidden on admin pages. Global CSS applied to admin panel.
*   **Main Site User Authentication (Hybrid & Localized):**
    *   NextAuth.js with Google Provider: Functional.
    *   Client-Simulated Email/Password (`AuthContext`): Multi-step registration, login, logout. All locale-aware.
*   **Checkout Flow:** Users must be logged in (either NextAuth or simulated) to proceed to checkout.
*   **Prices in UZS:** Product prices in `mock-data.ts` adjusted; display components show UZS.
*   **Admin Panel Foundation (`/admin`):**
    *   **Simulated Authentication (`AdminAuthContext`):** Login page (`/admin/login`) for 'ADMIN' and 'MANAGER' roles. Logout functionality. Dynamically added managers (via UI by Admin) are stored in `localStorage` and checked by `AdminAuthContext`.
    *   **Role-Based Access:**
        *   Navigation items in `AdminLayout.tsx` are strictly visible based on 'ADMIN' or 'MANAGER' roles.
        *   Page-level access control for admin-only pages (`/admin/users`, `/admin/settings`, `/admin/logs`) with redirection.
    *   **Admin Layout (`src/app/admin/layout.tsx`):**
        *   Collapsible sidebar, header with toggles.
        *   **Dark/Light Theme Toggle:** Functional, preference saved in `localStorage`.
        *   **i18n (EN/RU):** Functional language switcher (dropdown), preference saved in `localStorage`. Admin layout text is localized.
    *   **Mobile Access Restriction:** Admin panel shows a message to use desktop if accessed on mobile.
    *   **Version Display:** Admin panel footer shows simulated version and update date.
    *   **Product Management Section (`/admin/products`, `/new`, `/edit/[id]`):**
        *   UI for listing products (mock data), including **product image display**.
        *   Forms for product CRUD (client-side simulated actions).
        *   **Image Upload:** `ImageUploadArea.tsx` component with drag-and-drop, previews, and main image selection integrated into product forms (simulated using Data URLs).
    *   **User Management Section (`/admin/users`, `/new-manager` - Admin Only):**
        *   UI for listing managers (predefined + localStorage).
        *   Form for adding new managers (client-side simulated via `localStorage`).
    *   **Client Management Section (`/admin/clients`):**
        *   **UI for listing mock clients** with search and simulated block/unblock functionality.
    *   **Logs Section (`/admin/logs` - Admin Only):**
        *   **UI for displaying simulated logs** from `localStorage`.
        *   **Functionality to clear all logs.**
        *   Basic logging for admin login/logout, product "delete", manager "add".
    *   **Dashboard (`/admin/dashboard`):**
        *   UI stubs for various statistics (revenue, payments, products, clients etc.).
        *   **"Recent Activity" section** displaying latest logs from the simulated logger.
    *   **Other Admin Sections (Sales, Marketing, Reports, Finances, Discounts, Content, Settings):** Placeholder pages created.

## 2. What's Left to Build (Key Areas)

*   **Admin Panel - Full Functionality & UI:**
    *   **Full CRUD UI & Logic for Orders, Discounts, Content, Settings.**
    *   Real data visualization on Dashboard.
    *   Advanced table features (pagination, server-side sort/filter) for Products, Orders, Users, Clients.
    *   Complete translation of all admin panel pages/components into EN/RU.
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
*   **Payment Processing:** Stripe integration.
*   **Genkit AI Features.**
*   **Search/Filtering/Sorting:** Server-side implementation for main site.
*   **Testing, Deployment, Email Notifications.**

## 3. Current Status

*   **Main Site:** MVP with core e-commerce UI flows implemented and largely localized (UZ/RU/EN). Authentication is hybrid. Product data is mocked, prices in UZS.
*   **Admin Panel:** UI shell created with simulated authentication, collapsible sidebar, role-based navigation, dark/light theme, and EN/RU i18n.
    *   Product management includes image display in list, and forms with drag-and-drop image upload (simulated).
    *   User (Manager) management includes adding new managers (simulated via `localStorage`).
    *   Clients section shows mock client data with search/simulated block.
    *   Logs section shows simulated admin actions from `localStorage` with a clear function.
    *   Dashboard shows mock stats and recent simulated activity.
*   **Memory Bank system active.** `deployment_guide.md` created and updated.

## 4. Known Issues/Previous Errors Addressed (Recent)
*   "Cannot read properties of undefined (reading 'addToCart')" in ProductCard (addressed with dictionary fallbacks and prop passing checks).
*   `currentPathWithoutLocale` not defined in Header (addressed by correct scoping).
*   Admin panel styling issues (addressed, global CSS applied).
*   Main site header/footer appearing on admin pages (fixed).
*   Admin logout button visibility/usability (improved).
*   Admin sidebar collapsibility implemented.
*   Mobile menu on main site now has a more compact language switcher.
*   Admin panel restricted on mobile devices.
*   Admin panel shows version/update info.
*   Admin panel product image upload/selection UI implemented (simulated).
*   Granular admin access control refined for menu and pages.
*   Product filters for scent/material are now dynamic.
*   Forced login before checkout implemented.
*   Prices converted to UZS.
*   Admin panel "Clients" and "Logs" sections have initial simulated UI and functionality.
*   Product images displayed in admin product list.

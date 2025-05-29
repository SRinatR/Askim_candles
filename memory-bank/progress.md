
# Progress: Askim candles

## Date: 2024-07-30 (Simulated Date of Update)

## 1. What Works (Implemented Features)

*   **Brand Name:** "Askim candles" (updated in Logo, dictionaries).
*   **Corporate Color Palette:** Applied to `globals.css` for main site and admin panel.
*   **Main Site Internationalization (i18n - UZ default, RU, EN):**
    *   Path-based routing (`/[locale]/...`). Dictionary files and getters in place.
    *   Key e-commerce pages (`HomePage`, `About`, `Cart`, `Checkout`, `Login`, `Register`, `Account` section, `ProductDetail`, `ProductList`) are localized for static text. New "Useful Info" pages (`/info`, `/info/soy-wax`, `/info/aroma-sachet`) created and localized.
    *   Functional language switcher in Header (desktop dropdown, compact mobile horizontal list). "Полезное" link in header now leads to `/info` page.
    *   Middleware (`middleware.ts`) for locale handling and redirection.
*   **Styling:** Tailwind CSS, ShadCN UI. Custom theme (new corporate palette applied). Main site header/footer hidden on admin pages. Global CSS applied to admin panel. Homepage category display improved.
*   **Main Site User Authentication (Hybrid & Localized):**
    *   NextAuth.js with Google Provider: Functional.
    *   Client-Simulated Email/Password (`AuthContext`): Multi-step registration with simulated confirmation, login, logout. All locale-aware.
    *   **Password visibility toggles** added to login and registration forms.
    *   **Enhanced toast feedback** for login/registration errors from `AuthContext`.
*   **Checkout Flow:** Users must be logged in (either NextAuth or simulated) to proceed to checkout.
*   **Prices in UZS:** Product prices in `mock-data.ts` adjusted; display components show UZS using `toLocaleString`.
*   **Product Filters (Main Site):**
    *   Category, Scent, Material filters.
    *   Scent and Material options are dynamically generated from `mockProducts` (active products only).
    *   Price range filter with slider and input fields, with **dynamic min/max price calculation** based on `allProducts` (active products only). Robustness improved for empty product lists.
    *   Filters available in a mobile-friendly sheet with "Apply Filters" button.
    *   Filter application logic refined.
*   **Product Sorting (Main Site):** UI for sorting by relevance, price, name, newest available. **Functionality verified** for mock data.
*   **Product Attributes:**
    *   `Product` type and `mock-data.ts` updated with `sku`, `isActive`, `scent`, `material`, `dimensions`, `burningTime`.
    *   Admin product forms updated to include these fields. Category, Scent, Material are now `Select` inputs.
    *   Product Detail page updated to display these attributes.
*   **Product Categories (Data):**
    *   `mock-data.ts` and dictionaries updated with new categories: Корпоративные наборы, Свадебные комплименты, Аромасвечи, Вкусный дом, Гипсовый рай.
*   **Product Deactivation:**
    *   Admin product list allows toggling `isActive` status (simulated).
    *   Admin product forms include `isActive` switch.
    *   Main site product listings (`HomePage`, `ProductsPage`) filter to show only active products.
*   **Admin Panel Foundation (`/admin`):**
    *   **Simulated Authentication (`AdminAuthContext`):** Login page (`/admin/login`) for 'ADMIN' and 'MANAGER' roles. Logout functionality. Dynamically added managers (via UI by Admin) are stored in `localStorage` and checked by `AdminAuthContext`.
    *   **Password visibility toggle** added to admin login form.
    *   **Enhanced toast feedback** for admin login errors from `AdminAuthContext`.
    *   **Role-Based Access:**
        *   Navigation items in `AdminLayout.tsx` are strictly visible based on 'ADMIN' or 'MANAGER' roles. Dropdown for "Attributes" added.
        *   Page-level access control for admin-only pages (`/admin/users`, `/admin/settings`, `/admin/logs`, `/admin/attributes/*`) with redirection.
    *   **Admin Layout (`src/app/admin/layout.tsx`):**
        *   Collapsible sidebar, header with toggles.
        *   **Dark/Light Theme Toggle:** Functional, preference saved in `localStorage`.
        *   **i18n (EN/RU):** Functional language switcher (dropdown), preference saved in `localStorage`. Admin layout text and some page titles (Dashboard, Login, Attribute pages) are localized.
    *   **Mobile Access Restriction:** Admin panel shows a message to use desktop if accessed on mobile (except login).
    *   **Version Display:** Admin panel footer shows simulated version and update date. Main site footer shows only version (no "Last Updated").
    *   **Product Management Section (`/admin/products`, `/new`, `/edit/[id]`):**
        *   UI for listing products (mock data), including **product main image, ID, SKU, and Active status display**.
        *   Forms for product CRUD (client-side simulated actions) with `react-hook-form` and Zod.
        *   **Multilingual Inputs:** Name and Description fields are now tabbed for EN/RU/UZ input.
        *   **Image Upload:** `ImageUploadArea.tsx` component with drag-and-drop, previews, and main image selection integrated into product forms (simulated using Data URLs).
        *   **Expanded attributes in forms:** SKU, Scent (Select), Material (Select), Category (Select), Dimensions, Burning Time, Active status.
    *   **User Management Section (`/admin/users`, `/new-manager` - Admin Only):**
        *   UI for listing managers (predefined + localStorage).
        *   Form for adding new managers (client-side simulated via `localStorage`).
        *   **Password visibility toggle** added to new manager form.
    *   **Client Management Section (`/admin/clients`):**
        *   UI for listing mock clients with client-side search and simulated block/unblock functionality.
    *   **Attribute Management Section (`/admin/attributes/*` - Admin Only):**
        *   UI for managing custom Categories, Materials, and Scents (add, view, delete from `localStorage`).
        *   Modal warning implemented for deleting attributes currently in use by products (checked against `mockProducts`).
    *   **Logs Section (`/admin/logs` - Admin Only):**
        *   UI for displaying simulated logs from `localStorage`.
        *   **Functionality to clear all logs.** Client-side filtering (user email, action text) and sorting (timestamp, email, action) implemented.
        *   Logging for admin login/logout, product "delete", product status toggle, manager "add".
    *   **Dashboard (`/admin/dashboard`):**
        *   UI stubs for various statistics (revenue, payments, products, clients etc.). More detailed placeholders added.
        *   **"Recent Activity" section** displaying latest logs from the simulated logger.
    *   **Other Admin Sections (Sales, Marketing, Reports, Finances, Discounts, Content, Settings):** Placeholder pages created/enhanced with more structure. Navigation updated.

## 2. What's Left to Build (Key Areas)

*   **Admin Panel - Full Functionality & UI:**
    *   **Full CRUD UI & Logic for Orders, Discounts, Content, Settings.**
    *   Real data visualization on Dashboard.
    *   Advanced table features (pagination, server-side sort/filter where applicable) for Products, Orders, Users, Clients.
    *   Complete translation of all admin panel pages/components into EN/RU (beyond titles/layout).
*   **Full Product Data Localization (Main Site & Admin):**
    *   Ensure product `name` and `description` are consistently used for the current locale across all display components and admin lists. (Initial implementation for this is done).
    *   Consider how `category`, `scent`, `material` names themselves will be localized for display if their stored values are, e.g., always English slugs. (Admin `Select` options for attributes might need to show translated labels).
*   **Backend Integration (Prisma/PostgreSQL - Next Major Phase):**
    *   Define full Prisma schema (initial schema outlined in `deployment_guide.md`).
    *   Implement all API routes or Server Actions for data CUD for all admin sections.
    *   Migrate main site user authentication (email/password) to use the database via NextAuth Credentials.
    *   Implement real NextAuth Credentials provider for admin login using the database.
    *   Implement real logging to the database.
    *   Implement real client management and attribute management (Categories, Materials, Scents) in the database.
*   **Full Content Localization (Main Site & Admin):**
    *   Translate all remaining text strings in all dictionary files (main site & admin).
    *   Localize Zod validation messages.
*   **Main Site Enhancements:**
    *   Address auto-suggestion for checkout.
    *   Visual indicator on product detail page if a product is inactive.
*   **Payment Processing:** Stripe integration.
*   **Genkit AI Features.**
*   **Search/Filtering/Sorting:** Server-side implementation for main site for performance with larger datasets.
*   **Testing, Deployment, Email Notifications.**

## 3. Current Status

*   **Main Site:** MVP with core e-commerce UI flows implemented and largely localized (UZ/RU/EN). Authentication is hybrid (NextAuth Google + Simulated Email/Pass). Product data is mocked, prices in UZS. Product filters are dynamic, with dynamic price range, and filter only active products. Sorting verified. Inactive products hidden from lists. New corporate color palette applied. Homepage category display improved. "Useful Info" section in header links to `/info` page with article stubs. Product `name` and `description` are now multilingual. Footer "Last Updated" date removed.
*   **Admin Panel:** UI shell created with simulated authentication (ADMIN/MANAGER roles), collapsible sidebar, role-based navigation, dark/light theme, and EN/RU i18n. New corporate color palette applied.
    *   Product management includes image display in list, ID, SKU, Active status. Forms with drag-and-drop image upload (simulated), multilingual name/description inputs, and expanded attribute fields (SKU, Scent (Select), Material (Select), Category (Select), Dimensions, Burning Time, Active status).
    *   User (Manager) management includes adding new managers (simulated via `localStorage`).
    *   Attribute management (Categories, Materials, Scents) allows adding/deleting custom attributes (simulated via `localStorage`) with warnings for in-use attributes.
    *   Clients section shows mock client data with search/simulated block.
    *   Logs section shows simulated admin actions from `localStorage` with a clear function, and client-side filtering/sorting.
    *   Dashboard shows enhanced mock stats and recent simulated activity.
    *   Sales, Marketing, Reports, Finances pages have more structured placeholders.
    *   Mobile access is restricted. Version info displayed.
    *   Password visibility toggles added to admin login and new manager forms.
*   **Memory Bank system active.** `deployment_guide.md` created and updated.

## 4. Known Issues/Previous Errors Addressed (Recent)
*   Admin panel `DropdownMenu` usage for sidebar items with sub-menus corrected.
*   Main site footer "Last Updated" date removed.

```
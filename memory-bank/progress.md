
# Progress: Askim candles

## Date: 2024-07-30 (Simulated Date of Update)

## 1. What Works (Implemented Features)

*   **Brand Name:** "Askim candles" (updated in Logo, dictionaries).
*   **Corporate Color Palette:** Applied to `globals.css` for main site. Admin panel dark theme reverted to corporate-derived palette with adjusted hover effects.
*   **Main Site Internationalization (i18n - UZ default, RU, EN):**
    *   Path-based routing (`/[locale]/...`). Dictionary files and getters in place.
    *   Key e-commerce pages (`HomePage`, `ProductsPage`, `ProductDetailPage`, `CartPage`, `CheckoutPage`, `LoginPage`, `RegisterPage`, `Account` section pages, `AboutUsPage`) are localized for static text.
    *   "Useful Info" section (`/info`, `/info/[slug]`) implemented with dynamic, multilingual articles (including images) from admin.
    *   Functional language switcher in Header (desktop dropdown, compact mobile horizontal list).
    *   Middleware (`middleware.ts`) for locale handling and redirection.
*   **Styling:** Tailwind CSS, ShadCN UI. Custom corporate theme. Main site header/footer hidden on admin pages. Global CSS applied to admin panel. Homepage category display improved. Admin product table layout adjusted.
*   **Main Site User Authentication (Hybrid & Localized):**
    *   NextAuth.js with Google Provider: Functional.
    *   Client-Simulated Email/Password (`AuthContext`): Multi-step registration with simulated confirmation, login, logout. All locale-aware.
    *   **Password visibility toggles** added to login and registration forms.
    *   **Enhanced toast feedback** for login/registration errors from `AuthContext`.
*   **Checkout Flow:** Users must be logged in (either NextAuth or simulated) to proceed to checkout.
*   **Prices in UZS:** Product prices in `mock-data.ts` adjusted; display components show UZS using `toLocaleString`.
*   **Product Filters (Main Site):**
    *   Category, Scent, Material filters. Category filter logic fixed to compare slugs after normalization.
    *   Scent and Material options are dynamically generated from `mockProducts` (active products only).
    *   Price range filter with slider and input fields, with **dynamic min/max price calculation** based on `allProducts` (active products only). Robustness improved for empty product lists.
    *   Filters available in a mobile-friendly sheet with "Apply Filters" button.
    *   Filter application logic refined.
*   **Product Sorting (Main Site):** UI for sorting by relevance, price, name, newest available. **Functionality verified** for mock data.
*   **Product Attributes:**
    *   `Product` type and `mock-data.ts` updated with multilingual `name` and `description`, `sku`, `costPrice`, `isActive`, `scent`, `material`, `dimensions`, `burningTime`.
    *   Admin product forms updated to include these fields. Category, Scent, Material are `Select` inputs drawing from dynamic admin-managed attributes.
    *   Product Detail page updated to display these attributes.
*   **Product Categories (Data):**
    *   `mock-data.ts` and dictionaries updated with new categories: Корпоративные наборы, Свадебные комплименты, Аромасвечи, Вкусный дом, Гипсовый рай.
*   **Product Deactivation:**
    *   Admin product list allows toggling `isActive` status (simulated).
    *   Admin product forms include `isActive` switch.
    *   Main site product listings (`HomePage`, `ProductsPage`) filter to show only active products. Product detail page shows inactive products if accessed directly (visual indicator pending).
*   **Article Management (Admin & Main Site):**
    *   Admin section (`/admin/articles`) for CRUD of articles (simulated via `localStorage`).
    *   Articles have multilingual titles and content (EN/RU/UZ via tabs in admin form).
    *   Articles support shared or per-language main images (`ImageUploadArea`).
    *   Main site "Useful Info" (`/info`) page lists active articles with images.
    *   Dynamic article detail page (`/info/[slug]`) displays localized content and image with `prose` styling.
    *   Old static article pages removed. Header link for "Полезное" updated.
*   **Admin Panel Foundation (`/admin`):**
    *   **Simulated Authentication (`AdminAuthContext`):** Login page (`/admin/login`) for 'ADMIN' and 'MANAGER' roles. Logout functionality. Dynamically added managers (via UI by Admin) are stored in `localStorage` and checked by `AdminAuthContext`.
    *   **Password visibility toggle** added to admin login and new manager forms.
    *   **Enhanced toast feedback** for admin login/auth errors.
    *   **Role-Based Access:**
        *   Navigation items in `AdminLayout.tsx` are strictly visible based on 'ADMIN' or 'MANAGER' roles. Dropdown for "Attributes" now an accordion that opens downwards for desktop.
        *   Page-level access control for admin-only pages (`/admin/users`, `/admin/settings`, `/admin/logs`, `/admin/attributes/*`) with redirection.
    *   **Admin Layout (`src/app/admin/layout.tsx`):**
        *   Collapsible sidebar, header with toggles.
        *   **Dark/Light Theme Toggle:** Functional, preference saved in `localStorage`. Applied new corporate color palette (with specific dark theme variant, hover effects adjusted).
        *   **i18n (EN/RU):** Functional language switcher (dropdown), preference saved in `localStorage`. Admin layout text and some page titles (Dashboard, Login, Attribute pages) are localized.
    *   **Mobile Access Restriction:** Admin panel shows a message to use desktop if accessed on mobile (except login).
    *   **Version Display:** Admin panel footer shows simulated version and update date. Main site footer shows only version.
    *   **Product Management Section (`/admin/products`, `/new`, `/edit/[id]`):**
        *   UI for listing products (mock data), including **product main image, ID, SKU, Cost Price, and Active status display**.
        *   Forms for product CRUD (client-side simulated actions) with `react-hook-form` and Zod.
        *   **Multilingual Inputs:** Name and Description fields are tabbed for EN/RU/UZ.
        *   **Image Upload:** `ImageUploadArea.tsx` component integrated into product forms.
        *   **Expanded attributes in forms:** SKU, Cost Price, Scent (Select), Material (Select), Category (Select), Dimensions, Burning Time, Active status. Options for Selects are dynamic based on admin-managed attributes.
    *   **User Management Section (`/admin/users`, `/new-manager` - Admin Only):**
        *   UI for listing managers (predefined + localStorage). Includes display of Role and Status (Active/Blocked).
        *   Form for adding new managers (client-side simulated via `localStorage`).
        *   Simulated actions for Block/Unblock and (UI only) Change Role for dynamically added managers.
    *   **Client Management Section (`/admin/clients`):**
        *   UI for listing mock clients with client-side search, **filtering by status (Active/Blocked), sorting by columns, and pagination.** Simulated block/unblock functionality. **Modals for View Details, Edit Client, and Delete Client (all simulated).**
    *   **Attribute Management Section (`/admin/attributes/*` - Admin Only):**
        *   Full CRUD UI for managing Categories, Materials, and Scents (add, view, **edit**, delete from `localStorage`).
        *   Modal warning implemented for deleting/renaming attributes currently in use by products.
    *   **Logs Section (`/admin/logs` - Admin Only):**
        *   UI for displaying simulated logs from `localStorage`.
        *   **Functionality to clear all logs.** Client-side **filtering (user email, action text) and sorting (timestamp, email, action)** implemented.
        *   Logging for admin login/logout, product "delete", product status toggle, manager "add", manager block/unblock.
    *   **Dashboard (`/admin/dashboard`):**
        *   UI stubs for various statistics (revenue, payments, products, clients etc.). More detailed placeholders added.
        *   **"Recent Activity" section** displaying latest logs from the simulated logger.
    *   **Other Admin Sections (Sales, Marketing, Reports, Finances, Discounts, Content, Settings):** Placeholder pages created/enhanced with more structure. Navigation updated.
*   **Cart State Persistence:** Cart items now persist through language changes by initializing state from `localStorage`.

## 2. What's Left to Build (Key Areas - based on User's List & Project Needs)

**Current Focus (User Request from activeContext.md):**
1.  Main Site: Add a visual indicator for inactive products on the Product Detail page (`/[locale]/products/[id]`).
2.  Admin Panel: Implement a basic UI for displaying the order list in `/admin/sales` (using `mockOrders` for now).

**Other Potential Enhancements (from user's list):**

**UX Improvements (Main Site):**
*   Improve the empty cart page (e.g., more engaging message, popular product suggestions).

**Admin Panel Functional & UI Enhancements:**
*   Dashboard: Implement basic data visualization (e.g., simple charts for sales, top products using `shadcn/ui` charts with mock data).
*   Orders (`/admin/sales` - beyond basic list): Add filtering by status, view order details (linking to a new detail page stub).
*   Pagination for admin lists (products, logs - client-side initially).
*   Further detail Marketing, Reports, Finances, Discounts, Content, Settings sections beyond current placeholders.
*   Real file uploads and management for product/article images (instead of Data URLs).
*   Admin User Management: UI for assigning actual permissions (requires backend).

**Technical Improvements & Future Prep:**
*   **Backend Integration (Prisma/PostgreSQL - Next Major Phase):**
    *   Define full Prisma schema (initial schema outlined in `deployment_guide.md`).
    *   Implement all API routes or Server Actions for data CUD for all admin sections.
    *   Migrate main site user authentication (email/password) to use the database via NextAuth Credentials.
    *   Implement real NextAuth Credentials provider for admin login using the database.
    *   Implement real logging to the database.
    *   Implement real client management and attribute management (Categories, Materials, Scents) in the database.
    *   Implement real user/manager role and permission system in the database.
*   **Full Content Localization (Main Site & Admin):**
    *   Translate all remaining text strings in all dictionary files (main site & admin).
    *   Localize Zod validation messages.
*   **Main Site Enhancements:**
    *   Address auto-suggestion for checkout.
*   **Payment Processing:** Stripe integration.
*   **Genkit AI Features.**
*   **Search/Filtering/Sorting:** Server-side implementation for main site for performance with larger datasets.
*   **Testing, Deployment, Email Notifications.**

## 3. Current Status

*   **Main Site:** MVP with core e-commerce UI flows implemented and largely localized (UZ/RU/EN). Authentication is hybrid (NextAuth Google + Simulated Email/Pass). Product data is mocked (includes `costPrice`), prices in UZS. Product filters are dynamic and filter only active products, category filter logic corrected. Sorting verified. Inactive products hidden from lists. New corporate color palette applied. "Useful Info" section has dynamic articles with multilingual text and images. Cart persists across language changes.
*   **Admin Panel:** UI shell created with simulated authentication (ADMIN/MANAGER roles), collapsible sidebar, role-based navigation, dark/light theme (dark theme reverted to corporate-derived palette, hover effects adjusted), and EN/RU i18n.
    *   Product management includes image display in list, ID, SKU, Cost Price, Active status. Forms with drag-and-drop image upload (simulated), multilingual name/description inputs, and expanded attribute fields (SKU, Cost Price, Scent (Select), Material (Select), Category (Select), Dimensions, Burning Time, Active status. Attribute Select options are dynamic from admin-managed localStorage.
    *   Article management allows CRUD for multilingual articles with shared/per-language images (simulated via `localStorage`).
    *   User (Manager) management includes adding new managers (simulated via `localStorage`), displaying their role/status, and simulated block/unblock actions and role change UI.
    *   Attribute management (Categories, Materials, Scents) allows full CRUD (add, **edit**, delete from `localStorage`) with warnings for in-use attributes. "Attributes" menu in sidebar is an accordion opening downwards.
    *   Clients section shows mock client data with search, **filtering by status, sorting by columns, pagination, and simulated View/Edit/Delete modals.**
    *   Logs section shows simulated admin actions from `localStorage` with a clear function, and client-side **filtering/sorting**.
    *   Dashboard shows enhanced mock stats and recent simulated activity.
    *   Sales, Marketing, Reports, Finances pages have more structured placeholders.
    *   Mobile access is restricted (except login). Version info displayed.
    *   Password visibility toggles added to admin login and new manager forms.
*   **Memory Bank system active.** `deployment_guide.md` created and updated.

## 4. Known Issues/Previous Errors Addressed (Recent)
*   Admin panel "Attributes" menu fixed to be a proper accordion.
*   JSON parsing errors in `ru.json` fixed.
*   "formState is not defined" in admin product forms fixed.
*   `FormProvider` not imported error in admin product edit form fixed.
*   Horizontal scrolling in admin product table significantly improved.
*   Main site category filter logic made more robust.
*   `CartContext` updated to better persist cart items on language change.
*   `cn is not defined` and `currentPathWithoutLocale is not defined` errors in Header fixed.
*   `SheetTrigger` and `X` icon import errors in admin layout fixed.
*   Admin login toast messages fixed.
*   Admin panel version display logic in footer fixed.
*   Admin panel mobile access restriction logic verified.
*   "Cannot read properties of undefined (reading 'addToCart')" error in ProductCard fixed by ensuring dictionary prop is always passed.
*   HTML nesting `<div>` in `<p>` for `Badge` in client view modal fixed.
*   Parsing error in `admin/clients/page.tsx` for `setSortConfig` fixed.

    

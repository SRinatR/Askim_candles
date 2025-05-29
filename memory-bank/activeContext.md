
# Active Context: Askim candles

## Date: 2024-07-30 (Simulated Date of Update)

## 1. Current Focus
*   **Admin Panel - Clients Section Enhancements:** Implement client-side filtering by status (Active/Blocked), sorting by various columns, and pagination for the client list.
*   Verify all changes and ensure no regressions.

## 2. Recent Changes (Leading to this state)
*   **Cost Price Feature:** `costPrice` field added to products. Visible and editable in admin product forms and displayed in the admin product list.
*   **Admin Panel - Table Layout Fixes:** Addressed horizontal scrolling issues in the admin product list by adjusting column widths and padding.
*   **Product Category Filter Fix:** Resolved issue where selecting a category in main site filters resulted in "No products found" due to mismatch in comparison logic (slug vs. name). Filter now correctly compares slugs.
*   **Product Deactivation Feature & SKU/ID:** Implemented. Products can be marked inactive, hiding them from main site listings. SKU and Product ID are now part of product data and admin UI.
*   **Admin Panel - Dynamic Attributes Management (Categories, Materials, Scents):** Implemented full CRUD (add, edit, delete from `localStorage`, with initial seeding from mock data) with warning modals for deleting/renaming in-use attributes. Product forms updated to use these dynamic attributes in `Select` components. Attribute menu in sidebar now an accordion.
*   **Admin Panel - Article Management with Images:**
    *   Admin section for creating, editing, and deleting articles (simulated via `localStorage`).
    *   Multilingual input for article titles and content (EN, RU, UZ via tabs).
    *   Option to use a shared main image or per-language images for articles, with `ImageUploadArea` integration.
    *   Main site "Useful Info" (`/info`) page now lists active articles with images.
    *   Dynamic article detail page (`/info/[slug]`) displays localized content and the appropriate image with `prose` styling.
*   **Admin Panel Navigation:** "Attributes" and "Articles" sections are functional in the sidebar. "Attributes" dropdown now an accordion.
*   **Internationalization (i18n) & UI Enhancements:**
    *   Main site fully path-based (`/[locale]`) for UZ/RU/EN. Key pages localized (Homepage, Product Listing, Product Detail, Cart, Checkout, Account, About Us, Login, Register, "Useful Info" section).
    *   Functional language switcher (desktop dropdown, compact mobile horizontal list).
    *   Admin panel has client-side i18n (EN/RU, with localStorage preference) and a dark/light theme toggle (dark theme reverted to corporate-derived palette, hover effects adjusted).
    *   Password visibility toggles and improved toast feedback implemented.
    *   Main site product filters and sorting enhanced (dynamic price range).
    *   Cart state persists through language changes.
*   **Error Fixes:** Resolved various "cn is not defined", "SheetTrigger is not defined", `FormProvider` not defined, JSON parsing, and hydration errors. Addressed issues with main site footer visibility on admin pages, mobile menu close button, and admin header/footer visibility.

## 3. Next Steps (Potential - based on user's previous input list)

**Immediate Focus (User Preference from before theme issues):**
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

**Technical Improvements & Future Prep:**
*   Localize Zod validation messages.
*   Make admin panel toasts more consistent and informative across all CRUD operations.
*   Prepare for full backend integration (Prisma/PostgreSQL) for all simulated data.

## 4. Active Decisions & Considerations
*   **Admin Dark Theme:** Reverted to corporate-color-derived dark theme. Hover effects adjusted.
*   **Backend Transition:** All new features are being built with future backend integration (Prisma/PostgreSQL) in mind.
*   **Attribute & Article Management:** Now fully dynamic using `localStorage` for admin, with initial seeding from mock data if empty. Includes multilingual text and image support for articles.
*   **Mobile Admin Access:** Restricted, user prompted to use desktop.
*   **Simulated Data:** Product, order, client, and log data are managed client-side or via `mock-data.ts`. `costPrice` is now part of product data. Client list in admin now supports filtering by status, sorting, and pagination (client-side).

    
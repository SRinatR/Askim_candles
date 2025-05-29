
# Active Context: Askim candles

## Date: 2024-07-30 (Simulated Date of Update)

## 1. Current Focus
*   Finalizing documentation of recent features (Dynamic Attributes, Articles with Images).
*   Planning next development phase based on user-provided list of improvements.

## 2. Recent Changes (Leading to this state)
*   **Dynamic Attributes Management (Admin):** Implemented full CRUD for Categories, Materials, and Scents with `localStorage` persistence, including edit functionality and warning modals for deleting/renaming in-use attributes. Product forms updated to use these dynamic attributes in `Select` components.
*   **Article Management with Images (Admin & Main Site):**
    *   Admin panel section for creating, editing, and deleting articles (with `localStorage` persistence).
    *   Multilingual input for article titles and content (EN, RU, UZ via tabs).
    *   Option to use a shared main image or per-language images for articles, with `ImageUploadArea` integration.
    *   Main site "Useful Info" (`/info`) page now lists active articles with images.
    *   Dynamic article detail page (`/info/[slug]`) displays localized content and the appropriate image with `prose` styling.
*   **Admin Panel Navigation:** "Attributes" and "Articles" sections are functional in the sidebar. "Attributes" dropdown now opens downwards.
*   **Internationalization (i18n) Foundation:** Main site uses path-based i18n (`/[locale]`). Key pages (Homepage, Products, Product Detail, Cart, Checkout, Account, Info) are localized. Admin panel has client-side i18n (EN/RU) and dark theme.
*   **Error Fixes:** Resolved various "cn is not defined", "SheetTrigger is not defined", "FormProvider is not defined", "formState is not defined", JSON parsing, and hydration errors. Addressed issues with mobile menu close button and admin header/footer visibility.
*   **Brand Update:** Changed to "Askim candles".

## 3. Next Steps (Potential - based on user's latest input)

**Immediate Focus (User Preference):**
1.  **Main Site:** Add a visual indicator for inactive products on the Product Detail page (`/[locale]/products/[id]`).
2.  **Admin Panel:** Implement a basic UI for displaying the order list in `/admin/sales` (using `mockOrders` for now).

**Other Potential Enhancements (from user's list):**

**UX Improvements (Main Site):**
*   Enhance the "Useful Info" page (`/info`) further with article teasers/previews beyond the current card list.
*   Improve the empty cart page (e.g., more engaging message, popular product suggestions).

**Admin Panel Functional & UI Enhancements:**
*   Dashboard: Implement basic data visualization (e.g., simple charts for sales, top products using `shadcn/ui` charts with mock data).
*   Orders (`/admin/sales` - beyond basic list): Add filtering by status, view order details (linking to a new detail page stub).
*   Pagination for admin lists (products, clients, logs - client-side initially).
*   Further detail Clients, Marketing, Reports, Finances, Discounts, Content, Settings sections beyond current placeholders.

**Technical Improvements & Future Prep:**
*   Localize Zod validation messages.
*   Make admin panel toasts more consistent and informative across all CRUD operations.
*   Prepare for full backend integration (Prisma/PostgreSQL) for all simulated data (products, orders, users, attributes, articles, logs, sessions).

## 4. Active Decisions & Considerations
*   **Backend Transition:** All new features are being built with future backend integration (Prisma/PostgreSQL) in mind.
*   **Attribute Management:** Now fully dynamic using `localStorage` for admin, with initial seeding from mock data if empty.
*   **Article Management:** Includes multilingual text and image support (shared or per-language), stored in `localStorage`.
*   **Mobile Admin Access:** Restricted, user prompted to use desktop.
*   **Simulated Data:** Product, order, client, and log data are still simulated or stored in `localStorage`.
*   **Prioritization:** Focus on the two immediate tasks requested by the user before tackling the broader list.

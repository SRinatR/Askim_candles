
# Active Context: Askim candles

## Date: 2024-07-30 (Simulated Date of Update)

## 1. Current Focus
*   **Revert Admin Dark Theme:** User expressed dissatisfaction with the corporate palette applied to the admin dark theme. Reverting the `.dark` block in `globals.css` to a more standard, professional dark theme. Light theme (main site & admin) retains corporate colors.
*   Verifying all previous functionality after theme changes, particularly in the admin panel.

## 2. Recent Changes (Leading to this state)
*   **Corporate Color Palette Application:** Updated `globals.css` with HSL values for the new corporate colors (Pink, Light Pink, Dark Navy/Blue, Light Blue) for both light and dark themes. This change is being partially reverted for the dark theme.
*   **Product Deactivation Feature & SKU/ID:** Implemented.
*   **Admin Panel - Dynamic Attributes Management (Categories, Materials, Scents):** Implemented full CRUD (simulated via `localStorage`) with edit functionality and warning modals for deleting/renaming in-use attributes. Product forms updated to use these dynamic attributes in `Select` components.
*   **Admin Panel - Article Management with Images:**
    *   Admin section for creating, editing, and deleting articles (simulated via `localStorage`).
    *   Multilingual input for article titles and content (EN, RU, UZ via tabs).
    *   Option to use a shared main image or per-language images for articles, with `ImageUploadArea` integration.
    *   Main site "Useful Info" (`/info`) page now lists active articles with images.
    *   Dynamic article detail page (`/info/[slug]`) displays localized content and the appropriate image with `prose` styling.
*   **Admin Panel Navigation:** "Attributes" and "Articles" sections are functional in the sidebar. "Attributes" dropdown now opens downwards (accordion style for desktop).
*   **Internationalization (i18n) & UI Enhancements:**
    *   Main site fully path-based (`/[locale]`) for UZ/RU/EN. Key pages localized.
    *   Functional language switcher (desktop dropdown, compact mobile horizontal list).
    *   Admin panel has client-side i18n (EN/RU, with localStorage preference) and a dark/light theme toggle.
    *   Password visibility toggles and improved toast feedback implemented.
    *   Main site product filters and sorting enhanced (dynamic price range, correct sort logic).
*   **Error Fixes:** Resolved various "cn is not defined", "SheetTrigger is not defined", "FormProvider is not defined", "formState is not defined", JSON parsing, and hydration errors. Addressed issues with mobile menu close button and admin header/footer visibility.

## 3. Next Steps (Potential - based on user's previous input list)

**Immediate Focus (User Preference from before this theme reversion):**
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
*   Prepare for full backend integration (Prisma/PostgreSQL) for all simulated data.

## 4. Active Decisions & Considerations
*   **Admin Dark Theme Reversion:** The current task is to change the admin dark theme back to a more neutral/professional look, as the application of the corporate palette to it was not well-received.
*   **Backend Transition:** All new features are being built with future backend integration (Prisma/PostgreSQL) in mind.
*   **Attribute & Article Management:** Now fully dynamic using `localStorage` for admin, with initial seeding from mock data if empty. Includes multilingual text and image support for articles.
*   **Mobile Admin Access:** Restricted, user prompted to use desktop.
*   **Simulated Data:** Product, order, client, and log data are still simulated or stored in `localStorage`.


# Active Context: Askim candles

## Date: 2024-07-29 (Simulated Date of Update)

## 1. Current Focus
*   **Admin Panel - Sessions Section:** Implement a (simulated) "Sessions" management page.
    *   Display current user session info.
    *   Button to log out of the current device.
    *   Placeholder/explanation for "log out other devices" functionality (requires backend).
*   Update admin navigation and dictionaries for the new section.

## 2. Recent Changes (Leading to this state)
*   **Admin Panel - Manage Users & Managers Enhancements:**
    *   Added simulated "View Client Details", "Edit Client", and "Delete Client" functionalities with modals to `/admin/clients` page.
    *   Refined Block/Unblock UI for managers in `/admin/users`.
    *   Implemented modal for (simulated) "Change Role" for managers.
    *   Added a more informative placeholder modal for "Permissions".
    *   Visual distinction for predefined vs. dynamically added users.
*   **Product Filters (Main Site):**
    *   Improved robustness of dynamic price range calculation.
    *   Enhanced string normalization for category, scent, and material matching to fix "No products found" issue.
    *   Ensured filters initialize correctly from URL params.
*   **Admin Product List Table Layout:** Addressed horizontal scrolling issues by adjusting column widths and padding.
*   **Cost Price Feature:** `costPrice` field added to products. Visible and editable in admin product forms and displayed in the admin product list.
*   **Product Deactivation Feature & SKU/ID:** Implemented. Products can be marked inactive, hiding them from main site listings. SKU and Product ID are now part of product data and admin UI.
*   **Admin Panel - Dynamic Attributes Management (Categories, Materials, Scents):** Implemented full CRUD (add, edit, delete from `localStorage`, with initial seeding from mock data) with warning modals for deleting/renaming in-use attributes. Product forms updated to use these dynamic attributes in `Select` components. Attribute menu in sidebar now an accordion.
*   **Main Site Footer Version Display:** "Last Updated" date removed from main site footer, only version remains.
*   **Admin Panel i18n & Dark Theme:**
    *   Admin panel supports EN/RU client-side language switching.
    *   Dark/Light theme toggle implemented. Dark theme reverted to corporate-derived palette, hover effects adjusted.
*   **Main Site Product Card Price Alignment:** Prices on product cards are now consistently aligned.
*   **Error Fixes:** Multiple JSON parsing errors, "FormProvider not defined", "formState not defined", "SheetTrigger not defined", `cn` not defined, `currentPathWithoutLocale` not defined, and HTML nesting errors resolved.

## 3. Next Steps (Potential - based on user's previous input list)

**UX Improvements (Main Site):**
*   Add a visual indicator for inactive products on the Product Detail page (`/[locale]/products/[id]`).
*   Improve the empty cart page (e.g., more engaging message, popular product suggestions).

**Admin Panel Functional & UI Enhancements:**
*   Dashboard: Implement basic data visualization (e.g., simple charts for sales, top products using `shadcn/ui` charts with mock data).
*   Orders (`/admin/sales`): Implement basic UI for displaying the order list (using `mockOrders` for now). Add filtering by status, view order details (linking to a new detail page stub).
*   Pagination for admin lists (products, logs - client-side initially).
*   Further detail Marketing, Reports, Finances, Discounts, Content, Settings sections beyond current placeholders.
*   **Article Management:** Implement full CRUD for articles with multilingual text and image support (shared or per-language).

**Technical Improvements & Future Prep:**
*   Localize Zod validation messages.
*   Make admin panel toasts more consistent and informative across all CRUD operations.
*   Prepare for full backend integration (Prisma/PostgreSQL) for all simulated data.

## 4. Active Decisions & Considerations
*   **Admin Dark Theme:** Reverted to corporate-color-derived dark theme. Hover effects adjusted.
*   **Backend Transition:** All new features are being built with future backend integration (Prisma/PostgreSQL) in mind.
*   **Attribute Management:** Now fully dynamic using `localStorage` for admin, with initial seeding from mock data if empty.
*   **Mobile Admin Access:** Restricted, user prompted to use desktop.
*   **Simulated Data:** Product, order, client, and log data are managed client-side or via `mock-data.ts`. `costPrice` is now part of product data. Client list in admin now supports filtering by status, sorting, and pagination (client-side). Admin user management allows adding managers (to localStorage) and simulating block/unblock and role changes for them. Session management is also simulated.
*   **Brand Name:** "Askim candles".
*   **Main Site i18n:** Fully path-based (UZ/RU/EN) for key e-commerce pages. Language switcher is functional.


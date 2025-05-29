
# Active Context: Askim candles

## Date: 2024-07-29 (Simulated Date of Update)

## 1. Current Focus
*   **Main Site Filter & Sorting Enhancements:**
    *   Making the price range filter in `ProductFilters.tsx` dynamic based on actual product prices.
    *   Verifying and ensuring all sorting options in `src/app/[locale]/products/page.tsx` work correctly with current mock data.
*   **Admin Panel - Product Attribute Expansion:**
    *   Adding new fields (Scent, Material, Burning Time, Dimensions) to the product type, mock data, admin product forms (new/edit), and product detail page display.
*   **Price Representation:** Ensuring consistent display and handling of prices in UZS across the application.

## 2. Recent Changes (Leading to this state)
*   **Admin Panel - Initial Product, Client, and Log Management UI & Simulation:**
    *   Product list in admin now displays main images.
    *   Client section (`/admin/clients`) implemented with mock data, client-side search, and simulated block/unblock functionality.
    *   Basic simulated logging system (`/admin/logs`) using `localStorage` implemented, including log display and "Clear All Logs" function. Log calls integrated into key admin actions (login, logout, product delete, manager add).
    *   Admin dashboard (`/admin/dashboard`) enhanced with a "Recent Activity" feed based on the new logger.
*   **Admin Panel - Mobile Access Restriction & Version Display:**
    *   Mobile users trying to access admin pages (except login) are shown a message to use a desktop.
    *   Admin panel footer displays a simulated version number and last update date.
*   **Admin Panel - Collapsible Sidebar & Logout Button Visibility:**
    *   Implemented a collapsible sidebar for the admin panel.
    *   Ensured the logout button is correctly visible and positioned in both expanded and collapsed sidebar states, and in the mobile menu.
*   **Branding & UI Adjustments:**
    *   Brand name updated to "Askim candles" in `Logo.tsx` and key dictionary entries.
    *   Main site's mobile menu language switcher made more compact (horizontal).
*   **Full Site Internationalization (i18n) - UZ (default), RU, EN (Main Site):**
    *   Path-based i18n (`/[locale]/...`) fully implemented.
    *   All key e-commerce flow pages and account section pages moved to `/[locale]/...` structure and adapted to use dictionaries.
    *   Functional language switcher in Header (desktop dropdown, horizontal list for mobile).
    *   `middleware.ts` handles locale redirection.
    *   Pages `About`, `Cart`, `Checkout`, `Product Detail`, and `Account` section pages have been localized.
*   **Admin Panel i18n (EN/RU) & Dark Theme:**
    *   Implemented client-side language switching (EN default, RU) for the admin panel layout text using `localStorage` and admin-specific dictionaries.
    *   Added a dark/light theme toggle to the admin panel, with preference stored in `localStorage`.
*   **Granular Admin Access Control (Refined):**
    *   Navigation items in `AdminLayout.tsx` are strictly visible based on 'ADMIN' or 'MANAGER' roles.
    *   Page-level access control for admin-only pages (`/admin/users`, `/admin/settings`, `/admin/logs`) with redirection.
    *   Verified "Add New Manager" functionality (simulated via `localStorage` in `AdminAuthContext`) for ADMIN users.
*   **Product Image Management Foundation (Admin):**
    *   `ImageUploadArea.tsx` component created with drag-and-drop, preview, and main image selection (simulated, uses Data URLs).
    *   Integrated into `/admin/products/new/page.tsx` and `/admin/products/edit/[id]/page.tsx`.
*   **Forced Login/Registration for Checkout:** Implemented redirect to login if an unauthenticated user tries to checkout.
*   **Prices in UZS:** Updated mock data and display components to show prices in UZS using `toLocaleString('en-US')`.

## 3. Next Steps (Immediate for Me - based on user's latest request)
1.  **Dynamic Price Range Filter:** Update `ProductFilters.tsx` to calculate min/max price from `allProducts`.
2.  **Verify Sorting:** Ensure all sorting options in `products/page.tsx` work as expected.
3.  **Admin Product Attributes:**
    *   Update `Product` type in `types.ts`.
    *   Add new attributes (scent, material, dimensions, burningTime) to `mockProducts`.
    *   Update Zod schema and forms in `/admin/products/new/page.tsx` and `/admin/products/edit/[id]/page.tsx` to include these new fields.
4.  **Display New Attributes:** Update `src/app/[locale]/products/[id]/page.tsx` to show the new product attributes.
5.  **Update Memory Bank:** Reflect these changes.

## 4. Active Decisions & Considerations
*   **Admin Panel Access:** `/admin` path. Client-side simulated authentication (`AdminAuthContext`) with 'ADMIN' and 'MANAGER' roles. Admins can "add" new managers (simulated via `localStorage`).
*   **Data Management (Admin):** Currently client-side simulated for products, manager creation, client display, and logs. Future: Prisma/PostgreSQL.
*   **Admin Panel i18n & Theme:** Basic setup for EN/RU i18n (client-side preference) and Dark/Light theme toggle implemented in `AdminLayout.tsx`.
*   **Brand Name:** "Askim candles".
*   **Main Site i18n:** Path-based (UZ/RU/EN).
*   **Backend Plan:** Prisma/PostgreSQL, documented in `deployment_guide.md`.
*   **Focus on MVP:** Features are being built iteratively, prioritizing UI and simulated functionality first, with backend integration as a subsequent major phase.
*   **Granular per-manager/per-block permissions:** A future consideration dependent on backend.
*   **Admin Logs:** Client-side (`localStorage`) and capped. Real logging requires backend.
*   **Client Management:** Uses `mockAdminClients` for UI display simulation.
*   **Product Attribute Management (Admin):** Focus on adding specified fields as text inputs for now. More complex UI for `attributes` array (key-value pairs) can be a future step.
*   **Price Representation:** Prices in `mock-data.ts` are integers (e.g., 229900 UZS). Filter logic might use a divisor (e.g., 1 or 100 for display calculations). Display on frontend uses `toLocaleString`.

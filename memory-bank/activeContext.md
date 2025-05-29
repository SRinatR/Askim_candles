
# Active Context: Askim candles

## Date: 2024-07-30 (Simulated Date of Update)

## 1. Current Focus
*   **Admin Panel Feature Implementation (Simulated):**
    *   Displaying main product images in the `/admin/products` list.
    *   Building out the UI for the `/admin/clients` section using mock client data, including table display and client-side search.
    *   Implementing a basic simulated logging system for admin actions (`/admin/logs`) using `localStorage`, including log display and a "Clear All Logs" function.
    *   Integrating log calls into key admin actions (login, logout, product delete, manager add).
    *   Adding a "Recent Activity" feed to the admin dashboard based on the new logger.

## 2. Recent Changes (Leading to this state)
*   **Branding Update:** Changed brand name to "Askim candles" in `Logo.tsx` and key dictionary entries.
*   **Admin Panel i18n (EN/RU) & Dark Theme:**
    *   Implemented client-side language switching (EN default, RU) for the admin panel using `localStorage` and admin-specific dictionaries.
    *   Added a dark/light theme toggle to the admin panel, with preference stored in `localStorage`.
*   **Main Site Mobile Language Switcher:** Made more compact (horizontal) in the mobile menu.
*   **Admin Panel Mobile Access Restriction:** Users on mobile devices attempting to access admin pages (except login) are shown a message to use a desktop/laptop.
*   **Admin Panel Version Display:** Added a footer in the admin panel showing a simulated version number and last update date.
*   **Granular Admin Access Control (Refined):**
    *   Ensured navigation items in `AdminLayout.tsx` are strictly visible based on 'ADMIN' or 'MANAGER' roles (e.g., "User Management" and "Settings" for ADMIN only).
    *   Strengthened page-level access control for admin-only pages (`/admin/users`, `/admin/settings`) by adding explicit role checks within the page components and redirecting if access is denied.
    *   Verified "Add New Manager" functionality (simulated via `localStorage` in `AdminAuthContext`) for ADMIN users.
*   **Product Image Management Foundation:**
    *   Created `ImageUploadArea.tsx` component with drag-and-drop, preview, and main image selection (simulated, uses Data URLs).
    *   Integrated into `/admin/products/new/page.tsx` and `/admin/products/edit/[id]/page.tsx`.
*   **Forced Login/Registration for Checkout:** Implemented redirect to login if an unauthenticated user tries to checkout.
*   **Prices in UZS:** Updated mock data and display components to show prices in UZS.
*   **Dynamic Filters:** Product filters for Scent and Material are now dynamically generated from `mockProducts`.
*   **Full Site Internationalization (i18n) - UZ (default), RU, EN (Main Site):**
    *   Implemented path-based i18n (`/[locale]/...`).
    *   Created dictionary files (`src/dictionaries/*.json`) and `getDictionary.ts`.
    *   Moved all main site pages into `src/app/[locale]/...` structure.
    *   Adapted pages to use dictionaries (client-side pages use local dictionary getters importing main JSONs; server-side uses `getDictionary`).
    *   Updated `Header.tsx` with a functional language switcher (desktop dropdown, horizontal list for mobile).
    *   Updated `middleware.ts` for locale handling.
    *   Localized most static text on key e-commerce flow pages (Product Detail, Cart, Checkout) and Account section pages.

## 3. Next Steps (Immediate for Me)
1.  **Implement Product Images in Admin List:** Modify `src/app/admin/products/page.tsx` to display the first image of each product.
2.  **Implement Clients Section UI:**
    *   Add `mockAdminClients` to `src/lib/mock-data.ts`.
    *   Update `src/app/admin/clients/page.tsx` to display these clients in a table with search and placeholder actions.
3.  **Implement Simulated Logging:**
    *   Create `src/admin/lib/admin-logger.ts`.
    *   Integrate `logAdminAction` calls into `AdminAuthContext` (login/logout), `admin/products/page.tsx` (delete), `admin/users/new-manager/page.tsx` (add manager).
    *   Update `src/app/admin/logs/page.tsx` to display logs and allow clearing.
4.  **Enhance Admin Dashboard:** Add "Recent Activity" section using the logger.
5.  **Update all Memory Bank files** to reflect these changes.
6.  Present changes to the user.

## 4. Active Decisions & Considerations
*   **Admin Panel Access:** `/admin` path. Client-side simulated authentication (`AdminAuthContext`) with 'ADMIN' and 'MANAGER' roles. Admins can "add" new managers (simulated via `localStorage`).
*   **Data Management (Admin):** Currently client-side simulated for products, manager creation, client display, and logs. Future: Prisma/PostgreSQL.
*   **Admin Panel i18n & Theme:** Basic setup for EN/RU i18n (client-side preference) and Dark/Light theme toggle implemented in `AdminLayout.tsx`.
*   **Brand Name:** "Askim candles".
*   **Main Site i18n:** Path-based (UZ/RU/EN).
*   **Backend Plan:** Prisma/PostgreSQL, documented in `deployment_guide.md`.
*   **Focus on MVP:** Features are being built iteratively, prioritizing UI and simulated functionality first, with backend integration as a subsequent major phase.
*   **Granular per-manager/per-block permissions:** A future consideration dependent on backend.
*   **Admin Logs:** Will be client-side (`localStorage`) and capped for now. Real logging requires backend.
*   **Client Management:** Will use new `mockAdminClients` for UI display simulation.

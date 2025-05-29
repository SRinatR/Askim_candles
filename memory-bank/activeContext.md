
# Active Context: Askim candles

## Date: 2024-07-30 (Simulated Date of Update)

## 1. Current Focus
*   **Refining Admin Panel Access Control:**
    *   Ensuring navigation items in `AdminLayout.tsx` are strictly visible based on 'ADMIN' or 'MANAGER' roles (e.g., "User Management" and "Settings" for ADMIN only).
    *   Strengthening page-level access control for admin-only pages (`/admin/users`, `/admin/settings`) by adding explicit role checks within the page components and redirecting if access is denied.
    *   Verifying the "Add New Manager" functionality (simulated via `localStorage` in `AdminAuthContext`) for ADMIN users.
*   **Preparing for Product Image Management Enhancements:** User has requested improved image handling in admin product forms (drag-and-drop, main image selection). This will be the next major UI feature for the admin panel.

## 2. Recent Changes (Leading to this state)
*   **Main Site Internationalization (i18n) - UZ (default), RU, EN:**
    *   Implemented path-based i18n (`/[locale]/...`).
    *   Created dictionary files (`src/dictionaries/*.json`) and `getDictionary.ts`.
    *   Moved main site pages (`HomePage`, `About`, `Cart`, `Checkout`, `Login`, `Register`, `Account` section, `ProductDetail`, `ProductList`) into `src/app/[locale]/...` structure.
    *   Adapted pages to use dictionaries (client-side pages use local dictionary getters importing main JSONs; server-side uses `getDictionary`).
    *   Updated `Header.tsx` with a functional language switcher (dropdown for desktop, horizontal list for mobile).
    *   Updated `middleware.ts` for locale handling.
    *   Localized links and navigation elements on most main site pages.
    *   Addressed various i18n-related bugs (`cn is not defined`, `currentPathWithoutLocale` issues, hydration errors).
*   **Admin Panel Foundation & UI Enhancements:**
    *   Separate login page (`/admin/login`) with client-side simulated auth for 'ADMIN' and 'MANAGER' roles (`AdminAuthContext`, `localStorage`).
    *   Admin layout (`/admin/layout.tsx`) with route protection, collapsible sidebar, role-based navigation (refined), role display, and logout functionality.
    *   Product management section (`/admin/products`, `/new`, `/edit/[id]`) with UI for listing products (mock data), and forms for product CRUD (client-side simulated actions, basic text inputs for data).
    *   User management section (`/admin/users`, `/new-manager`) for Admins with UI for listing managers (predefined + localStorage) and form for adding new managers (client-side simulated via localStorage).
    *   Placeholder pages for other admin sections (Dashboard, Sales, Clients, Marketing, Reports, Finances, Discounts, Content, Settings, Logs).
    *   Main site header/footer are now correctly hidden on admin pages.
    *   Admin panel global styles applied via `globals.css` import in `AdminLayout.tsx`.
    *   Resolved issues with admin logout button visibility/usability and general admin panel styling.
*   **Branding Update:** Changed "ScentSational Showcase" to "Askim candles" in `Logo.tsx` and key dictionary files.
*   **Memory Bank:**
    *   All files updated to reflect current project state.
    *   `deployment_guide.md` created.

## 3. Next Steps (Immediate for Me)
1.  **Implement Granular Role Checks:**
    *   Review `AdminLayout.tsx` to ensure navigation reflects strict ADMIN/MANAGER access.
    *   Add checks in `users/page.tsx` and `settings/page.tsx` to prevent non-ADMIN access.
2.  **Verify Manager Creation/Login:** Test the flow of an ADMIN adding a manager and that manager subsequently logging in.
3.  **Implement Admin Product Image Management:**
    *   Create `ImageUploadArea.tsx` reusable component.
    *   Integrate into `admin/products/new/page.tsx`.
    *   Integrate into `admin/products/edit/[id]/page.tsx`.
4.  **Update all Memory Bank files** to reflect these changes.
5.  Present changes to the user.

## 4. Active Decisions & Considerations
*   **Admin Panel Access:** `/admin` path. Client-side simulated authentication (`AdminAuthContext`) with 'ADMIN' and 'MANAGER' roles. Admins can "add" new managers (simulated via `localStorage`).
*   **Data Management (Admin):** Currently client-side simulated for products and manager creation. Future: Prisma/PostgreSQL.
*   **Admin Panel i18n & Theme:** Basic setup for EN/RU i18n (client-side preference) and Dark/Light theme toggle is planned next for `AdminLayout.tsx` after current access control refinements.
*   **Brand Name:** "Askim candles".
*   **Main Site i18n:** Path-based (UZ/RU/EN).
*   **Backend Plan:** Prisma/PostgreSQL, documented in `deployment_guide.md`.
*   **Focus on MVP:** Features are being built iteratively, prioritizing UI and simulated functionality first, with backend integration as a subsequent major phase. Granular per-manager/per-block permissions are a future consideration dependent on backend.

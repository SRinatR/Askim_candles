
# Active Context: Askim candles

## Date: 2024-08-01 (Simulated Date of Update)

## 1. Current Focus

*   **Admin Panel Enhancements & Branding:**
    *   Implementing brand name change to "Askim candles" across the application and documentation.
    *   Making the main site's mobile menu language switcher more compact.
    *   Setting up the Admin Panel for internationalization (i18n) with English (default) and Russian, using client-side language preference for now.
    *   Implementing a dark/light theme toggle for the Admin Panel.
*   **Internationalization (i18n) Refinements:** Continuing to ensure all pages and components correctly handle locale-based routing and content rendering.

## 2. Recent Changes (Leading to this state)

*   **Brand Name Update:** Changed "ScentSational Showcase" to "Askim candles" in `Logo.tsx` and main site dictionary files.
*   **Main Site Mobile Language Switcher:** Adjusted styling in `Header.tsx` for a more compact appearance.
*   **Admin Panel i18n Setup:**
    *   Created admin-specific dictionary files (`src/admin/dictionaries/en.json`, `src/admin/dictionaries/ru.json`) with initial translations.
    *   Created admin-specific i18n config (`src/admin/lib/i18n-config-admin.ts`) and dictionary getter (`src/admin/lib/getAdminDictionary.ts`).
    *   Updated `AdminLayout.tsx` to manage client-side language preference (EN/RU via `localStorage`) and load appropriate admin dictionaries. Added a language switcher UI.
*   **Admin Panel Dark Theme:**
    *   Updated `AdminLayout.tsx` to manage dark/light theme preference (via `localStorage`), toggle the `dark` class on the `<html>` element, and include a theme toggle button.
*   **Previous i18n Work (Main Site):**
    *   Implemented path-based i18n (`/[locale]/...`) for UZ (default), RU, EN.
    *   Created main site dictionary files and `getDictionary.ts`.
    *   Adapted key pages and components (Homepage, Product List/Card, Account section, About, Cart, Checkout, Login, Register) to use the i18n structure and localized dictionaries.
    *   Updated middleware for locale handling.
    *   Fixed various i18n-related bugs (e.g., `cn is not defined`, `currentPathWithoutLocale` issues, hydration errors).
*   **Admin Panel Foundation:**
    *   Created a separate login page for admin (`/admin/login`) with simulated auth for 'ADMIN' and 'MANAGER' roles (`AdminAuthContext`, `localStorage`).
    *   Implemented an admin layout (`/admin/layout.tsx`) with:
        *   Route protection based on simulated admin/manager login.
        *   Collapsible sidebar navigation.
        *   Role-based conditional rendering of navigation links.
        *   Display of current admin user's role.
        *   Logout functionality.
    *   Created placeholder pages for Dashboard, Products, Sales, Clients, Marketing, Reports, Finances, Discounts, Content, Settings, Management (Users).
    *   Updated Admin Dashboard (`/admin/dashboard/page.tsx`) with UI stubs for various statistics.
    *   Updated Admin navigation menu.
*   **UI & Bug Fixes (General):**
    *   Corrected main site header/footer appearing on admin pages.
    *   Fixed icon and trigger import errors in `admin/layout.tsx`.
    *   Addressed accessibility warning for `DialogContent` (used by `Sheet`).
    *   Resolved duplicate close icons in mobile sheet menu.

## 3. Next Steps (Immediate for Me)

1.  **Complete Memory Bank Update:** Finish generating these updated Memory Bank files and present them to the user.
2.  **Await User Direction:** After this update, await user's next request. This might involve:
    *   Continuing to localize remaining main site components/text.
    *   Beginning to flesh out specific admin panel sections with (mock) data and forms.
    *   Addressing Zod validation message localization.
    *   Preparing for Prisma/PostgreSQL integration.

## 4. Active Decisions & Considerations

*   **Brand Name:** "Askim candles".
*   **Admin Panel i18n:** EN (default), RU. Client-side preference management via `localStorage` for now. Full path-based i18n for admin (`/admin/[locale]/...`) is a future consideration.
*   **Admin Panel Theme:** Dark/Light toggle implemented, preference stored in `localStorage`.
*   **Main Site i18n:** Path-based (`/[locale]/...`) for UZ (default), RU, EN.
*   **Authentication:**
    *   Main Site: Hybrid (NextAuth for Google, simulated email/password `AuthContext`).
    *   Admin Panel: Simulated email/password `AdminAuthContext`.
*   **Data Source:** Still primarily mock data (`mock-data.ts`) and `localStorage` simulations. Prisma/PostgreSQL integration is planned.
*   **Progressive Development:** Continue building features section by section, especially for the admin panel.


# Active Context: Askim candles

## Date: 2024-08-01 (Simulated Date of Update)

## 1. Current Focus

*   **Admin Panel - Core Feature Implementation (Simulated):**
    *   **Product Management:** Implementing UI for listing products from `mock-data.ts`, and forms for adding/editing products. All operations are client-side simulations for now, with toasts for feedback.
    *   **Manager Management (Admin Role):** Implementing UI for Admins to "add" new managers. New manager data will be simulated by storing in `localStorage`. `AdminAuthContext` will be updated to check this `localStorage` in addition to its predefined users.
    *   **Logs & Sessions Pages:** Creating placeholder pages for "Logs" and "Sessions" within the admin panel, acknowledging they will require backend integration for real functionality.
*   **Documentation:**
    *   Creating a `deployment_guide.md` in the Memory Bank to outline future steps for production deployment and transitioning from simulations to a real backend (Prisma/PostgreSQL).
    *   Updating all Memory Bank files to reflect these new developments.

## 2. Recent Changes (Leading to this state)

*   **Brand Name Update:** Changed "ScentSational Showcase" to "Askim candles" in `Logo.tsx` and main site dictionary files.
*   **Main Site Mobile Language Switcher:** Adjusted styling in `Header.tsx` for a more compact, horizontal appearance.
*   **Admin Panel i18n Setup (EN/RU):**
    *   Created admin-specific dictionary files and configuration.
    *   `AdminLayout.tsx` updated for client-side language preference management (EN/RU via `localStorage`) and loading admin dictionaries. Language switcher UI added.
*   **Admin Panel Dark Theme:**
    *   `AdminLayout.tsx` updated to manage dark/light theme preference (via `localStorage`), toggle `dark` class on `<html>`, and include a theme toggle button.
*   **Main Site i18n (UZ/RU/EN):**
    *   Implemented path-based i18n (`/[locale]/...`).
    *   Localized key pages (Homepage, About, Cart, Checkout, Login, Register, Account section, Product Detail/List/Card).
    *   Functional language switcher in Header.
    *   Corrected various i18n-related bugs (e.g., `cn is not defined`, `currentPathWithoutLocale` issues, hydration errors).
*   **Admin Panel Foundation:**
    *   Separate login page (`/admin/login`) with simulated auth for 'ADMIN' and 'MANAGER' roles (`AdminAuthContext`, `localStorage`).
    *   Admin layout (`/admin/layout.tsx`) with route protection, collapsible sidebar, role-based navigation, role display, theme/language toggles, and logout.
    *   Placeholder pages for Dashboard, Products, Sales, Clients, Marketing, Reports, Finances, Discounts, Content, Settings, Management (Users).
*   **UI & Bug Fixes (General):**
    *   Corrected main site header/footer appearing on admin pages.
    *   Fixed icon and trigger import errors in `admin/layout.tsx`.
    *   Addressed accessibility warning for `DialogContent` (used by `Sheet`).
    *   Resolved duplicate close icons in mobile sheet menu.
    *   Fixed `ProductCard` dictionary prop issues.

## 3. Next Steps (Immediate for Me)

1.  **Implement Product Management UI (Simulated):**
    *   Create table view for products on `/admin/products`.
    *   Create forms for `/admin/products/new` and `/admin/products/edit/[id]`.
    *   Simulate Add/Edit/Delete actions with toasts.
2.  **Implement Manager Addition UI (Simulated):**
    *   Update `/admin/users` page to list managers.
    *   Create form for `/admin/users/new-manager`.
    *   Update `AdminAuthContext` to handle dynamically "added" managers via `localStorage`.
3.  **Create Placeholder Admin Pages:** "Logs".
4.  **Update Admin Navigation:** Add "Logs".
5.  **Generate `memory-bank/deployment_guide.md`**.
6.  **Update all other Memory Bank files.**
7.  Present changes to the user.

## 4. Active Decisions & Considerations

*   **Admin Panel - Current Focus:** Product Management UI, Manager Addition UI (both simulated).
*   **Admin Panel Auth:** Using `AdminAuthContext` with client-side `localStorage` simulation for ADMIN/MANAGER roles. New managers "added" by Admin will also be stored in `localStorage`.
*   **Data Source (Admin):** Product data from `mock-data.ts` for display. CRUD operations simulated on client.
*   **Future Backend:** Explicitly planning for Prisma/PostgreSQL. `deployment_guide.md` will document transition.
*   **Logs/Sessions:** Placeholder pages for now. Real implementation requires backend.
*   **Brand Name:** "Askim candles".
*   **Admin Panel i18n:** EN (default), RU. Client-side preference.
*   **Admin Panel Theme:** Dark/Light toggle implemented.
*   **Main Site i18n:** Path-based (UZ/RU/EN).


# Active Context: Askim candles

## Date: 2024-08-01 (Simulated Date of Update)

## 1. Current Focus

*   **Admin Panel - Product Image Management (Simulated):**
    *   Implementing a new reusable component `ImageUploadArea.tsx` for drag-and-drop image uploads, multiple image previews, main image selection, and image removal.
    *   Integrating `ImageUploadArea.tsx` into:
        *   `src/app/admin/products/new/page.tsx`: Replacing the old image URL input.
        *   `src/app/admin/products/edit/[id]/page.tsx`: Displaying existing image URLs and allowing replacement via the new upload component.
    *   Updating Zod schemas and form handling logic in both product forms to accommodate an array of image Data URLs and a main image identifier.
    *   All "uploads" are client-side simulations (Data URLs in state), not actual server uploads.

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
    *   Product management section (`/admin/products`, `/new`, `/edit/[id]`) with UI for listing products (mock data), and forms for product CRUD (client-side simulated actions, basic text inputs for data).
    *   User management section (`/admin/users`, `/new-manager`) for Admins with UI for listing managers (predefined + localStorage) and form for adding new managers (client-side simulated via localStorage).
    *   Placeholder page for "Logs" (`/admin/logs`).
    *   Other admin sections (Sales, Clients, Marketing, etc.) are mostly stubs.
*   **Documentation:**
    *   Created a `deployment_guide.md` in the Memory Bank.
    *   Updated all Memory Bank files to reflect current project state.

## 3. Next Steps (Immediate for Me)

1.  **Implement `ImageUploadArea.tsx`** with drag & drop, previews, main image selection, and removal.
2.  **Integrate `ImageUploadArea` into `admin/products/new/page.tsx`**. Update schema and form logic.
3.  **Integrate `ImageUploadArea` into `admin/products/edit/[id]/page.tsx`**. Update schema, form logic, and handle display of existing image URLs alongside the new upload component.
4.  Test product image management thoroughly.
5.  Update all Memory Bank files.
6.  Present changes to the user.

## 4. Active Decisions & Considerations

*   **Admin Panel - Image Uploads:** Client-side simulation using Data URLs. No actual backend storage.
*   **Edit Product Images:** Existing images (URLs) will be displayed. New uploads via `ImageUploadArea` will replace the image list for the product in the form's state.
*   **Brand Name:** "Askim candles".
*   **Admin Panel i18n:** EN (default), RU. Client-side preference.
*   **Admin Panel Theme:** Dark/Light toggle implemented.
*   **Main Site i18n:** Path-based (UZ/RU/EN).
*   **Backend Plan:** Prisma/PostgreSQL, documented in `deployment_guide.md`.

```

# Active Context: Askim candles

## Date: 2024-07-29 (Simulated Date of Update)

## 1. Current Focus
*   **Product Deactivation Feature:** Implement `isActive` flag for products.
    *   Update `Product` type and mock data.
    *   Admin Panel: Add UI to product list (status badge, toggle switch) and forms (switch) to manage `isActive` status.
    *   Main Site: Filter product listings (Homepage, Products page) to show only `isActive: true` products. Product Detail page will still show inactive products if accessed directly.
*   **SKU & Product ID Logic:**
    *   Add `sku` to `Product` type and mock data.
    *   Admin Panel: Display ID and SKU in product list. Add SKU input to forms. Display ID as read-only on edit form.
    *   Main Site: Optionally display SKU on product detail page.
*   **Memory Bank Update**: Ensure all changes are reflected.

## 2. Recent Changes (Leading to this state)
*   **Password Visibility Toggles & Enhanced Toast Feedback:** Implemented for all relevant login/registration forms in main site and admin panel. Toast messages from contexts made clearer.
*   **Re-verification of Core Features (DONE):**
    *   Product Filters & Sorting (Main Site): Dynamic price range calculation, correct filter application, and all sorting options function as expected with `PRICE_DIVISOR`.
    *   Admin Product Attributes: `Product` type, mock data, Zod schemas, admin product forms, and product detail page display correctly reflect the extended attributes (Scent, Material, Dimensions, Burning Time).

## 3. Next Steps (Immediate for Me - based on user's latest request)
1.  **Implement Product Deactivation Feature:**
    *   Update `/src/lib/types.ts` with `isActive` in `Product`.
    *   Update `/src/lib/mock-data.ts` to include `isActive` for products.
    *   Update `/src/app/admin/products/page.tsx` to display status and add toggle.
    *   Update `/src/app/admin/products/new/page.tsx` & `/src/app/admin/products/edit/[id]/page.tsx` to include `isActive` switch in forms and Zod schema.
    *   Update `/src/app/[locale]/page.tsx` (HomePage) to filter for active products.
    *   Update `/src/app/[locale]/products/page.tsx` (ProductsPage) to filter for active products in main list and for dynamic filter generation.
2.  **Implement SKU & Product ID Logic:**
    *   Update `/src/lib/types.ts` with `sku` in `Product`.
    *   Update `/src/lib/mock-data.ts` with `sku` for products.
    *   Update `/src/app/admin/products/page.tsx` to display ID and SKU.
    *   Update `/src/app/admin/products/new/page.tsx` & `/src/app/admin/products/edit/[id]/page.tsx` to include SKU field in forms/schema and display ID (read-only on edit).
    *   Update `/src/app/[locale]/products/[id]/page.tsx` to optionally display SKU (add to dictionaries).
3.  **Update Memory Bank:** Reflect these changes.

## 4. Active Decisions & Considerations
*   **Admin Panel Access:** `/admin` path. Client-side simulated authentication (`AdminAuthContext`) with 'ADMIN' and 'MANAGER' roles. Admins can "add" new managers (simulated via `localStorage`).
*   **Data Management (Admin):** Currently client-side simulated for products (CRUD UI exists, data updates local state or logs to console, not persistent in `mock-data.ts` on refresh), manager creation, client display, and logs. Future: Prisma/PostgreSQL.
*   **Admin Panel i18n & Theme:** Basic setup for EN/RU i18n (client-side preference) and Dark/Light theme toggle implemented in `AdminLayout.tsx`.
*   **Brand Name:** "Askim candles".
*   **Main Site i18n:** Path-based (UZ/RU/EN). Key e-commerce flow pages are localized.
*   **Backend Plan:** Prisma/PostgreSQL, documented in `deployment_guide.md`.
*   **Focus on MVP:** Features are being built iteratively, prioritizing UI and simulated functionality first, with backend integration as a subsequent major phase.
*   **Product Deactivation:** Inactive products will be filtered from main site listings. Direct URL access to an inactive product's detail page will still render the page.
*   **SKU:** Will be an optional text input in admin forms for now. Product ID will be displayed as read-only.

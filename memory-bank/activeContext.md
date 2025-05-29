
# Active Context: Askim candles

## Date: 2024-07-29 (Simulated Date of Update)

## 1. Current Focus
*   **Password Visibility Toggles:** Implementing "eye" icons for password fields in login, registration, and admin forms.
*   **Enhanced Feedback:** Improving toast message clarity for login/registration errors in `AuthContext` and `AdminAuthContext`.
*   **Re-verification of Core Features:**
    *   **Product Filters & Sorting (Main Site):** Ensuring dynamic price range calculation, correct filter application, and all sorting options function as expected.
    *   **Admin Product Attributes:** Verifying that the `Product` type, mock data, Zod schemas, admin product forms, and product detail page display correctly reflect the extended attributes (Scent, Material, Dimensions, Burning Time).
*   **General Stability Check:** Reviewing recent changes to avoid new errors.

## 2. Recent Changes (Leading to this state)
*   **Dynamic Price Range Filter (Main Site):** `ProductFilters.tsx` updated to calculate min/max price from `allProducts`. Price input handling and slider commit logic refined.
*   **Sorting Functionality (Main Site):** Verified sorting logic in `products/page.tsx`, especially for "newest" and price sorting with `PRICE_DIVISOR`.
*   **Admin Product Attribute Expansion:**
    *   `Product` type in `types.ts` updated.
    *   `mock-data.ts` updated with new attributes and UZS-scaled prices. Order numbers prefixed with "ASKM-".
    *   Zod schema and forms in `/admin/products/new` and `/admin/products/edit/[id]` updated to include Scent, Material, Dimensions, Burning Time.
    *   Product Detail page (`/app/[locale]/products/[id]`) updated to display these new attributes with icons.
*   **Memory Bank Update:** All Memory Bank files updated to reflect the above.

## 3. Next Steps (Immediate for Me - based on user's latest request)
1.  **Implement Password Visibility Toggles:**
    *   Add to `src/app/[locale]/login/page.tsx`.
    *   Add to `src/app/[locale]/register/page.tsx`.
    *   Add to `src/app/admin/login/page.tsx`.
    *   Add to `src/app/admin/users/new-manager/page.tsx`.
2.  **Enhance Login/Registration Toast Feedback:**
    *   Update `AuthContext.tsx` for clearer toast messages.
    *   Update `AdminAuthContext.tsx` for clearer toast messages.
3.  **Re-verify Filters, Sorting, and Admin Product Attributes:**
    *   Systematically check functionality of filters and sorting on the main site.
    *   Systematically check admin product forms and product detail page display.
4.  **Update Memory Bank:** Reflect these changes and verifications.

## 4. Active Decisions & Considerations
*   **Admin Panel Access:** `/admin` path. Client-side simulated authentication (`AdminAuthContext`) with 'ADMIN' and 'MANAGER' roles. Admins can "add" new managers (simulated via `localStorage`).
*   **Data Management (Admin):** Currently client-side simulated for products (CRUD UI exists, data updates local state or logs to console, not persistent in `mock-data.ts` on refresh), manager creation, client display, and logs. Future: Prisma/PostgreSQL.
*   **Admin Panel i18n & Theme:** Basic setup for EN/RU i18n (client-side preference) and Dark/Light theme toggle implemented in `AdminLayout.tsx`.
*   **Brand Name:** "Askim candles".
*   **Main Site i18n:** Path-based (UZ/RU/EN). Key e-commerce flow pages are localized.
*   **Backend Plan:** Prisma/PostgreSQL, documented in `deployment_guide.md`.
*   **Focus on MVP:** Features are being built iteratively, prioritizing UI and simulated functionality first, with backend integration as a subsequent major phase.
*   **Granular per-manager/per-block permissions:** A future consideration dependent on backend.
*   **Admin Logs:** Client-side (`localStorage`) and capped. Real logging requires backend.
*   **Client Management:** Uses `mockAdminClients` for UI display simulation.
*   **Product Attribute Management (Admin):** Specified fields (scent, material, etc.) are text inputs. Image upload uses `ImageUploadArea.tsx` (Data URL based).
*   **Price Representation:** Prices in `mock-data.ts` are integers. Filter logic and display on frontend use `toLocaleString` with "UZS".
*   **Password Visibility:** Will use `Eye`/`EyeOff` icons.
*   **Modal Windows for Errors:** User requested more modals. For now, focusing on clearer toasts for login/registration errors from contexts to maintain simplicity. Modals might be considered for more critical actions later.

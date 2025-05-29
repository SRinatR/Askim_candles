
# Active Context: Askim candles

## Date: 2024-07-30 (Simulated Date of Update)

## 1. Current Focus
*   **Finalize Product Filters & "Last Updated" Date:**
    *   Ensure product filters (`ProductFilters.tsx`, `ProductsPage.tsx`) are robust, especially dynamic price range from active products and handling of empty filter results.
    *   Adjust main site footer (`Footer.tsx`) to only show version number to regular users. "Last Updated" date will be removed from public footer. Admin footer will keep its simulated date.
*   **Implement Multilingual Product Name & Description:**
    *   Update `Product` type for `name` and `description` to support UZ/RU/EN.
    *   Update mock data.
    *   Update admin product forms (`new`, `edit`) with inputs for each language.
    *   Update main site components (`ProductCard`, `ProductDetailPage`, cart/checkout summaries, order history) to display localized names/descriptions.
    *   Update admin product list to show name in admin's current language.

## 2. Recent Changes (Leading to this state)
*   **Admin Attributes CRUD:** Implemented UI and `localStorage` logic for managing custom Categories, Materials, and Scents. Product forms updated to use `Select` inputs for these.
*   **Version Display in Main Footer:** Added simulated version and "Last Updated" date to the main site footer (this will be revised).
*   **Dropdown Fix in Admin Layout:** Corrected `DropdownMenu` usage for sidebar items with sub-menus.

## 3. Next Steps (Immediate for Me - based on user's latest request)
1.  **Refine Product Filters:**
    *   Verify dynamic price range calculation in `ProductFilters.tsx` based on *active* products.
    *   Handle edge cases like empty product lists for filter generation.
2.  **Adjust "Last Updated" Date Display:**
    *   Modify `src/components/layout/Footer.tsx` to remove "Last Updated" for regular users.
3.  **Implement Multilingual Product Data:**
    *   Update `src/lib/types.ts` (`Product` interface).
    *   Update `src/lib/mock-data.ts` with multilingual names/descriptions.
    *   Modify admin forms: `src/app/admin/products/new/page.tsx`, `src/app/admin/products/edit/[id]/page.tsx`.
    *   Modify display components: `src/components/products/ProductCard.tsx`, `src/app/[locale]/products/[id]/page.tsx`, `src/app/[locale]/cart/page.tsx`, `src/app/[locale]/checkout/page.tsx`, `src/app/[locale]/account/orders/page.tsx`, `src/app/[locale]/account/orders/[id]/page.tsx`.
    *   Modify admin product list: `src/app/admin/products/page.tsx`.
4.  **Update Memory Bank:** Reflect all these changes.

## 4. Active Decisions & Considerations
*   **Admin "Last Updated" Date:** The admin panel footer will continue to show its own simulated "Last Updated" date (current render date). The request to make this editable by admin for display in the admin footer will be a future consideration if needed.
*   **Multilingual Product Input:** For `name` and `description`, admin forms will have separate inputs for UZ, RU, EN.
*   **Selectable Attributes (Category, Scent, Material):** These will remain single-value fields on the product model. Their *labels* in the admin `Select` components will be translated based on the admin's current language, but the stored value will be a consistent key (e.g., English name or a slug).
*   **Filter Robustness:** Ensure filters don't break if no products match or if price ranges are unusual.

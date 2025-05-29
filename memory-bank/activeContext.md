
# Active Context: Askim candles

## Date: 2024-07-29 (Simulated Date of Update)

## 1. Current Focus
*   **Update Product Categories:** Implement new category list: Корпоративные наборы, Свадебные комплименты, Аромасвечи, Вкусный дом, Гипсовый рай.
*   **Add "Полезное" (Useful Info) Header Section:** Create dropdown in header with links to placeholder info pages (Soy Wax, Aroma Sachet).
*   **Reflect Corporate Client Focus:** Note this in documentation. "Корпоративные наборы" category is the main code manifestation.

## 2. Recent Changes (Leading to this state)
*   **Admin Panel Placeholders & Log Enhancements:**
    *   Sales, Marketing, Reports pages in admin updated with more structured placeholders.
    *   Logs section (`/admin/logs`) now has client-side filtering (by user email, action text) and sorting (by timestamp, email, action).
*   **Corporate Color Palette Applied:** Updated `src/app/globals.css` with new HSL theme variables for both light and dark modes.
*   **Product Deactivation & SKU/ID:** Implemented `isActive` flag for products, SKU field. Admin panel UI updated for these. Main site filters active products.
*   **Password Visibility Toggles & Enhanced Toast Feedback:** Implemented for all relevant login/registration forms.

## 3. Next Steps (Immediate for Me - based on user's latest request)
1.  **Update Product Categories:**
    *   Modify `/src/lib/mock-data.ts` (`mockCategories` and `mockProducts` category fields).
    *   Update `/src/dictionaries/*.json` category translations.
    *   Verify display on `/src/app/[locale]/page.tsx` and `/src/components/products/ProductFilters.tsx`.
2.  **Add "Полезное" Header Section:**
    *   Add "Полезное" and article titles to `/src/dictionaries/*.json` (`navigation` and new page sections).
    *   Modify `/src/components/layout/Header.tsx` to add the dropdown menu and links.
    *   Create placeholder pages: `/src/app/[locale]/info/soy-wax/page.tsx` and `/src/app/[locale]/info/aroma-sachet/page.tsx` with basic structure and dictionary use.
3.  **Update Memory Bank:** Reflect these new features and the corporate client focus.

## 4. Active Decisions & Considerations
*   **"Вкусный дом" Category Translation:** For English, will use "Home Fragrances" (slug: `home-fragrances`). RU/UZ will use their native names.
*   **Admin Panel Styling:** New corporate color palette applies. Usability remains key.
*   **Client-Side Operations (Admin):** Log filtering/sorting is client-side. Product/manager changes are simulated.
*   **Full i18n:** Ongoing for main site. Admin panel has basic EN/RU setup.
*   **Backend Plan:** Prisma/PostgreSQL integration is documented, currently client-side data. Corporate client focus might imply future B2B features.
*   **Info Pages:** Will be simple static content pages for now.


    
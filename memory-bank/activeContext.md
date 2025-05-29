
# Active Context: Askim candles

## Date: 2024-07-29 (Simulated Date of Update)

## 1. Current Focus
*   **Admin Panel - CRUD for Product Attributes (Categories, Materials, Scents):** Implement UI and client-side logic (localStorage) for managing these attributes. Update product forms to use `Select` inputs populated with these attributes.
*   **Version/Date Display in Main Site Footer:** Add simulated version and last update date to the main site's footer.

## 2. Recent Changes (Leading to this state)
*   **Category & Header "Полезное" Update:** Product categories updated as per user request. "Полезное" section in header now links to a new `/info` page listing articles. Homepage category display improved.
*   **Corporate Color Palette Applied:** Updated `src/app/globals.css` for the entire application.
*   **Admin Panel Log Filtering & Sorting:** Implemented client-side filtering and sorting for logs.
*   **Admin Panel Placeholders & Log Enhancements:** Sales, Marketing, Reports pages in admin updated. Logs section enhanced.

## 3. Next Steps (Immediate for Me - based on user's latest request)
1.  **Implement Version Display in Main Site Footer:**
    *   Modify `src/components/layout/Footer.tsx`.
2.  **Implement Admin CRUD for Product Attributes (Categories, Materials, Scents):**
    *   Create pages: `/admin/attributes/categories/page.tsx`, `/admin/attributes/materials/page.tsx`, `/admin/attributes/scents/page.tsx`.
    *   Implement UI for adding/listing/deleting (custom) attributes, using `localStorage`.
    *   Update admin navigation in `/admin/layout.tsx`.
    *   Update admin dictionaries for new labels.
    *   Modify product forms (`/admin/products/new`, `/admin/products/edit/[id]`) to use `Select` components for Category, Material, Scent, populated from `mock-data` and `localStorage`.
3.  **Update Memory Bank:** Reflect these new features.

## 4. Active Decisions & Considerations
*   **Attribute Management Scope:** "Dimensions" and "Burning Time" remain free-text inputs in product forms. Management as selectable lists is for Category, Material, and Scent.
*   **Data Storage for Attributes:** Custom attributes created in admin will be stored in `localStorage` for simulation.
*   **Admin Panel i18n & Theme:** Corporate color palette applies. Basic EN/RU i18n setup for admin.
*   **Main Site i18n:** Path-based (UZ/RU/EN). Corporate client focus noted.
*   **Backend Plan:** Prisma/PostgreSQL, documented in `deployment_guide.md`.


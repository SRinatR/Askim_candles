
# Active Context: Askim candles

## Date: 2024-07-30 (Simulated Date of Update)

## 1. Current Focus
*   **Finalize Article Management (Phase 2 - Images):**
    *   Update `Article` type for image fields (`sharedMainImage`, `mainImage_en/ru/uz`, `useSharedImage`).
    *   Update admin article form to include image upload areas (using `ImageUploadArea`):
        *   A `Switch` to choose between a shared image or per-language images.
        *   Conditional display of single shared image uploader or per-language image uploaders.
    *   Update main site article display page (`/[locale]/info/[slug]/page.tsx`) to show the correct image based on `useSharedImage` and current locale.
    *   Update mock article seeding in admin to include initial image data.
*   **Review and Refine Memory Bank.**

## 2. Recent Changes (Leading to this state)
*   **Admin CRUD for Articles (Text Content):**
    *   Implemented admin section for managing articles (`/admin/articles`).
    *   Articles stored in `localStorage` (key: `askimAdminArticles`).
    *   Forms allow creating/editing articles with multilingual titles and content (EN/RU/UZ tabs).
    *   Slug auto-generation and `isActive` toggle.
*   **Main Site Article Display:**
    *   `/[locale]/info` page lists active articles.
    *   `/[locale]/info/[slug]` page dynamically displays article content with Tailwind `prose` styling.
    *   Old static article pages removed. Header link for "Useful Info" updated.
*   **Memory Bank Updated** (prior to this current request).

## 3. Next Steps (Immediate for Me - based on user's latest request)
1.  **Implement Article Image Management:**
    *   Update `src/lib/types.ts` for `Article` image fields.
    *   Modify `src/app/admin/articles/form/[id]/page.tsx`:
        *   Update Zod schema for new image fields.
        *   Add `Switch` for `useSharedImage`.
        *   Add conditional `ImageUploadArea` components for shared vs. per-language main images.
    *   Modify `src/app/admin/articles/page.tsx` to update article seeding with initial image data.
    *   Modify `src/app/[locale]/info/[slug]/page.tsx` to display the correct main image based on `useSharedImage` and locale.
    *   Modify `src/app/[locale]/info/page.tsx` to display article images on the listing page.
2.  **Update Memory Bank:** Reflect all these changes related to article image management.

## 4. Active Decisions & Considerations
*   **Article Images:** Will use `ImageUploadArea` (which handles Data URLs for now). `maxFiles={1}` for main image uploaders.
*   **Fallback Logic for Images:** If `useSharedImage` is false and a language-specific image is missing, a fallback to the English image or a generic placeholder will be implemented.
*   **Styling:** Main site article detail page (`prose` class) and article list page (`/info`) styling will be considered for image display.
*   **Simulated Backend:** All article and attribute data is still client-side (`localStorage`) for now.
*   **User's Next Priorities (from previous interaction):** After articles, potential focus could be on Sales, Clients, Marketing, Reports sections, or deeper log/session features if the backend was ready. For now, these are stubs or have basic simulated functionality.

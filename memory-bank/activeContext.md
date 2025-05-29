
# Active Context: Askim candles

## Date: 2024-07-29 (Simulated Date of Update)

## 1. Current Focus
*   **Apply New Corporate Color Palette:** Update `src/app/globals.css` with the new HSL theme variables derived from the provided hex codes (#F37E92, #FFD2DA, #162044, #B2C9ED) for both light and dark modes. This will affect the main site and the admin panel.
*   **Verify Theme Application:** Check how the new theme looks across the main site and admin panel, especially in terms of contrast and usability.

## 2. Recent Changes (Leading to this state)
*   **Product Deactivation & SKU/ID:** Implemented `isActive` flag for products, SKU field. Admin panel UI updated for these. Main site filters active products.
*   **Password Visibility Toggles & Enhanced Toast Feedback:** Implemented for all relevant login/registration forms.
*   **Re-verification of Core Features (DONE):**
    *   Product Filters & Sorting (Main Site): Dynamic price range calculation from active products, correct filter application, and all sorting options function as expected with `PRICE_DIVISOR`.
    *   Admin Product Attributes: `Product` type, mock data, Zod schemas, admin product forms, and product detail page display correctly reflect the extended attributes (Scent, Material, Dimensions, Burning Time).

## 3. Next Steps (Immediate for Me - based on user's latest request)
1.  **Update `src/app/globals.css`:**
    *   Convert new hex colors to HSL.
    *   Replace existing HSL values for `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--muted`, `--card`, `--popover`, `--border`, `--input`, `--ring` in both `:root` (light theme) and `.dark` sections.
    *   Remove unused `sidebar-*` CSS variables.
2.  **Update Memory Bank:** Reflect the new color palette in `techContext.md` and other relevant files.
3.  **Await User Feedback:** After theme application, user will likely provide feedback on specific areas or request further UI tweaks related to the new colors.

## 4. Active Decisions & Considerations
*   **Admin Panel Styling:** The new color palette will also apply to the admin panel. While the primary goal for admin is usability, the new theme will provide a consistent brand feel. Further specific tweaks for admin UI might be needed later if the new palette introduces usability issues there.
*   **Contrast Ratios:** When selecting foreground colors for the new primary, secondary, and accent backgrounds, ensuring good contrast (WCAG AA/AAA) is important.
*   **Full i18n:** Localization of all main site pages is nearly complete structurally. Content translation remains an ongoing task. Admin panel i18n (EN/RU) is set up.
*   **Backend Plan:** Prisma/PostgreSQL integration is planned and documented in `deployment_guide.md`. Current data management is client-side.


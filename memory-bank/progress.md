
# Progress: Askim candles

## Date: 2024-08-01 (Simulated Date of Update)

## 1. What Works (Implemented Features)

*   **Branding:** Updated to "Askim candles" in Logo and key dictionary entries.
*   **Core App Structure (Main Site):** Next.js App Router.
*   **Internationalization (i18n - Main Site):**
    *   Path-based routing `/[locale]/...` for UZ (default), RU, EN.
    *   Dictionary files (`src/dictionaries/*.json`) for translations.
    *   `getDictionary.ts` for loading translations in Server Components.
    *   Middleware (`middleware.ts`) for locale detection and redirection.
    *   Language switcher in Header (desktop dropdown, compact mobile list).
    *   Localized pages: Homepage, About, Cart, Checkout, Login, Register, Product Detail, Account section (Layout, Profile, Addresses, Orders, Order Detail, Linking). ProductCard and ProductList accept localized props.
*   **Styling:** Tailwind CSS, ShadCN UI. Custom theme in `globals.css` (includes dark mode variables).
*   **Main Site Pages (Localized):**
    *   Homepage (`/[locale]/`): Hero, category links, featured products, CTA.
    *   Product Listing (`/[locale]/products`): Displays products, client-side filtering/sorting (now locale-aware in URL updates), search.
    *   Product Details (`/[locale]/products/[id]`): Image gallery, details, add to cart, related products.
    *   Shopping Cart (`/[locale]/cart`): Displays items, quantity updates, removal, total, proceed to checkout.
    *   Checkout (`/[locale]/checkout`): Order summary, form for contact/shipping/mock payment.
    *   About Us (`/[locale]/about`): Static content page.
*   **Frontend User Authentication (Main Site - Hybrid & Localized):**
    *   **NextAuth.js with Google Provider:** Functional for Google sign-in/sign-out. Callbacks updated for locale.
    *   **Client-Simulated Email/Password (`AuthContext`):**
        *   Multi-step registration (`/[locale]/register`) with simulated confirmation.
        *   Login page (`/[locale]/login`) with email/password form.
        *   Logout functionality.
        *   All redirects and links are locale-aware.
    *   Placeholders for Telegram & Yandex social login buttons on login page.
*   **Frontend User Account Area (`/[locale]/account/*` - Main Site - Localized):**
    *   Protected: Requires login.
    *   Layout with sidebar navigation.
    *   All sub-pages (Profile, Addresses, Order History, Order Detail, Linking) are localized.
*   **Admin Panel Foundation (`/admin`):**
    *   **Simulated Authentication (`AdminAuthContext`):**
        *   Login page (`/admin/login`) for 'ADMIN' and 'MANAGER' roles.
        *   Logout functionality.
    *   **Protected Routes:** All routes under `/admin` require admin/manager login.
    *   **Admin Layout (`src/app/admin/layout.tsx`):**
        *   Collapsible sidebar navigation.
        *   Header with sidebar toggle (desktop), mobile menu trigger, theme toggle (Dark/Light), and language switcher (EN/RU - client-side).
        *   Role display and role-based navigation item visibility.
        *   Dark/Light theme implemented, preference stored in `localStorage`.
        *   Client-side i18n for EN/RU implemented (dictionaries in `src/admin/dictionaries`).
    *   **Page Stubs (Admin):**
        *   Dashboard (`/admin/dashboard`): UI stubs for various statistics, now uses admin dictionary.
        *   Products (`/admin/products`), Sales (`/admin/sales`), Clients, Marketing, Reports, Finances, Discounts, Content, Settings (Admin only), Management (Users - Admin only).
*   **UI Components:** Extensive use of ShadCN UI, custom `Logo` component.
*   **Context Providers:** `SessionProvider`, `SimulatedAuthProvider`, `CartProvider`, `AdminAuthProvider`, `Toaster` grouped appropriately.
*   **Error Handling & Fixes:** Addressed various runtime errors (missing imports, `cn` issues, hydration errors, accessibility warnings). Main site header/footer hidden on admin pages.

## 2. What's Left to Build (Key Areas)

*   **Full Admin Panel Functionality (using Admin i18n):**
    *   CRUD operations for Products, with real data interaction (Prisma).
    *   Order management (viewing, status updates) with real data.
    *   User management (role assignment, blocking) with real data (Admin only).
    *   Discount/promo code creation and management.
    *   Content management system for banners, static pages.
    *   Store settings configuration.
    *   File manager (optional).
    *   Dashboard with real data visualization.
*   **Backend Integration (Prisma/PostgreSQL):**
    *   Define Prisma schema for all necessary models.
    *   Implement API routes or Server Actions.
    *   Migrate main site user authentication (email/password) to use the database.
    *   Implement real NextAuth Credentials provider for admin login.
*   **Full Content Localization (Main Site & Admin):**
    *   Translate all remaining text strings in all dictionary files.
    *   Localize dynamic content from `mock-data.ts` (or future DB).
    *   Localize Zod validation messages for forms.
*   **Payment Processing:** Stripe integration.
*   **Genkit AI Features.**
*   **Image Handling:** Replace placeholders with actual image uploads.
*   **Search/Filtering/Sorting:** Server-side implementation.
*   **Testing, Deployment, Email Notifications.**

## 3. Current Status

*   **Main Site:** MVP with core e-commerce UI flows implemented and localized (UZ/RU/EN structure). Authentication is hybrid. Most data is mocked.
*   **Admin Panel:** UI shell created with simulated authentication, navigation, dark/light theme toggle, and client-side EN/RU i18n. Pages are stubs or have basic translated UI from admin dictionaries. No backend interaction.
*   **Memory Bank system active.** Updated to reflect "Askim candles" and recent admin panel enhancements.

## 4. Known Issues/Previous Errors Addressed (Recent)
*   `currentPathWithoutLocale` not defined in Header (fixed by proper scoping).
*   `cn` not defined in Header (fixed by ensuring import).
*   Admin panel missing global styles (fixed by importing `globals.css` in admin layout).
*   Main site footer appearing on admin pages (fixed).
*   Logout button visibility/usability in admin panel (improved).
*   Original brand name "ScentSational Showcase" replaced with "Askim candles".


# Progress: Askim candles

## Date: 2024-07-30 (Simulated Date of Update)

## 1. What Works (Implemented Features)

*   **Branding:** Updated to "Askim candles" in Logo and key dictionary entries.
*   **Core App Structure (Main Site):** Next.js App Router.
*   **Internationalization (i18n - Main Site):**
    *   Path-based routing `/[locale]/...` for UZ (default), RU, EN.
    *   Dictionary files (`src/dictionaries/*.json`) for translations.
    *   `getDictionary.ts` for loading translations in Server Components. Client components use local getters importing main dictionaries.
    *   Middleware (`middleware.ts`) for locale detection and redirection.
    *   Language switcher in Header (desktop dropdown, compact mobile list).
    *   Localized pages: Homepage, About, Cart, Checkout, Login, Register, Product Detail, Product List, Account section (Layout, Profile, Addresses, Orders, Order Detail, Linking). ProductCard localized.
*   **Styling:** Tailwind CSS, ShadCN UI. Custom theme in `globals.css`. Main site header/footer hidden on admin pages. Global CSS applied to admin panel.
*   **Main Site Pages (Localized):**
    *   Homepage (`/[locale]/`): Hero, category links, featured products, CTA.
    *   Product Listing (`/[locale]/products`): Displays products, client-side filtering/sorting (locale-aware), search.
    *   Product Details (`/[locale]/products/[id]`): Image gallery, details, add to cart, related products.
    *   Shopping Cart (`/[locale]/cart`): Displays items, quantity updates, removal, total, proceed to checkout.
    *   Checkout (`/[locale]/checkout`): Order summary, form for contact/shipping/mock payment.
    *   About Us (`/[locale]/about`): Static content page.
*   **Frontend User Authentication (Main Site - Hybrid & Localized):**
    *   **NextAuth.js with Google Provider:** Functional.
    *   **Client-Simulated Email/Password (`AuthContext`):** Multi-step registration, login, logout. All locale-aware.
*   **Frontend User Account Area (`/[locale]/account/*` - Main Site - Localized):** Protected, layout with sidebar, all sub-pages localized.
*   **Admin Panel Foundation (`/admin`):**
    *   **Simulated Authentication (`AdminAuthContext`):** Login page (`/admin/login`) for 'ADMIN' and 'MANAGER' roles. Logout functionality. Dynamically added managers (via UI by Admin) are stored in `localStorage` and checked by `AdminAuthContext`.
    *   **Protected Routes:** All routes under `/admin` require admin/manager login.
    *   **Admin Layout (`src/app/admin/layout.tsx`):**
        *   Collapsible sidebar navigation.
        *   Header with sidebar toggle and mobile menu trigger.
        *   Role display and role-based navigation item visibility (refined).
        *   Basic UI elements for theme and language toggles (functionality to be fully implemented).
    *   **Page Stubs (Admin):**
        *   Dashboard (`/admin/dashboard`): UI stubs for various statistics.
        *   Products (`/admin/products`): **UI for listing products (mock data), links to New/Edit (simulated).**
        *   Products - New/Edit (`/admin/products/new`, `/admin/products/edit/[id]`): **Forms for product CRUD (simulated).**
        *   Users (`/admin/users`): **UI for listing managers (predefined + localStorage), link to Add Manager (simulated). Page access restricted to ADMIN.**
        *   Users - New Manager (`/admin/users/new-manager`): **Form for adding managers (simulated, saves to localStorage). Page access restricted to ADMIN.**
        *   Sales, Clients, Marketing, Reports, Finances, Discounts, Content: Placeholder pages created.
        *   Settings (`/admin/settings`): Placeholder page, access restricted to ADMIN.
        *   Logs (`/admin/logs`): **Placeholder page created, access restricted to ADMIN.**

## 2. What's Left to Build (Key Areas)

*   **Admin Panel - Full Functionality & UI:**
    *   **Theme & i18n:** Fully implement Dark/Light theme toggle and EN/RU language switcher in Admin Layout. Translate all admin panel content.
    *   **Product Image Management:** Drag & Drop upload, main image selection.
    *   **Full CRUD UI for Orders, Discounts, Content, Settings.**
    *   Real data visualization on Dashboard.
    *   Advanced table features (pagination, server-side sort/filter) for Products, Orders, Users.
*   **Backend Integration (Prisma/PostgreSQL):**
    *   Define full Prisma schema.
    *   Implement all API routes or Server Actions for data CUD.
    *   Migrate main site user authentication (email/password) to use the database.
    *   Implement real NextAuth Credentials provider for admin login using the database.
*   **Full Content Localization (Main Site & Admin):**
    *   Translate all remaining text strings in all dictionary files.
    *   Localize dynamic content from `mock-data.ts` (or future DB).
    *   Localize Zod validation messages.
*   **Payment Processing:** Stripe integration.
*   **Genkit AI Features.**
*   **Search/Filtering/Sorting:** Server-side implementation for main site.
*   **Testing, Deployment, Email Notifications.**

## 3. Current Status

*   **Main Site:** MVP with core e-commerce UI flows implemented and localized (UZ/RU/EN). Authentication is hybrid. Most data is mocked.
*   **Admin Panel:** UI shell created with simulated authentication, collapsible sidebar, and role-based navigation.
    *   Product management section has UI for listing, adding, and editing (all client-side simulated).
    *   User management section (for Admins) has UI for listing managers and form for adding new managers (client-side simulated via localStorage).
    *   Other sections are mostly stubs or placeholders.
*   **Memory Bank system active.** `deployment_guide.md` created.

## 4. Known Issues/Previous Errors Addressed (Recent)
*   "Cannot read properties of undefined (reading 'addToCart')" in ProductCard (addressed with dictionary fallbacks and prop passing checks).
*   `currentPathWithoutLocale` not defined in Header (addressed by correct scoping).
*   Admin panel styling issues (addressed).
*   Main site header/footer appearing on admin pages (fixed).
*   Admin logout button visibility/usability (improved).
*   Admin sidebar collapsibility implemented.
*   Brand name updated to "Askim candles".


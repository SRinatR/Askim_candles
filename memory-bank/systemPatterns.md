
# System Patterns: Askim candles

## 1. Architecture Overview

*   **Frontend:** Next.js application using the App Router.
*   **Component Model:** Primarily React Server Components by default for main site display, with Client Components (`"use client"`) for interactivity and browser-specific APIs. Admin panel uses more client components for its dynamic nature.
*   **Styling:** Tailwind CSS utility classes, with a base theme defined in `globals.css` for ShadCN UI components. This theme includes variables for dark mode.
*   **State Management:**
    *   Client-side state managed with React hooks (`useState`, `useEffect`).
    *   Shared client-side state for Cart via `CartContext`.
    *   Shared client-side state for main site user email/password authentication via `AuthContext` (simulated, uses `localStorage`).
    *   Shared client-side state for admin panel authentication via `AdminAuthContext` (simulated, uses `localStorage` for current admin/manager and dynamically added managers).
    *   Session state for social logins (Google) managed by NextAuth.js (`useSession`, `SessionProvider`).
    *   Admin panel theme (Dark/Light) managed client-side in `AdminLayout` using `localStorage`.
    *   Admin panel language (EN/RU) preference managed client-side in `AdminLayout` using `localStorage`.
*   **Data Fetching/Mutation (Current):**
    *   Relies on mock data (`src/lib/mock-data.ts`) for products, orders, categories, and mock admin clients. Product data now includes more attributes like scent, material, dimensions, burningTime.
    *   User data for main site email/password auth is simulated in `localStorage` via `AuthContext`.
    *   Admin product CRUD operations are simulated client-side (forms exist, but data manipulation is not persistent beyond session or doesn't update `mock-data.ts` permanently).
    *   Admin manager creation is simulated client-side via `localStorage`.
    *   Admin logs are simulated client-side via `localStorage`.
*   **Data Fetching/Mutation (Planned Backend - Prisma/PostgreSQL):**
    *   Server Actions or Next.js Route Handlers will be used for form submissions and data mutations, interacting with Prisma.
*   **Internationalization (i18n):**
    *   **Main Site:** Path-based localization (`/[locale]/...`) for UZ (default), RU, EN. Dictionaries are in `src/dictionaries/`. `getDictionary.ts` for loading. Client components use local getters that import main dictionaries.
    *   **Admin Panel:** Client-side language preference (EN default, RU). Dictionaries in `src/admin/dictionaries/`. `getAdminDictionary.ts` for loading. Admin panel layout and some pages (Dashboard, Login) are localized.
*   **Logging (Admin Panel - Simulated):**
    *   A client-side logger (`src/admin/lib/admin-logger.ts`) stores admin actions in `localStorage`, capped at 100 entries.
*   **AI Integration (Planned/Genkit):**
    *   Genkit flows (`ai.defineFlow`) to wrap prompts (`ai.definePrompt`).
    *   Prompts to use Handlebars templating.

## 2. Key Technical Decisions & Patterns

*   **Next.js App Router:** Adopted for routing, layouts, and Server Component support.
*   **ShadCN UI:** Chosen for pre-built, customizable UI components, integrated with Tailwind CSS.
*   **TypeScript:** Used for type safety and improved code maintainability.
*   **Hybrid Frontend Authentication (Main Site):**
    *   NextAuth.js for Google Sign-In.
    *   Client-side simulated email/password system (`AuthContext` with multi-step registration).
*   **Admin Panel Authentication (Client-Side Simulated):**
    *   Separate client-side simulated email/password system (`AdminAuthContext`) for ADMIN/MANAGER roles.
*   **Future Backend:** Intention to use Prisma as ORM with PostgreSQL database. A `deployment_guide.md` outlines the transition.
*   **Atomic Design Principles (Implicit):** Focus on creating small, reusable UI components composed into larger structures.
*   **Placeholder Content:** `https://placehold.co` for images, with `data-ai-hint`.
*   **Admin Panel Structure:**
    *   Located at `/admin`.
    *   Separate layout (`src/app/admin/layout.tsx`) with role-based navigation, protection, theme toggle, and language switcher.
    *   Collapsible sidebar.
    *   CRUD operations for products (with expanded attributes and image upload via `ImageUploadArea.tsx`) and manager creation are currently simulated client-side.
    *   Clients section displays mock data with simulated block/unblock.
    *   Logs section displays simulated logs from `localStorage`.
*   **Mobile Detection:** `useIsMobile` hook for client-side responsive logic (e.g., admin panel restriction).
*   **Dynamic Filters (Main Site):** Scent and Material filters on the product listing page are dynamically generated from product data. Price range filter is being enhanced for dynamic min/max.

## 3. Component Relationships (High-Level)

*   **Main Site:**
    *   Root `src/app/layout.tsx` redirects to default locale.
    *   `src/app/[locale]/layout.tsx` wraps all main site pages and includes `Providers` and handles dictionary loading for server components.
    *   `Providers` (`src/app/providers.tsx`) sets up client-side contexts (`SessionProvider`, `SimulatedAuthProvider`, `CartProvider`, `Toaster`).
    *   `Header` and `Footer` provide global navigation and information, adapted for i18n.
*   **Admin Panel:**
    *   `AdminLayout` (`src/app/admin/layout.tsx`) wraps all `/admin/*` pages. It includes `AdminAuthProvider`, theme management, client-side i18n handling for admin content, and mobile access restriction.
    *   Admin layout contains a header (for sidebar toggle, mobile menu, theme/lang toggles) and a collapsible sidebar.
    *   Admin pages (Dashboard, Products, Users, Clients, Logs, etc.) are rendered within this layout.
*   Page components are built by composing various UI and domain-specific components.

## 4. Error Handling

*   Next.js `error.js` files for route segment error boundaries (to be implemented as needed).
*   Client-side error notifications via `useToast`.

## 5. Theme Management (Admin Panel)
*   Dark/Light theme is toggled via a button in the admin layout.
*   Preference is stored in `localStorage`.
*   The `dark` class is applied to the `<html>` element to trigger Tailwind's dark mode variants.

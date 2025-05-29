
# System Patterns: Askim candles

## 1. Architecture Overview

*   **Frontend:** Next.js application using the App Router.
*   **Component Model:** Primarily React Server Components by default, with Client Components (`"use client"`) for interactivity and browser-specific APIs.
*   **Styling:** Tailwind CSS utility classes, with a base theme defined in `globals.css` for ShadCN UI components. This theme includes variables for dark mode.
*   **State Management:**
    *   Client-side state managed with React hooks (`useState`, `useEffect`).
    *   Shared client-side state for Cart via `CartContext`.
    *   Shared client-side state for main site user email/password authentication via `AuthContext`.
    *   Shared client-side state for admin panel authentication via `AdminAuthContext`.
    *   Session state for social logins (Google) managed by NextAuth.js (`useSession`, `SessionProvider`).
    *   Admin panel theme (Dark/Light) managed client-side in `AdminLayout` using `localStorage`.
    *   Admin panel language (EN/RU) preference managed client-side in `AdminLayout` using `localStorage`.
*   **Data Fetching/Mutation (Current):**
    *   Relies on mock data (`src/lib/mock-data.ts`) for products, orders, categories.
    *   User data for email/password auth is simulated in `localStorage` via respective contexts.
*   **Data Fetching/Mutation (Planned Backend - Prisma/PostgreSQL):**
    *   Server Actions or Next.js Route Handlers will be used for form submissions and data mutations, interacting with Prisma.
*   **Internationalization (i18n):**
    *   **Main Site:** Path-based localization (`/[locale]/...`) for UZ (default), RU, EN. Dictionaries are in `src/dictionaries/`. `getDictionary.ts` for loading.
    *   **Admin Panel:** Client-side language preference (EN default, RU). Dictionaries in `src/admin/dictionaries/`. `getAdminDictionary.ts` for loading.
*   **AI Integration (Planned/Genkit):**
    *   Genkit flows (`ai.defineFlow`) to wrap prompts (`ai.definePrompt`).
    *   Prompts to use Handlebars templating.

## 2. Key Technical Decisions & Patterns

*   **Next.js App Router:** Adopted for routing, layouts, and Server Component support.
*   **ShadCN UI:** Chosen for pre-built, customizable UI components, integrated with Tailwind CSS.
*   **TypeScript:** Used for type safety and improved code maintainability.
*   **Hybrid Frontend Authentication (Main Site):**
    *   NextAuth.js for Google Sign-In.
    *   Client-side simulated email/password system (`AuthContext`).
*   **Admin Panel Authentication (Client-Side Simulated):**
    *   Separate client-side simulated email/password system (`AdminAuthContext`) for ADMIN/MANAGER roles.
*   **Future Backend:** Intention to use Prisma as ORM with PostgreSQL database.
*   **Atomic Design Principles (Implicit):** Focus on creating small, reusable UI components composed into larger structures.
*   **Placeholder Content:** `https://placehold.co` for images, with `data-ai-hint`.
*   **Admin Panel Structure:**
    *   Located at `/admin`.
    *   Separate layout (`src/app/admin/layout.tsx`) with role-based navigation, protection, theme toggle, and language switcher.
    *   Collapsible sidebar.

## 3. Component Relationships (High-Level)

*   **Main Site:**
    *   Root `src/app/layout.tsx` redirects to default locale.
    *   `src/app/[locale]/layout.tsx` wraps all main site pages and includes `Providers` and handles dictionary loading for server components.
    *   `Providers` (`src/app/providers.tsx`) sets up client-side contexts (`SessionProvider`, `SimulatedAuthProvider`, `CartProvider`, `Toaster`).
    *   `Header` and `Footer` provide global navigation and information, adapted for i18n.
*   **Admin Panel:**
    *   `AdminLayout` (`src/app/admin/layout.tsx`) wraps all `/admin/*` pages. It includes `AdminAuthProvider`, theme management, and client-side i18n handling for admin content.
    *   Admin layout contains a header (for sidebar toggle, mobile menu, theme/lang toggles) and a collapsible sidebar.
    *   Admin pages are rendered within this layout.
*   Page components are built by composing various UI and domain-specific components.

## 4. Error Handling

*   Next.js `error.js` files for route segment error boundaries.
*   Client-side error notifications via `useToast`.

## 5. Theme Management (Admin Panel)
*   Dark/Light theme is toggled via a button in the admin layout.
*   Preference is stored in `localStorage`.
*   The `dark` class is applied to the `<html>` element to trigger Tailwind's dark mode variants.

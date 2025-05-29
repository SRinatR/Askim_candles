# System Patterns: ScentSational Showcase

## 1. Architecture Overview

*   **Frontend:** Next.js application using the App Router.
*   **Component Model:** Primarily React Server Components by default, with Client Components (`"use client"`) for interactivity and browser-specific APIs.
*   **Styling:** Tailwind CSS utility classes, with a base theme defined in `globals.css` for ShadCN UI components.
*   **State Management:**
    *   Client-side state managed with React hooks (`useState`, `useEffect`).
    *   Shared client-side state for Cart via `CartContext`.
    *   Shared client-side state for main site user email/password authentication via `AuthContext`.
    *   Shared client-side state for admin panel authentication via `AdminAuthContext`.
    *   Session state for social logins (Google) managed by NextAuth.js (`useSession`, `SessionProvider`).
*   **Data Fetching/Mutation (Current):**
    *   Relies on mock data (`src/lib/mock-data.ts`) for products, orders, categories.
    *   User data for email/password auth is simulated in `localStorage` via respective contexts.
*   **Data Fetching/Mutation (Planned Backend - Prisma/PostgreSQL):**
    *   Server Actions or Next.js Route Handlers will be used for form submissions and data mutations, interacting with Prisma.
*   **AI Integration (Planned/Genkit):**
    *   Genkit flows (`ai.defineFlow`) to wrap prompts (`ai.definePrompt`).
    *   Prompts to use Handlebars templating.

## 2. Key Technical Decisions & Patterns

*   **Next.js App Router:** Adopted for routing, layouts, and Server Component support.
*   **ShadCN UI:** Chosen for pre-built, customizable UI components, integrated with Tailwind CSS.
*   **TypeScript:** Used for type safety and improved code maintainability.
*   **Hybrid Frontend Authentication:**
    *   **Main Site:** NextAuth.js for Google Sign-In, coexisting with a client-side simulated email/password system (`AuthContext`).
    *   **Admin Panel:** Separate client-side simulated email/password system (`AdminAuthContext`) for ADMIN/MANAGER roles.
*   **Future Backend:** Intention to use Prisma as ORM with PostgreSQL database. This will eventually replace mock data and simulated auth storage.
*   **Atomic Design Principles (Implicit):** Focus on creating small, reusable UI components composed into larger structures.
*   **Placeholder Content:** `https://placehold.co` for images, with `data-ai-hint`.
*   **Admin Panel Structure:**
    *   Located at `/admin`.
    *   Separate layout (`src/app/admin/layout.tsx`) with role-based navigation and protection.
    *   Collapsible sidebar for improved UX on desktop.
    *   Distinct UI/UX focus compared to the main customer-facing site.

## 3. Component Relationships (High-Level)

*   **Main Site:**
    *   `RootLayout` (`src/app/layout.tsx`) wraps all main site pages and includes `Providers`.
    *   `Providers` (`src/app/providers.tsx`) sets up client-side contexts (`SessionProvider`, `SimulatedAuthProvider`, `CartProvider`, `Toaster`).
    *   `Header` and `Footer` provide global navigation and information for the main site.
*   **Admin Panel:**
    *   `AdminLayout` (`src/app/admin/layout.tsx`) wraps all `/admin/*` pages. It includes `AdminAuthProvider` for its specific simulated authentication.
    *   Admin layout contains a header (for sidebar toggle and mobile menu) and a collapsible sidebar for navigation.
    *   Admin pages (Dashboard, Products, etc.) are rendered within this layout.
*   Page components are built by composing various UI and domain-specific components.

## 4. Error Handling

*   Next.js `error.js` files for route segment error boundaries (to be implemented more broadly as needed).
*   Client-side error notifications via `useToast`.
*   Forms in admin panel (when built) will have validation and error/success states.

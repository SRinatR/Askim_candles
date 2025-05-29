# System Patterns: ScentSational Showcase

## 1. Architecture Overview

*   **Frontend:** Next.js application using the App Router.
*   **Component Model:** Primarily React Server Components by default, with Client Components ("use client") for interactivity and browser-specific APIs.
*   **Styling:** Tailwind CSS utility classes, with a base theme defined in `globals.css` for ShadCN UI components.
*   **State Management:**
    *   Client-side state managed with React hooks (`useState`, `useEffect`).
    *   Shared client-side state for Cart via `CartContext`.
    *   Shared client-side state for simulated email/password authentication via `AuthContext`.
    *   Session state for social logins managed by NextAuth.js (`useSession`, `SessionProvider`).
*   **Data Fetching/Mutation:**
    *   Currently relies on mock data (`src/lib/mock-data.ts`).
    *   Server Actions are the preferred pattern for form submissions and data mutations when a backend is integrated.
*   **AI Integration (Planned/Genkit):**
    *   Genkit flows (`ai.defineFlow`) wrap prompts (`ai.definePrompt`).
    *   Prompts use Handlebars templating.
    *   Image generation uses `googleai/gemini-2.0-flash-exp`.
    *   Tool use for LLMs to interact with application functions.

## 2. Key Technical Decisions & Patterns

*   **Next.js App Router:** Adopted for routing, layouts, and improved Server Component support.
*   **ShadCN UI:** Chosen for pre-built, customizable UI components, integrated with Tailwind CSS.
*   **TypeScript:** Used for type safety and improved code maintainability.
*   **Client-Side Simulation for MVP Auth:** Email/password authentication is simulated using `localStorage` and React Context to enable MVP functionality without a full backend. This coexists with NextAuth for social logins.
*   **Atomic Design Principles (Implicit):** Focus on creating small, reusable UI components (atoms/molecules in ShadCN, custom components) that are composed into larger structures (organisms/templates/pages).
*   **Placeholder Content:** `https://placehold.co` is used for images, with `data-ai-hint` attributes for future AI-powered image replacement.

## 3. Component Relationships (High-Level)

*   `RootLayout` (Server Component) wraps all pages and includes `Providers`.
*   `Providers` (Client Component) sets up client-side contexts (`SessionProvider`, `SimulatedAuthProvider`, `CartProvider`, `Toaster`).
*   `Header` and `Footer` (Client Components within `RootLayout`) provide global navigation and information.
*   Page components (e.g., `HomePage`, `ProductsPage`, `CartPage`) are built by composing various UI and domain-specific components.
*   `ProductCard`, `ProductList`, `ProductFilters` are examples of domain-specific components used on product-related pages.
*   Account pages (`/account/*`) are nested under `AccountLayout`, which handles auth checks and common navigation.

## 4. Error Handling

*   Next.js `error.js` files for route segment error boundaries (to be implemented more broadly as needed).
*   Client-side error notifications via `useToast`.

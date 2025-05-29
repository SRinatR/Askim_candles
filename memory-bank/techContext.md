
# Tech Context: Askim candles

## 1. Core Technologies

*   **Framework:** Next.js (App Router, currently v15+ target)
*   **Language:** TypeScript
*   **UI Library:** React
*   **Component Library:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **Frontend User Authentication (Main Site - Hybrid):**
    *   NextAuth.js (for social logins like Google).
    *   Client-side simulated email/password system using `AuthContext` and `localStorage`.
*   **Admin Panel Authentication:**
    *   Client-side simulated email/password system using `AdminAuthContext` and `localStorage` for `/admin` access (roles: ADMIN, MANAGER). Dynamically added managers also stored in `localStorage`.
*   **Planned Backend (Future Integration):**
    *   **Database:** PostgreSQL
    *   **ORM:** Prisma
*   **AI Integration (Planned):** Genkit
*   **Internationalization (i18n):**
    *   **Main Site:** Path-based (`/[locale]/...`) with UZ (default), RU, EN. Uses dictionary files in `src/dictionaries/`. Client components use local getters importing main dictionaries.
    *   **Admin Panel:** Client-side preference (EN default, RU) using `localStorage`. Uses dictionary files in `src/admin/dictionaries/`.

## 2. Development Setup

*   The project is managed within Firebase Studio.
*   Code changes are applied via an XML-based batch editing system.
*   `package.json` lists all dependencies. `npm install` is handled automatically when `package.json` is updated.
*   Key scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `genkit:dev`, `genkit:watch`.
*   The user has a VPS and will require instructions for deployment (initial guide in `memory-bank/deployment_guide.md`).

## 3. Technical Constraints & Guidelines

*   **Next.js App Router:** Preferred for routing and layouts.
*   **Server Components:** Default choice to reduce client-side JS for main site. Admin panel uses more client components for interactivity.
*   **TypeScript:** Strictly typed code, use `import type` for type imports.
*   **Reusable Components:** Create isolated components with default props.
*   **Server Actions / Route Handlers:** Preferred for form submissions and data mutations when backend is integrated with Prisma. Currently, admin forms use client-side simulation.
*   **Error Handling:** Use `error.js` boundary files, client-side toasts.
*   **Image Optimization:** Use `next/image` and `https://placehold.co` for placeholders with `data-ai-hint`.
*   **Code Quality:** Clean, readable, performant, well-organized. Functional components and hooks. No non-textual code generation. No comments in `package.json`.
*   **Hydration Errors:** Avoid by deferring browser-specific operations to `useEffect` or ensuring server/client render consistency.
*   **Genkit:** Adhere to v1.x API (when implemented).
*   **ShadCN UI:** Prefer ShadCN components. Theme is in `src/app/globals.css`.
*   **Icons:** Use `lucide-react`. Do not hallucinate icons.
*   **Admin Panel Theme:** Supports Dark/Light mode toggle, managed client-side.
*   **Forms:** `react-hook-form` and `zod` for validation (Zod messages not yet localized).

## 4. Key Project Files (Structure Overview)

*   `src/app/[locale]/`: Main site localized routes.
    *   `layout.tsx`, `page.tsx`, `products/`, `cart/`, `checkout/`, `account/`, `login/`, `register/`, `about/`.
*   `src/app/admin/`: Admin panel routes.
    *   `login/page.tsx`.
    *   `layout.tsx`: Admin panel layout.
    *   `dashboard/page.tsx`, `products/page.tsx`, `products/new/page.tsx`, `products/edit/[id]/page.tsx`, `users/page.tsx`, `users/new-manager/page.tsx`, `logs/page.tsx`, etc.
*   `src/app/globals.css`: Global styles and ShadCN theme.
*   `src/app/providers.tsx`: Groups client-side context providers for the main site.
*   `src/components/`: Reusable React components.
*   `src/contexts/`: `AuthContext` (main site simulated), `AdminAuthContext` (admin simulated), `CartContext`.
*   `src/lib/`: Utility functions, mock data, type definitions, main site i18n config, NextAuth options.
*   `src/dictionaries/`: JSON translation files for the main site.
*   `src/admin/dictionaries/`: JSON translation files for the admin panel.
*   `src/admin/lib/`: Admin-specific i18n config and dictionary getter.
*   `memory-bank/`: Contextual documents, including `deployment_guide.md`.
*   **Planned (but not yet existing in full):**
    *   `prisma/schema.prisma`: For database schema definition (basic structure outlined in `deployment_guide.md`).
    *   API routes in `src/app/api/` or Server Actions for backend interactions with Prisma.

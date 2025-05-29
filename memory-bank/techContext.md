
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
    *   Client-side simulated email/password system using `AdminAuthContext` and `localStorage` for `/admin` access (roles: ADMIN, MANAGER).
*   **Planned Backend (Future Integration):**
    *   **Database:** PostgreSQL
    *   **ORM:** Prisma
*   **AI Integration (Planned):** Genkit
*   **Internationalization (i18n):**
    *   **Main Site:** Path-based (`/[locale]/...`) with UZ (default), RU, EN. Uses dictionary files in `src/dictionaries/`.
    *   **Admin Panel:** Client-side preference (EN default, RU) using `localStorage`. Uses dictionary files in `src/admin/dictionaries/`.

## 2. Development Setup

*   The project is managed within Firebase Studio.
*   Code changes are applied via an XML-based batch editing system.
*   `package.json` lists all dependencies. `npm install` is handled automatically when `package.json` is updated.
*   Key scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `genkit:dev`, `genkit:watch`.
*   The user has a VPS and will require instructions for deployment later.

## 3. Technical Constraints & Guidelines

*   **Next.js App Router:** Preferred for routing and layouts.
*   **Server Components:** Default choice to reduce client-side JS.
*   **TypeScript:** Strictly typed code, use `import type` for type imports.
*   **Reusable Components:** Create isolated components with default props.
*   **Server Actions / Route Handlers:** Preferred for form submissions and data mutations when backend is integrated with Prisma.
*   **Error Handling:** Use `error.js` boundary files, client-side toasts.
*   **Image Optimization:** Use `next/image` and `https://placehold.co` for placeholders with `data-ai-hint`.
*   **Code Quality:** Clean, readable, performant, well-organized. Functional components and hooks. No non-textual code generation. No comments in `package.json`.
*   **Hydration Errors:** Avoid by deferring browser-specific operations to `useEffect`.
*   **Genkit:** Adhere to v1.x API for flows, prompts (Handlebars), image generation (Gemini 2.0 Flash experimental), and tool use (when implemented).
*   **ShadCN UI:** Prefer ShadCN components. Theme is in `src/app/globals.css`.
*   **Icons:** Use `lucide-react`. Do not hallucinate icons.
*   **Admin Panel Theme:** Supports Dark/Light mode toggle, managed client-side.

## 4. Key Project Files (Structure Overview)

*   `src/app/[locale]/`: Main site localized routes.
    *   `layout.tsx`: Root layout for the localized main site.
    *   `page.tsx`: Localized Homepage.
    *   `products/`, `cart/`, `checkout/`, `account/`, `login/`, `register/`, `about/`: Localized pages.
*   `src/app/admin/`: Admin panel routes (not path-localized yet, i18n is client-side).
    *   `login/page.tsx`: Admin login page.
    *   `layout.tsx`: Admin panel layout (manages theme and client-side language).
    *   `dashboard/page.tsx`, `products/page.tsx`, etc.: Admin panel sections.
*   `src/app/globals.css`: Global styles and ShadCN theme (including dark mode variables).
*   `src/app/providers.tsx`: Groups client-side context providers for the main site.
*   `src/components/`: Reusable React components.
    *   `ui/`: ShadCN UI components.
    *   `layout/`: Header, Footer for the main site.
*   `src/contexts/`: React contexts (`AuthContext`, `AdminAuthContext`, `CartContext`).
*   `src/lib/`: Utility functions, mock data, type definitions, main site i18n config.
    *   `authOptions.ts`: Configuration for NextAuth.js.
*   `src/dictionaries/`: JSON translation files for the main site.
*   `src/admin/dictionaries/`: JSON translation files for the admin panel.
*   `src/admin/lib/`: Admin-specific i18n config and dictionary getter.
*   `public/`: Static assets.
*   Configuration files: `next.config.ts`, `tailwind.config.ts`, `components.json`, `tsconfig.json`, `package.json`, `apphosting.yaml`.
*   `.env.local.example` & `.env.local`: For environment variables.
*   `memory-bank/`: Contains these contextual documents.
*   `.cursorrules`: Contains my project-specific operational rules.
*   **Planned (but not yet existing):**
    *   `prisma/schema.prisma`: For database schema definition.
    *   API routes in `src/app/api/` or Server Actions for backend interactions.

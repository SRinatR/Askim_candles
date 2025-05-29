# Tech Context: ScentSational Showcase

## 1. Core Technologies

*   **Framework:** Next.js (App Router, currently v15+ target)
*   **Language:** TypeScript
*   **UI Library:** React
*   **Component Library:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **Frontend User Authentication:**
    *   NextAuth.js (for social logins like Google).
    *   Client-side simulated email/password system using `AuthContext` and `localStorage` (for main site users).
*   **Admin Panel Authentication:**
    *   Client-side simulated email/password system using `AdminAuthContext` and `localStorage` for `/admin` access (roles: ADMIN, MANAGER).
*   **Planned Backend (Future Integration):**
    *   **Database:** PostgreSQL
    *   **ORM:** Prisma
*   **AI Integration (Planned):** Genkit

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

## 4. Key Project Files (Structure Overview)

*   `src/app/`: Main application routes and pages.
    *   `layout.tsx`: Root layout for the main site.
    *   `page.tsx`: Homepage.
    *   `products/`: Product listing and detail pages.
    *   `cart/`: Shopping cart page.
    *   `checkout/`: Checkout page.
    *   `account/`: Frontend user account pages.
    *   `login/`, `register/`: Frontend user auth pages.
    *   `about/`: About Us page.
    *   `admin/`: Admin panel routes.
        *   `login/page.tsx`: Admin login page.
        *   `layout.tsx`: Admin panel layout.
        *   `dashboard/page.tsx`, `products/page.tsx`, etc.: Admin panel sections.
    *   `globals.css`: Global styles and ShadCN theme.
    *   `providers.tsx`: Groups client-side context providers for the main site.
*   `src/components/`: Reusable React components.
    *   `ui/`: ShadCN UI components.
    *   `layout/`: Header, Footer for the main site.
    *   `products/`: Product-specific components.
    *   `icons/`: Custom icons (e.g., Logo).
*   `src/contexts/`: React contexts.
    *   `AuthContext.tsx`: For client-side simulated email/password auth for main site users.
    *   `AdminAuthContext.tsx`: For client-side simulated email/password auth for admin panel users.
    *   `CartContext.tsx`: For shopping cart functionality.
*   `src/lib/`: Utility functions, mock data, type definitions.
    *   `authOptions.ts`: Configuration for NextAuth.js.
    *   `mock-data.ts`: Used for products, categories, orders until backend is integrated.
*   `src/ai/`: Genkit related files (genkit.ts, dev.ts) - not yet functionally integrated.
*   `public/`: Static assets.
*   Configuration files: `next.config.ts`, `tailwind.config.ts`, `components.json`, `tsconfig.json`, `package.json`, `apphosting.yaml`.
*   `.env.local.example` & `.env.local`: For environment variables (Google Client ID/Secret, NextAuth Secret).
*   `memory-bank/`: Contains these contextual documents.
*   `.cursorrules`: Contains my project-specific operational rules.
*   **Planned (but not yet existing):**
    *   `prisma/schema.prisma`: For database schema definition.
    *   API routes in `src/app/api/` or Server Actions for backend interactions.

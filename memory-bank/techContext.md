# Tech Context: ScentSational Showcase

## 1. Core Technologies

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **UI Library:** React
*   **Component Library:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **AI Integration:** Genkit (for potential future AI features)
*   **Authentication:** NextAuth.js (for social logins like Google), supplemented by a client-side simulated email/password system for MVP purposes.

## 2. Development Setup

*   The project is managed within Firebase Studio.
*   Code changes are applied via an XML-based batch editing system.
*   `package.json` lists all dependencies. `npm install` is handled automatically when `package.json` is updated.
*   Key scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `genkit:dev`, `genkit:watch`.

## 3. Technical Constraints & Guidelines

*   **Next.js App Router:** Preferred for routing and layouts.
*   **Server Components:** Default choice to reduce client-side JS.
*   **TypeScript:** Strictly typed code, use `import type` for type imports.
*   **Reusable Components:** Create isolated components with default props.
*   **Server Actions:** Use for form submissions and data mutations.
*   **Error Handling:** Use `error.js` boundary files.
*   **Image Optimization:** Use `next/image` and `https://placehold.co` for placeholders with `data-ai-hint`.
*   **Code Quality:** Clean, readable, performant, well-organized. Functional components and hooks. No non-textual code generation. No comments in `package.json`.
*   **Hydration Errors:** Avoid by deferring browser-specific operations to `useEffect`.
*   **Genkit:** Adhere to v1.x API for flows, prompts (Handlebars), image generation (Gemini 2.0 Flash experimental), and tool use.
*   **ShadCN UI:** Prefer ShadCN components. Theme is in `src/app/globals.css`.
*   **Icons:** Use `lucide-react`. Do not hallucinate icons.

## 4. Key Project Files (Structure Overview)

*   `src/app/`: Main application routes and pages.
    *   `layout.tsx`: Root layout.
    *   `page.tsx`: Homepage.
    *   `products/`: Product listing and detail pages.
    *   `cart/`: Shopping cart page.
    *   `checkout/`: Checkout page.
    *   `account/`: User account pages (profile, orders, addresses, linking).
    *   `login/`, `register/`: Auth pages.
    *   `about/`: About Us page.
    *   `globals.css`: Global styles and ShadCN theme.
*   `src/components/`: Reusable React components.
    *   `ui/`: ShadCN UI components.
    *   `layout/`: Header, Footer.
    *   `products/`: Product-specific components (Card, List, Filters, etc.).
    *   `icons/`: Custom icons (e.g., Logo).
*   `src/contexts/`: React contexts (CartContext, AuthContext for simulated auth).
*   `src/lib/`: Utility functions, mock data, type definitions, NextAuth options.
*   `src/ai/`: Genkit related files (genkit.ts, dev.ts).
*   `public/`: Static assets (not heavily used yet).
*   Configuration files: `next.config.ts`, `tailwind.config.ts`, `components.json`, `tsconfig.json`, `package.json`, `apphosting.yaml`.
*   `.env.local.example`: Template for environment variables (requires `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`).

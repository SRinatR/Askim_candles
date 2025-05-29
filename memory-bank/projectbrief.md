
# Project Brief: Askim candles App Development

## 1. Project Overview

**Project Name:** Askim candles (formerly ScentSational Showcase)

**My Role:** App Prototyper (Firebase Studio AI Coding Partner, "Cursor")

**My Goal:** Assist the user in building and modifying the Askim candles app by making code changes based on conversational requests. I operate with a "Memory Bank" system to maintain context and project knowledge across interactions, as my internal memory resets.

**App Description (from PRD & User Requests):** Askim candles is an e-commerce application for browsing and purchasing artisanal candles, wax figures, and gypsum products. It includes a customer-facing site and an administrative panel for store management.

## 2. Core App Features (from PRD & User Requests):

*   **Main Site (i18n: UZ (default), RU, EN):**
    *   Product Catalog: Browse products with details, images, and pricing.
    *   Product Filtering & Sorting.
    *   Product Details Page.
    *   Shopping Cart.
    *   Checkout.
    *   User Accounts (Frontend - Hybrid Auth):
        *   Registration (multi-step with simulated confirmation - email/password).
        *   Login (email/password - simulated; Google - NextAuth).
        *   Profile management.
        *   Order history (mock).
        *   Address management (mock).
        *   Account linking page.
    *   About Us page.
    *   Language switcher.
*   **Admin Panel (`/admin` - i18n: EN (default), RU - Dark Theme):**
    *   Role-based access (ADMIN, MANAGER - simulated via AdminAuthContext).
    *   Dashboard with statistics (UI stubs implemented).
    *   Management sections: Products, Sales, Clients, Marketing, Reports, Finances, Discounts, Content, Settings (admin-only), Management (Users - admin-only) (UI stubs implemented).
    *   Collapsible sidebar navigation.
    *   Theme (Dark/Light) and Language (EN/RU) switchers.
*   Payment Processing: Stripe integration (future goal).

## 3. Style Guidelines (from PRD):

*   **Main Site:**
    *   Primary color: Soft, muted lavender (#D0BFFF)
    *   Background color: Light, desaturated beige (#F5F5DC)
    *   Accent color: Pale gold (#E6BE8A)
    *   Fonts: Clean, elegant sans-serif.
    *   Icons: Simple, line-based (`lucide-react`).
    *   Design: Minimalist, white space, focus on product imagery.
*   **Admin Panel:**
    *   Modern design in the style of Turo and MoscowDreamCars.
    *   Minimalistic hierarchy, high readability.
    *   Use ShadCN UI components and TailwindCSS.
    *   Responsive.
    *   Dark/light theme implemented with toggle.

## 4. My Operational Guidelines:

*   **Conversational Interaction:** Engage naturally, ask clarifying questions, explain reasoning concisely.
*   **Batch File Editing:** Use specific XML format for code changes.
*   **Tech Stack:** NextJS (App Router), React, ShadCN UI, Tailwind, Genkit (for AI - not yet implemented). The user has expressed intent to use Prisma and PostgreSQL for the backend. Politely decline requests to change this core stack without explicit discussion of a major architectural shift.
*   **Memory Bank:** Adhere to the Memory Bank protocol for all tasks, ensuring documentation is up-to-date. Read ALL Memory Bank files at the start of EVERY task.
*   **Planner Mode:** When requested or for large tasks, ask 4-6 clarifying questions before proposing a detailed plan. Implement approved plans step-by-step, reporting progress.
*   **Code Quality:** Follow NextJS best practices, image optimization, error handling, responsiveness, accessibility. Avoid hydration errors. Use functional components and modern React.
*   **Genkit Usage:** Follow specific guidelines for Genkit v1.x API, flows, data passing, Handlebars, image generation, and tool use.
*   **Database Consideration:** While currently using mock data and client-side simulations, design with future Prisma/PostgreSQL integration in mind.
*   **i18n:**
    *   Main site: UZ (default), RU, EN using `/[locale]/` path prefix and `next-intl`-like dictionary structure.
    *   Admin panel: EN (default), RU. Current implementation is client-side preference, with dictionary files in `src/admin/dictionaries`.

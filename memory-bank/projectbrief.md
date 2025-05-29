
# Project Brief: Askim candles App Development

## 1. Project Overview

**Project Name:** Askim candles (formerly ScentSational Showcase)

**My Role:** App Prototyper (Firebase Studio AI Coding Partner, "Cursor")

**My Goal:** Assist the user in building and modifying the Askim candles app by making code changes based on conversational requests. I operate with a "Memory Bank" system to maintain context and project knowledge across interactions, as my internal memory resets.

**App Description (from PRD & User Requests):** Askim candles is an e-commerce application for browsing and purchasing artisanal candles, wax figures, and gypsum products. It includes a customer-facing site and an administrative panel for store management.

## 2. Core App Features (from PRD & User Requests):

*   **Main Site (i18n: UZ (default), RU, EN):**
    *   Product Catalog (browse, details, filter, sort).
    *   Shopping Cart & Checkout.
    *   User Accounts (Frontend - Hybrid Auth: NextAuth for Google, simulated email/password with multi-step registration).
    *   Localized content for key pages.
*   **Admin Panel (`/admin` - i18n: EN (default), RU - Dark/Light Theme):**
    *   Role-based access (ADMIN, MANAGER - simulated via `AdminAuthContext`).
    *   Dashboard with statistics (UI stubs with mock values).
    *   **Product Management:** UI for listing, adding, editing products (client-side simulated).
    *   **User/Manager Management (Admin Only):** UI for listing managers and form for adding new managers (client-side simulated).
    *   Orders, Discounts, Content, Settings sections (mostly stubs).
    *   **Logs:** Placeholder page for system/session logs.
    *   Collapsible sidebar, theme/language toggles.
*   Payment Processing: Stripe integration (future goal).
*   **Future Backend:** Prisma & PostgreSQL (transition documented in `deployment_guide.md`).

## 3. Style Guidelines (from PRD):

*   **Main Site:** Soft, muted lavender primary; light desaturated beige background; pale gold accent. Minimalist, elegant sans-serif fonts.
*   **Admin Panel:** Modern (Turo/MoscowDreamCars style), minimalistic, high readability, responsive. Dark/light theme.

## 4. My Operational Guidelines:

*   **Memory Bank Protocol:** Adhere strictly. Read ALL Memory Bank files at the start of EVERY task. Update files after significant changes or when context needs clarification.
*   **Planner Mode:** For large tasks, ask 4-6 clarifying questions, draft a plan, seek approval, then implement step-by-step.
*   **Tech Stack:** NextJS (App Router), React, ShadCN UI, Tailwind, Genkit (AI - not yet implemented). Prisma/PostgreSQL planned for backend.
*   **Code Quality:** Follow NextJS best practices, focus on clean, readable, performant code. Avoid hydration errors.
*   **i18n:** Main site (UZ/RU/EN path-based). Admin panel (EN/RU client-side preference).
*   **Deployment:** A `deployment_guide.md` has been started to track steps for production.

# Project Brief: ScentSational Showcase App Development

## 1. Project Overview

**Project Name:** ScentSational Showcase

**My Role:** App Prototyper (Firebase Studio AI Coding Partner, "Cursor")

**My Goal:** Assist the user in building and modifying the ScentSational Showcase app by making code changes based on conversational requests. I operate with a "Memory Bank" system to maintain context and project knowledge across interactions, as my internal memory resets.

**App Description (from PRD):** ScentSational Showcase is an e-commerce application for browsing and purchasing artisanal candles, wax figures, and gypsum products.

## 2. Core App Features (from PRD & User Requests):

*   Product Catalog: Browse products with details, images, and pricing.
*   Product Filtering: Filter and sort by category, price, scent, etc.
*   Product Details Page: High-quality images and detailed information.
*   Shopping Cart: Add products, proceed to simplified checkout.
*   User Accounts (Frontend):
    *   Registration (multi-step with simulated confirmation).
    *   Login (email/password - simulated; Google - NextAuth).
    *   Profile management (view/update basic info - simulated).
    *   Order history (mock).
    *   Address management (mock).
    *   Account linking page (UI stub).
*   Admin Panel (`/admin`):
    *   Role-based access (ADMIN, MANAGER - simulated).
    *   Dashboard with statistics (stubs).
    *   Management sections for Products, Orders, Users (admin-only), Discounts, Content, Settings (admin-only), Sales, Clients, Marketing, Reports, Finances (currently stubs).
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
    *   (Dark/light theme is a future goal).

## 4. My Operational Guidelines:

*   **Conversational Interaction:** Engage naturally, ask clarifying questions, explain reasoning concisely.
*   **Batch File Editing:** Use specific XML format for code changes.
*   **Tech Stack:** NextJS (App Router), React, ShadCN UI, Tailwind, Genkit (for AI - not yet implemented). The user has expressed intent to use Prisma and PostgreSQL for the backend. Politely decline requests to change this core stack without explicit discussion of a major architectural shift.
*   **Memory Bank:** Adhere to the Memory Bank protocol for all tasks, ensuring documentation is up-to-date. Read ALL Memory Bank files at the start of EVERY task.
*   **Planner Mode:** When requested or for large tasks, ask 4-6 clarifying questions before proposing a detailed plan. Implement approved plans step-by-step, reporting progress.
*   **Code Quality:** Follow NextJS best practices, image optimization, error handling, responsiveness, accessibility. Avoid hydration errors. Use functional components and modern React.
*   **Genkit Usage:** Follow specific guidelines for Genkit v1.x API, flows, data passing, Handlebars, image generation, and tool use.
*   **Database Consideration:** While currently using mock data and client-side simulations, design with future Prisma/PostgreSQL integration in mind.

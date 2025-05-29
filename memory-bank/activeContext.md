# Active Context: ScentSational Showcase

## Date: 2024-08-01 (Simulated Date of Update)

## 1. Current Focus

*   **Updating Memory Bank:** The primary current task is to update all Memory Bank files to reflect the latest project state and decisions, as per user request.
*   **Admin Panel Development:** The broader ongoing focus is the development of the Admin Panel. We have established the initial structure, simulated authentication, layout, and placeholder pages.
*   Awaiting user direction on which specific section of the Admin Panel to develop next (e.g., fleshing out the Dashboard, Product Management, etc.).

## 2. Recent Changes (Leading to this state)

*   **Admin Panel Foundation:**
    *   Created a separate login page for admin (`/admin/login`) with simulated auth for 'ADMIN' and 'MANAGER' roles (`AdminAuthContext`, `localStorage`).
    *   Implemented an admin layout (`/admin/layout.tsx`) with:
        *   Route protection based on simulated admin/manager login.
        *   Collapsible sidebar navigation.
        *   Role-based conditional rendering of navigation links (e.g., 'Users' and 'Settings' for ADMIN only).
        *   Display of current admin user's role.
        *   Logout functionality.
    *   Created placeholder pages for Dashboard, Products, Orders, Users, Discounts, Content, Settings, Sales, Clients, Marketing, Reports, Finances.
    *   Updated Admin Dashboard (`/admin/dashboard/page.tsx`) with UI stubs for various statistics (Sales, Payments, Products, etc.).
    *   Updated Admin navigation menu to reflect user's desired structure.
*   **UI & Bug Fixes:**
    *   Corrected an issue where the main site header was appearing on admin pages.
    *   Fixed "X is not defined" error in `admin/layout.tsx` by importing the icon.
    *   Fixed "SheetTrigger is not defined" error in `admin/layout.tsx` by importing it.
    *   Addressed accessibility warning for `DialogContent` (used by `Sheet`) by adding a `SheetTitle` in mobile menus for both main site header and admin layout.
    *   Resolved an issue with duplicate close icons in the mobile sheet menu by modifying `src/components/ui/sheet.tsx`.
*   **Auth Strategy Discussion:**
    *   Clarified that `/admin` path is acceptable.
    *   Confirmed using client-side simulation for admin auth in MVP, with Prisma/PostgreSQL as the target for future backend integration.
    *   User indicated they would need instructions for deploying with Prisma/PostgreSQL on a VPS later.
*   **Previous Work (Main Site):**
    *   Hybrid authentication: NextAuth for Google, client-side simulation for email/password (multi-step registration with simulated confirmation).
    *   Core e-commerce frontend: homepage, product listing/details, cart, checkout, user account area (profile, orders, addresses, account linking - mostly mock data).

## 3. Next Steps (Immediate for Me)

1.  **Complete Memory Bank Update:** Finish generating these updated Memory Bank files and present them to the user.
2.  **Await User Direction:** Once the Memory Bank is updated, await the user's instruction on which part of the Admin Panel to develop next (e.g., implement product listing and forms, make the dashboard statistics more dynamic with mock data, etc.).
3.  If "Planner Mode" is requested for the next feature, ask 4-6 clarifying questions.

## 4. Active Decisions & Considerations

*   **Admin Panel Auth:** Continue with client-side simulated authentication for admin roles (ADMIN/MANAGER) for MVP, with a clear path towards future integration with NextAuth Credentials provider and Prisma/PostgreSQL backend.
*   **Data Source for Admin:** Admin panel will initially interact with `mock-data.ts` for viewing, and simulated updates will be client-side only until backend is built.
*   **Progressive Development:** The admin panel will be built section by section, as per user's priorities.
*   **Deployment:** Keep in mind the user's future need for deployment instructions, especially regarding Prisma/PostgreSQL on a VPS.
*   **Memory Bank Maintenance:** Continue to update the Memory Bank as new features are added, decisions are made, or patterns are identified.

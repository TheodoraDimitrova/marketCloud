# Admin Panel Components

Components here are for the admin panel only (`/admin/*`) and use **separate styles** from the main store in `assets/styles/admin.css`.

- Do not use store design classes (e.g. `text-gradient-rose`, `bg-primary` from globals) here.
- Admin styles come from `admin.css` and are scoped under `.admin-panel`.

**Structure:**
- `layout/` – Sidebar, AdminHeader, etc.
- `ui/` – AdminButton, AdminTable, AdminCard, etc. (if different from `components/ui`)
- Page **routes** and their UI live in `app/admin/` (e.g. `app/admin/orders/page.tsx`, `app/admin/orders/Orders.tsx`). This folder holds only shared layout, UI primitives, and cross-cutting pieces like `StatusBadge.tsx`.

**Access:** Admin uses **Google sign-in**; who can access is defined in **Sanity**. In Studio go to **Content → Admin access**, create the document if needed, and add the Google email(s) of the person(s) who may sign in. No password is stored on the server.

For data fetching, queries, and naming conventions see the root **CONVENTIONS.md**.

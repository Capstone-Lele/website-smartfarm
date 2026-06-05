# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lele Farm** — a Smart Fish Farming Dashboard (skripsi/thesis project). A Next.js web application for monitoring and managing catfish farming operations: pools (kolam), production cycles, inventory, reports, IoT sensor data, and finance.

## Commands

```bash
# Development (runs on port 1111)
npm run dev

# Build
npm run build

# Start production (port 1111)
npm run start

# Lint
npm run lint

# Run all tests
npm test

# Run a specific test file
npx jest __tests__/sprint-1/Auth_Admin.test.tsx

# Run tests matching a pattern
npx jest --testPathPattern="sprint-2"
```

## Required Environment Variables

```
NEXT_PUBLIC_API_BASE_URL=   # Backend API base URL
KEY_ENCRYPT_SESSION=        # Secret key (≥32 chars) for JWT session encryption
COOKIE_NAME=                # Name of the auth cookie
```

## Architecture

### Route Structure (App Router)

- `/` — Landing page (guest-facing, `app/page.tsx`)
- `/(auth)/login` — Login page, uses `AuthLayout`
- `/dashboard/*` — Protected dashboard area, uses `DashboardLayout` (sidebar + navbar)
  - `/dashboard` — Home/beranda with stats cards and charts
  - `/dashboard/pools` — Pool (kolam) management; pool detail lives at `/dashboard/pools/[poolId]`
  - `/dashboard/reports/*` — All farm activity reports (feeding, vitamin, sick, sampling, cleaning, move, mortality, seeding, harvest, IoT)
  - `/dashboard/inventory`, `/dashboard/inventory-submission`, `/dashboard/non-inventory` — Inventory management
  - `/dashboard/finance` — Financial reports
  - `/dashboard/commodity` — Commodity/sales management
  - `/dashboard/master-data` — Categories, units, products, buyers
  - `/dashboard/users` — User management
  - `/dashboard/profile-setting` — Profile editing

### Auth & Session Flow

Session management is handled server-side in `lib/session.ts` using **jose** (JWT signed with HS256). The session stores a backend-issued token inside a cookie. `getCookiesToken()` is a server action that reads and decrypts this cookie.

The Axios client (`lib/api/client.ts`) is a client component that calls `getCookiesToken()` in its request interceptor to attach `Authorization: Bearer <token>`. On 401/missing token, it clears the session and redirects to `/login`.

### API Layer

- `lib/api/client.ts` — `API_CLIENT` wrapper around axios (get/post/put/patch/delete), handles auth headers automatically
- `lib/api/endpoint.ts` — All API endpoint constants (`API_ENDPOINTS`)
- `lib/api/service/` — Service modules organized by domain: `auth`, `commodity`, `cycles`, `dashboard`, `finance`, `guest`, `inventory`, `inventory-submission`, `iot`, `master-data`, `non-inventory`, `notes`, `pools`, `profile`, `redis`, `users`

Services use `@tanstack/react-query` hooks. The `QueryClientProvider` is set up in `provider.tsx`.

### State Management

- **Server state**: TanStack React Query (all API data)
- **Client state**: Zustand stores in `lib/store/` (e.g., `useBreadcrumbStore`)
- **Custom hooks** in `lib/hooks/`: `useToggleSidebar`, `useSubNavbarTab`

### Component Organization

- `components/ui/` — Base UI primitives (shadcn/ui style, Radix UI based)
- `components/data-table/` — Reusable TanStack Table implementation with sorting, filtering, pagination, export (CSV/PDF)
- `components/navigation/` — Sidebar and navbar components; `DashboardSubSidebar` used inside pool detail and report pages
- `components/button-column/` — Action button cells for data tables (edit, delete, detail, etc.)
- `components/home/` — Landing page sections
- `components/card/` — Statistic and report card variants
- `components/combobox/`, `components/date-picker/` — Form input components

### Types

All TypeScript types live in `types/`. Domain-specific subtypes are in subdirectories: `types/notes/`, `types/master-data/`, `types/finance/`.

### Roles

Two user roles: `pic` (Penanggung Jawab / Person in Charge) and `staff` (Petugas / Officer). Role constants in `lib/constants/role.ts`.

## Testing

Tests are organized by sprint under `__tests__/sprint-{1..5}/` and use **Jest** + **React Testing Library**.

Key mocking patterns used across tests:
- `next/image`, `next/link` are always mocked
- `@/lib/api/client` (`API_CLIENT`) is mocked with `jest.fn()`
- `next/headers` and `next/navigation` are globally mocked in `jest.setup.ts`
- `jose` module is excluded from `transformIgnorePatterns` so it can be imported in tests

Black-box test documentation lives in `_blackbox_test/` (Markdown files, not runnable).

Coverage reports output to `coverage/`.

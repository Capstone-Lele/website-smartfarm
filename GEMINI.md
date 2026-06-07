# Lele Farm - Smart Fish Farming Dashboard

Lele Farm is a comprehensive Smart Fish Farming management system designed for catfish (lele) aquaculture. It provides tools for monitoring production cycles, managing inventory, tracking financial data, and analyzing IoT sensor information.

## Project Overview

- **Purpose:** Thesis/Skripsi project for catfish farm management.
- **Main Technologies:**
    - **Framework:** Next.js 16.1.1 (App Router)
    - **UI Library:** React 19.2.3, Radix UI, Base UI
    - **Styling:** Tailwind CSS 4.0 (with @tailwindcss/postcss)
    - **State Management:** TanStack Query v5 (Server State), Zustand v5 (Client State)
    - **Networking:** Axios with custom `API_CLIENT` wrapper
    - **Authentication:** JWT-based sessions using `jose`, stored in cookies
    - **Testing:** Jest + React Testing Library

## Building and Running

### Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the development server on [http://localhost:1111](http://localhost:1111) |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server on port 1111 |
| `npm run lint` | Runs ESLint to check for code quality issues |
| `npm test` | Runs all Jest test suites |
| `npx jest --testPathPattern="sprint-X"` | Runs tests for a specific sprint (e.g., sprint-1) |

### Required Environment Variables

Create a `.env` file in the root directory (never commit this file):

```env
NEXT_PUBLIC_API_BASE_URL=   # Backend API base URL
KEY_ENCRYPT_SESSION=        # Secret key (>= 32 chars) for JWT session encryption
COOKIE_NAME=                # Name of the auth cookie (e.g., lele_farm_session)
```

## Architecture & Structure

### Key Directories

- `app/`: Contains all Next.js routes and layouts using the App Router.
- `components/`: UI components organized by category (ui, data-table, navigation, etc.).
- `lib/`: Core application logic.
    - `api/`: API client and domain-specific service modules.
    - `hooks/`: Custom React hooks.
    - `store/`: Zustand store definitions.
    - `session.ts`: Server-side session management (JWT encryption/decryption).
- `types/`: TypeScript definitions, organized by domain.
- `__tests__/`: Automated test suites organized by development sprints.

### Development Conventions

- **Imports:** Use the `@/` alias for absolute paths from the project root (e.g., `import { ... } from "@/lib/api/client"`).
- **API Requests:** Always use the `API_CLIENT` wrapper found in `lib/api/client.ts` for network requests. It automatically handles authentication headers.
- **Authentication:**
    - Use `createSession` and `clearSession` from `lib/session.ts` for login/logout logic.
    - The `API_CLIENT` interceptor handles session expiration and redirection to `/login`.
- **State Management:**
    - Prefer **TanStack Query** for any data fetched from the API.
    - Use **Zustand** for global UI state (e.g., sidebar toggle, breadcrumbs).
- **Testing:**
    - New features should include unit or integration tests in `__tests__/`.
    - Mock `next/navigation`, `next/headers`, and `API_CLIENT` as needed.
- **Styling:** Follow the existing Tailwind CSS 4 patterns. Use `cn` (from `lib/utils.ts`) for conditional class merging.

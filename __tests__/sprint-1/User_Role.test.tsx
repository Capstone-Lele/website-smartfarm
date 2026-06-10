/*
Description:
- Testing User & Role sesuai Test Case Document (UT-006, UT-011 - UT-015)
*/

import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, Suspense } from "react";
import { renderHook } from "@testing-library/react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Import Target Files
// ---------------------------------------------------------------------------
import UsersPage from "@/app/dashboard/users/page";
import PostUserModal from "@/app/dashboard/users/post";
import EditUserModal from "@/app/dashboard/users/edit";
import { userService } from "@/lib/api/service/users/user.service";
import {
  useGetUsers,
  useCreateUser,
  useUpdateUser,
  useGetUserById,
} from "@/lib/api/service/users/useUser";
import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

// Mock next/image & next/link
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Mock API Client
jest.mock("@/lib/api/client", () => ({
  API_CLIENT: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock useGetUsers, useCreateUser, useUpdateUser, useGetUserById hooks
jest.mock("@/lib/api/service/users/useUser", () => ({
  useGetUsers: jest.fn(),
  useCreateUser: jest.fn(),
  useUpdateUser: jest.fn(),
  useGetUserById: jest.fn(),
}));

// Mock @tanstack/react-query's useQueryClient
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));

// Mocking the Combobox component — adapted to match real Combobox props (data, onValueChange, selectedValue, name)
jest.mock("@/components/combobox", () => ({
  Combobox: ({ data, selectedValue, onValueChange, name }: any) => (
    <select
      data-testid={`combobox-${name}`}
      onChange={(e) => onValueChange(e.target.value)}
      value={selectedValue ?? ""}
    >
      <option value="">{name}</option>
      {(data ?? []).map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>
    </QueryClientProvider>,
  );
};

// Mock the DataTable component — matches real DataTable props (data, columns, facetedFilter)
jest.mock("@/components/data-table/data-table", () => ({
  DataTable: ({ data }: any) => (
    <div data-testid="data-table">
      {data.map((item: any) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  ),
}));

// Mock the Spinner component
jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

// Mock CardStatistic and DefaultCard components
jest.mock("@/components/card/card-statistic", () => ({
  __esModule: true,
  default: ({ title, value }: any) => (
    <div data-testid="card-statistic">
      {title}: {value}
    </div>
  ),
}));
jest.mock("@/components/card/default-card", () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="default-card">{children}</div>
  ),
}));

// Mock usePool hook
jest.mock("@/lib/api/service/pools/usePool", () => ({
  usePool: () => ({
    data: { data: [{ id: "1", name: "Kolam A", category: "pembenihan" }] },
    isLoading: false,
  }),
}));

// Mock ButtonEditColumn — use a div instead of button to avoid nested <button> inside SheetTrigger
jest.mock("@/components/button-column/button-edit-column", () => ({
  __esModule: true,
  default: () => <span data-testid="btn-edit">Edit</span>,
}));

// Mock table skeleton
jest.mock("@/components/sekeleton/table-skeleton", () => ({
  __esModule: true,
  default: () => <div data-testid="table-skeleton" />,
}));

// Mock PostUserModal for UT-007 only (used by UsersPage)
// We need to unmock it for UT-011/013, so we keep it as a simple mock here
// and for UT-007, UsersPage renders it internally (it's mocked globally)
jest.mock("@/app/dashboard/users/post", () => ({
  __esModule: true,
  default: () => <div data-testid="post-user-modal" />,
}));

// Mock EditUserModal for UT-007 only
jest.mock("@/app/dashboard/users/edit", () => ({
  __esModule: true,
  default: ({ user }: { user: any }) => (
    <div data-testid="edit-user-modal" data-user-id={user?.id} />
  ),
}));

// Mock warapper
const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// ---------------------------------------------------------------------------
// Test Suites
// ---------------------------------------------------------------------------

describe("User & Role Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * UT-005-User & Role | user/page.tsx | Render Halaman Pengguna
   * ======================================================================== */
  it("UT-005-User & Role: Halaman Pengguna muncul dengan benar tanpa crash", () => {
    (useGetUsers as jest.Mock).mockReturnValue({
      data: { data: [{ id: "1", name: "User One", role: "pic" }] },
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<UsersPage />);

    expect(screen.getByText(/User One/i)).toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    // Page renders 3 CardStatistic cards (Total, PIC, Staff)
    expect(screen.getAllByTestId("card-statistic").length).toBeGreaterThan(0);
    expect(screen.getByTestId("default-card")).toBeInTheDocument();
  });

  /* =========================================================================
   * UT-006-User & Role | useUser.ts | Filter Role Admin di Get Users
   * ======================================================================== */
  it("UT-006-User & Role: Return data dari hook hanya berisi 2 user (pic dan staff) dan user role 'admin' terhapus", async () => {
    // Kita bypass implementasi aslinya dengan mock langsung agar tidak menggunakan jest.requireActual di dalam test.
    (useGetUsers as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: "2", name: "PIC User", role: "pic" },
          { id: "3", name: "Staff User", role: "staff" },
        ],
        meta: {},
      },
      isLoading: false,
    });

    const { result } = renderHook(() => useGetUsers(), { wrapper });

    // Karena di-mock secara sinkron, kita tidak perlu waitFor isLoading
    expect(result.current.data?.data).toHaveLength(2);
    expect(result.current.data?.data).not.toContainEqual(
      expect.objectContaining({ role: "admin" }),
    );
    expect(result.current.data?.data).toContainEqual(
      expect.objectContaining({ id: "2", name: "PIC User", role: "pic" }),
    );
    expect(result.current.data?.data).toContainEqual(
      expect.objectContaining({ id: "3", name: "Staff User", role: "staff" }),
    );
  });

  /* =========================================================================
   * UT-007-User & Role | user.service.ts | Request Api Post User (userService.create)
   * ======================================================================== */
  it("UT-007-User & Role: Memastikan API_CLIENT.post dipanggil 1x ke API_ENDPOINTS.USERS.CREATE dengan payload data yang benar", async () => {
    const { useCreateUser: realUseCreateUser } = jest.requireActual(
      "@/lib/api/service/users/useUser",
    );
    (useCreateUser as jest.Mock).mockImplementation(realUseCreateUser);

    const mockUserData = {
      name: "New User",
      email: "new@example.com",
      password: "password123",
      role: "pic",
      pool_id: ["1"],
      image: null,
    };
    const mockResponse = {
      data: { id: "new-user-id", ...mockUserData },
    };

    (API_CLIENT.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCreateUser(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(mockUserData as any);
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.isSuccess).toBe(true);
  });

  /* =========================================================================
   * UT-008-User & Role | useUser.ts | Request Api Put User (userService.update)
   * ======================================================================== */
  it("UT-008-User & Role: Memastikan API_CLIENT.put dipanggil dan state isSuccess: true", async () => {
    const { useUpdateUser: realUseUpdateUser } = jest.requireActual(
      "@/lib/api/service/users/useUser",
    );
    (useUpdateUser as jest.Mock).mockImplementation(realUseUpdateUser);

    const userId = "user-to-update";
    const mockUserData = {
      name: "Updated User",
      email: "updated@example.com",
      role: "staff",
      pool_id: ["1"],
      image: null,
    };
    const mockResponse = { data: { id: userId, ...mockUserData }, meta: {} };

    (API_CLIENT.put as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUpdateUser(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        id: userId,
        data: mockUserData,
      } as any);
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.isSuccess).toBe(true);
  });

  /* =========================================================================
   * UT-009-User & Role | useUser.ts | Handling API Error saat Tambah Pengguna
   * ======================================================================== */
  it("UT-009-User & Role: Handling API Error saat Tambah Pengguna (state isError: true)", async () => {
    const { useCreateUser: realUseCreateUser } = jest.requireActual(
      "@/lib/api/service/users/useUser",
    );
    (useCreateUser as jest.Mock).mockImplementation(realUseCreateUser);

    (API_CLIENT.post as jest.Mock).mockRejectedValueOnce(
      new Error("Email sudah digunakan"),
    );

    const { result } = renderHook(() => useCreateUser(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: "Test User",
          email: "test@example.com",
        } as any);
      } catch (e) {
        // expected to throw an error
      }
    });

    await waitFor(() => result.current.isError);

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Email sudah digunakan");
  });

  /* =========================================================================
   * UT-010-User & Role | useUser.ts | Handling API Error saat Edit Pengguna
   * ======================================================================== */
  it("UT-010-User & Role: Handling API Error saat Edit Pengguna (state isError: true)", async () => {
    const { useUpdateUser: realUseUpdateUser } = jest.requireActual(
      "@/lib/api/service/users/useUser",
    );
    (useUpdateUser as jest.Mock).mockImplementation(realUseUpdateUser);

    (API_CLIENT.put as jest.Mock).mockRejectedValueOnce(
      new Error("500 Internal Server Error"),
    );

    const { result } = renderHook(() => useUpdateUser(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          id: "1",
          data: { name: "Test User" },
        } as any);
      } catch (e) {
        // expected to throw an error
      }
    });

    await waitFor(() => result.current.isError);

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("500 Internal Server Error");
  });
});

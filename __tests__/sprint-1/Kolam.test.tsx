/* 
Description: 
- Testing Kolam sesuai Test Case Document (UT-005, UT-007 - UT-010)
*/

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, Suspense } from "react";
import { renderHook } from "@testing-library/react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Import Target Files
// ---------------------------------------------------------------------------
import PoolsPage from "@/app/dashboard/pools/page";
import {
  usePool,
  useCreatePool,
  useUpdatePool,
  usePoolById,
} from "@/lib/api/service/pools/usePool";
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

// Mock usePool hooks
jest.mock("@/lib/api/service/pools/usePool", () => ({
  usePool: jest.fn(),
  useCreatePool: jest.fn(),
  useUpdatePool: jest.fn(),
  usePoolById: jest.fn(),
}));

// Mock payload builders
jest.mock("@/lib/utils/payload-build", () => ({
  buildPayloadCreate: jest.fn((data: any) => data),
  buildPayloadEdit: jest.fn((data: any) => data),
}));

// Mock @tanstack/react-query's useQueryClient
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));

// Mocking the Combobox component
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

// Mock the DataTable component
jest.mock("@/components/data-table/data-table", () => ({
  DataTable: ({ data }: any) => (
    <div data-testid="data-table">
      {data.map((item: any) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  ),
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

// Mock ButtonEditColumn
jest.mock("@/components/button-column/button-edit-column", () => ({
  __esModule: true,
  default: () => <span data-testid="btn-edit">Edit</span>,
}));

// Mock table skeleton
jest.mock("@/components/sekeleton/table-skeleton", () => ({
  __esModule: true,
  default: () => <div data-testid="table-skeleton" />,
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/dashboard/pools"),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// ---------------------------------------------------------------------------
// Test Suites
// ---------------------------------------------------------------------------

describe("Kolam Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * UT-011-Kolam | pools/page.tsx | Render Halaman Kolam
   * ======================================================================== */
  it("UT-011-Kolam: Halaman Kolam muncul dengan benar tanpa crash", () => {
    (useCreatePool as jest.Mock).mockReturnValue({ isPending: false });
    (useUpdatePool as jest.Mock).mockReturnValue({ isPending: false });
    (usePool as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: "1", name: "Kolam A", category: "growing" },
          { id: "2", name: "Kolam B", category: "quarantine" },
        ],
      },
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<PoolsPage />);

    expect(screen.getAllByText(/Kolam Budidaya/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Kolam Karantina/i).length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("card-statistic").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("default-card").length).toBeGreaterThan(0);
  });

  /* =========================================================================
   * UT-012-Kolam | usePool.ts | Request Api Post Pool
   * ======================================================================== */
  it("UT-012-Kolam: Memastikan API_CLIENT.post dipanggil 1x untuk CREATE pool dan isSuccess: true", async () => {
    const { useCreatePool: realUseCreatePool } = jest.requireActual(
      "@/lib/api/service/pools/usePool",
    );
    (useCreatePool as jest.Mock).mockImplementation(realUseCreatePool);

    const mockPoolData = {
      name: "Kolam Baru",
      category: "growing",
      length: 10,
      width: 5,
      height: 2,
    };
    const mockResponse = {
      data: { id: "new-pool-id", ...mockPoolData },
    };

    (API_CLIENT.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCreatePool(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(mockPoolData as any);
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.post).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.post).toHaveBeenCalledWith(
      API_ENDPOINTS.POOLS.CREATE,
      mockPoolData,
    );
  });

  /* =========================================================================
   * UT-013-Kolam | usePool.ts | Request Api Put Pool
   * ======================================================================== */
  it("UT-013-Kolam: Memastikan API_CLIENT.put dipanggil 1x untuk UPDATE pool dan isSuccess: true", async () => {
    const { useUpdatePool: realUseUpdatePool } = jest.requireActual(
      "@/lib/api/service/pools/usePool",
    );
    (useUpdatePool as jest.Mock).mockImplementation(realUseUpdatePool);

    const poolId = "pool-update-1";
    const mockPoolData = {
      name: "Update Kolam",
      category: "breeding",
      diameter: 10,
      height: 3,
    };
    const mockResponse = { data: { id: poolId, ...mockPoolData } };

    (API_CLIENT.put as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUpdatePool(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        id: poolId,
        data: mockPoolData,
      } as any);
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.put).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.put).toHaveBeenCalledWith(
      API_ENDPOINTS.POOLS.UPDATE(poolId),
      mockPoolData,
    );
  });

  /* =========================================================================
   * UT-014-Kolam | usePool.ts | Handling API Error saat Tambah Kolam
   * ======================================================================== */
  it("UT-014-Kolam: Handling API Error saat Tambah Kolam (state isError: true)", async () => {
    const { useCreatePool: realUseCreatePool } = jest.requireActual(
      "@/lib/api/service/pools/usePool",
    );
    (useCreatePool as jest.Mock).mockImplementation(realUseCreatePool);

    (API_CLIENT.post as jest.Mock).mockRejectedValueOnce(
      new Error("Internal Server Error"),
    );

    const { result } = renderHook(() => useCreatePool(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: "Kolam Gagal",
          category: "growing",
        } as any);
      } catch (e) {
        // expected to throw an error
      }
    });

    await waitFor(() => result.current.isError);

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Internal Server Error");
  });

  /* =========================================================================
   * UT-015-Kolam | usePool.ts | Handling API Error saat Edit Kolam
   * ======================================================================== */
  it("UT-015-Kolam: Handling API Error saat Edit Kolam (state isError: true)", async () => {
    const { useUpdatePool: realUseUpdatePool } = jest.requireActual(
      "@/lib/api/service/pools/usePool",
    );
    (useUpdatePool as jest.Mock).mockImplementation(realUseUpdatePool);

    (API_CLIENT.put as jest.Mock).mockRejectedValueOnce(
      new Error("500 Internal Server Error"),
    );

    const { result } = renderHook(() => useUpdatePool(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          id: "1",
          data: { name: "Kolam Error" },
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

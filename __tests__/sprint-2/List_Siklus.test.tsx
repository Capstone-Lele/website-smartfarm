/* 
Description: 
- Testing List Siklus (Cycle)
*/

import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { renderHook } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Import Target Files
// ---------------------------------------------------------------------------
import CyclePage from "@/app/dashboard/pools/[poolId]/page";
import { useListCycle } from "@/lib/api/service/cycles/useCycle";
import { usePoolById } from "@/lib/api/service/pools/usePool";
import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

// Mock API Client
jest.mock("@/lib/api/client", () => ({
  API_CLIENT: {
    get: jest.fn(),
  },
}));

// Mock hooks
jest.mock("@/lib/api/service/cycles/useCycle", () => ({
  useListCycle: jest.fn(),
}));

jest.mock("@/lib/api/service/pools/usePool", () => ({
  usePoolById: jest.fn(),
}));

jest.mock("@/lib/store/useBreadcrumbStore", () => ({
  useBreadcrumbStore: () => ({
    setLabel: jest.fn(),
    removeLabel: jest.fn(),
  }),
}));

jest.mock("@/lib/hooks/useSubNavbarTab", () => ({
  __esModule: true,
  default: () => ({
    setTabComponent: jest.fn(),
  }),
}));

jest.mock("@/app/dashboard/pools/_components/detail-pool-nav-tabs", () => ({
  __esModule: true,
  default: () => <div data-testid="detail-pool-nav-tabs" />,
}));

// Mock React Query
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));

// Mock Components
jest.mock("@/components/data-table/data-table", () => ({
  DataTable: ({ data }: any) => (
    <div data-testid="data-table">
      {data?.map((item: any) => (
        <div key={item.id} data-testid="data-table-row">
          {item.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/card/default-card", () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="default-card">{children}</div>
  ),
}));

const queryClientConfig = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClientConfig}>
    {children}
  </QueryClientProvider>
);

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

// ---------------------------------------------------------------------------
// Test Suites
// ---------------------------------------------------------------------------

describe("List Siklus Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * Test 1: Render Komponen / UI
   * ======================================================================== */
  it("Render Halaman List Cycle: Halaman pengguna muncul dengan benar tanpa crash", async () => {
    (usePoolById as jest.Mock).mockReturnValue({
      data: { name: "Kolam Pembesaran" },
    });

    (useListCycle as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: "1", name: "Siklus A" },
          { id: "2", name: "Siklus B" },
        ],
      },
      isLoading: false,
      error: null,
    });

    const mockParams = Promise.resolve({ poolId: "pool-123" });

    await act(async () => {
      renderWithQueryClient(<CyclePage params={mockParams} />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("default-card")).toBeInTheDocument();
      expect(screen.getByTestId("data-table")).toBeInTheDocument();
      expect(screen.getByText("Siklus A")).toBeInTheDocument();
      expect(screen.getAllByTestId("data-table-row").length).toBe(2);
    });
  });

  /* =========================================================================
   * Test 2: (Positive) Validasi Request API (Hook TanStack)
   * ======================================================================== */
  it("Request Api Get Cycle (Positive): API_CLIENT.get dipanggil dengan Endpoint yang sesuai dan isSuccess: true", async () => {
    const { useListCycle: realUseListCycle } = jest.requireActual(
      "@/lib/api/service/cycles/useCycle",
    );
    (useListCycle as jest.Mock).mockImplementation(realUseListCycle);

    const mockResponse = {
      data: [{ id: "1", name: "Siklus Dummy" }],
    };

    (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const poolId = "pool-abc";
    const { result } = renderHook(() => useListCycle(poolId), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.get).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.get).toHaveBeenCalledWith(
      API_ENDPOINTS.CYCLES.GET_ALL_BY_ID(poolId),
    );
  });

  /* =========================================================================
   * Test 3: (Negative) Validasi Response Error via API Hook
   * ======================================================================== */
  it("Request Api Get Cycle (Negative): Penanganan status isError: true ketika Request digagalkan", async () => {
    const { useListCycle: realUseListCycle } = jest.requireActual(
      "@/lib/api/service/cycles/useCycle",
    );
    (useListCycle as jest.Mock).mockImplementation(realUseListCycle);

    (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(
      new Error("Data siklus tidak ditemukan"),
    );

    const poolId = "pool-error";
    const { result } = renderHook(() => useListCycle(poolId), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Data siklus tidak ditemukan");
  });
});

/*
Description:
- Testing Laporan Panen sesuai Test Case Document (UT-078 - UT-080)
*/

import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { renderHook } from "@testing-library/react";
import { act } from "react";

// ---------------------------------------------------------------------------
// Import Target Files
// ---------------------------------------------------------------------------
import HarvestPage from "@/app/dashboard/reports/harvest/page";
import { useListHarvest } from "@/lib/api/service/notes/harvest/useHarvest";
import { usePool } from "@/lib/api/service/pools/usePool";
import { useGetUsers } from "@/lib/api/service/users/useUser";
import { useListCycle } from "@/lib/api/service/cycles/useCycle";
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
jest.mock("@/lib/api/service/notes/harvest/useHarvest", () => ({
  useListHarvest: jest.fn(),
}));
jest.mock("@/lib/api/service/pools/usePool", () => ({
  usePool: jest.fn(),
}));
jest.mock("@/lib/api/service/users/useUser", () => ({
  useGetUsers: jest.fn(),
}));
jest.mock("@/lib/api/service/cycles/useCycle", () => ({
  useListCycle: jest.fn(),
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
          {item.notes}
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

jest.mock(
  "@/app/dashboard/reports/harvest/_components/harvest-overview",
  () => ({
    HarvestOverview: () => <div data-testid="harvest-overview" />,
  }),
);

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

const renderWithQueryClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClientConfig}>
      <Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>
    </QueryClientProvider>,
  );
};

// ---------------------------------------------------------------------------
// Test Suites
// ---------------------------------------------------------------------------

describe("Laporan Panen Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * UT-078-Laporan Panen | reports/harvest/page.tsx | Render Halaman
   * ======================================================================== */
  it("UT-078-Laporan Panen: Halaman pengguna muncul dengan benar tanpa crash", async () => {
    (useListHarvest as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: "1", date: "2026-05-30T12:00:00Z", notes: "Catatan Panen A", poolId: "1", cycleId: "1", userId: "1" },
          { id: "2", date: "2026-05-30T13:00:00Z", notes: "Catatan Panen B", poolId: "1", cycleId: "1", userId: "1" },
        ],
      },
      isLoading: false,
      error: null,
    });

    (usePool as jest.Mock).mockReturnValue({ data: { data: [] } });
    (useGetUsers as jest.Mock).mockReturnValue({ data: { data: [] } });
    (useListCycle as jest.Mock).mockReturnValue({ data: { data: [] } });

    await act(async () => {
      renderWithQueryClient(<HarvestPage />);
    });

    // Locate the tab trigger you want to click
    const nextTab = screen.queryByRole("tab", { name: /Data Tabel/i });

    if (nextTab) {
      fireEvent.mouseDown(nextTab);
    }

    await waitFor(() => {
      expect(screen.getAllByTestId("default-card").length).toBeGreaterThan(0);
      expect(screen.getByTestId("data-table")).toBeInTheDocument();
      expect(screen.getByText("Catatan Panen A")).toBeInTheDocument();
      expect(screen.getAllByTestId("data-table-row").length).toBeGreaterThan(0);
    });
  });

  /* =========================================================================
   * UT-079-Laporan Panen | useHarvest.ts | Request Api Get Harvest (Positive)
   * ======================================================================== */
  it("UT-079-Laporan Panen: API_CLIENT.get dipanggil dengan Endpoint yang sesuai dan isSuccess: true", async () => {
    const { useListHarvest: realUseListHarvest } = jest.requireActual(
      "@/lib/api/service/notes/harvest/useHarvest",
    );
    (useListHarvest as jest.Mock).mockImplementation(realUseListHarvest);

    const mockResponse = {
      data: [{ id: "1", notes: "Catatan Panen C" }],
    };

    (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useListHarvest(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.get).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.get).toHaveBeenCalledWith(
      API_ENDPOINTS.HARVEST_NOTES.GET_ALL,
    );
  });

  /* =========================================================================
   * UT-080-Laporan Panen | useHarvest.ts | Request Api Get Harvest (Negative)
   * ======================================================================== */
  it("UT-080-Laporan Panen: Penanganan status isError: true ketika Request digagalkan", async () => {
    const { useListHarvest: realUseListHarvest } = jest.requireActual(
      "@/lib/api/service/notes/harvest/useHarvest",
    );
    (useListHarvest as jest.Mock).mockImplementation(realUseListHarvest);

    (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(
      new Error("Data panen tidak ditemukan"),
    );

    const { result } = renderHook(() => useListHarvest(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Data panen tidak ditemukan");
  });
});

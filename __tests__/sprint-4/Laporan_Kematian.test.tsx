/* 
Description: 
- Testing Laporan Kematian
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
import MortalityPage from "@/app/dashboard/reports/mortality/page";
import { useListMortality } from "@/lib/api/service/notes/mortality/useMortality";
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
jest.mock("@/lib/api/service/notes/mortality/useMortality", () => ({
  useListMortality: jest.fn(),
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
  "@/app/dashboard/reports/mortality/_components/mortality-overview",
  () => ({
    MortalityOverview: () => <div data-testid="mortality-overview" />,
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

describe("Laporan Kematian Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * Test 1: Render Halaman Laporan Kematian
   * ======================================================================== */
  it("Render Halaman Laporan Kematian: Halaman pengguna muncul dengan benar tanpa crash", async () => {
    (useListMortality as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: "1", reportDate: "2026-05-30T12:00:00Z", notes: "Catatan Kematian A", poolId: "1", cycleId: "1", userId: "1" },
          { id: "2", reportDate: "2026-05-30T13:00:00Z", notes: "Catatan Kematian B", poolId: "1", cycleId: "1", userId: "1" },
        ],
      },
      isLoading: false,
      error: null,
    });

    (usePool as jest.Mock).mockReturnValue({ data: { data: [] } });
    (useGetUsers as jest.Mock).mockReturnValue({ data: { data: [] } });
    (useListCycle as jest.Mock).mockReturnValue({ data: { data: [] } });

    await act(async () => {
      renderWithQueryClient(<MortalityPage />);
    });

    // Locate the tab trigger you want to click
    const nextTab = screen.queryByRole("tab", { name: /Data Tabel/i });

    if (nextTab) {
      fireEvent.mouseDown(nextTab);
    }

    await waitFor(() => {
      expect(screen.getAllByTestId("default-card").length).toBeGreaterThan(0);
      expect(screen.getByTestId("data-table")).toBeInTheDocument();
      expect(screen.getByText("Catatan Kematian A")).toBeInTheDocument();
      expect(screen.getAllByTestId("data-table-row").length).toBeGreaterThan(0);
    });
  });

  /* =========================================================================
   * Test 2: (Positive) Validasi Request API Get Mortality
   * ======================================================================== */
  it("Request Api Get Mortality (Positive): API_CLIENT.get dipanggil dengan Endpoint yang sesuai dan isSuccess: true", async () => {
    const { useListMortality: realUseListMortality } = jest.requireActual(
      "@/lib/api/service/notes/mortality/useMortality",
    );
    (useListMortality as jest.Mock).mockImplementation(realUseListMortality);

    const mockResponse = {
      data: [{ id: "1", notes: "Catatan Kematian C" }],
    };

    (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useListMortality(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.get).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.get).toHaveBeenCalledWith(
      API_ENDPOINTS.MORTALITY_NOTES.GET_ALL,
    );
  });

  /* =========================================================================
   * Test 3: (Negative) Validasi Response Error API Get Mortality
   * ======================================================================== */
  it("Request Api Get Mortality (Negative): Penanganan status isError: true ketika Request digagalkan", async () => {
    const { useListMortality: realUseListMortality } = jest.requireActual(
      "@/lib/api/service/notes/mortality/useMortality",
    );
    (useListMortality as jest.Mock).mockImplementation(realUseListMortality);

    (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(
      new Error("Data kematian tidak ditemukan"),
    );

    const { result } = renderHook(() => useListMortality(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Data kematian tidak ditemukan");
  });
});

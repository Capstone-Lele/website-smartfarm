/* 
Description: 
- Testing Laporan Pindah Kolam (Move Notes)
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
import MovePage from "@/app/dashboard/reports/move/page";
import { useListMove } from "@/lib/api/service/notes/move/useMove";
import { usePool } from "@/lib/api/service/pools/usePool";
import { useGetUsers } from "@/lib/api/service/users/useUser";
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
jest.mock("@/lib/api/service/notes/move/useMove", () => ({
  useListMove: jest.fn(),
}));
jest.mock("@/lib/api/service/pools/usePool", () => ({
  usePool: jest.fn(),
}));
jest.mock("@/lib/api/service/users/useUser", () => ({
  useGetUsers: jest.fn(),
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

describe("Laporan Pindah Kolam Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * Test 1: Render Halaman Laporan Pindah Kolam
   * ======================================================================== */
  it("Render Halaman Laporan Pindah Kolam: Halaman pengguna muncul dengan benar tanpa crash", async () => {
    (useListMove as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: "1", notes: "Catatan Pindah Kolam A" },
          { id: "2", notes: "Catatan Pindah Kolam B" },
        ],
      },
      isLoading: false,
      error: null,
    });

    (usePool as jest.Mock).mockReturnValue({ data: { data: [] } });
    (useGetUsers as jest.Mock).mockReturnValue({ data: { data: [] } });

    await act(async () => {
      renderWithQueryClient(<MovePage />);
    });

    // Locate the tab trigger you want to click (if any tabs exist, otherwise we just test the table)
    const nextTab = screen.queryByRole("tab", { name: /Data Tabel/i });
    if (nextTab) {
      fireEvent.mouseDown(nextTab);
    }

    await waitFor(() => {
      expect(screen.getAllByTestId("default-card").length).toBeGreaterThan(0);
      expect(screen.getByTestId("data-table")).toBeInTheDocument();
      expect(screen.getByText("Catatan Pindah Kolam A")).toBeInTheDocument();
      expect(screen.getAllByTestId("data-table-row").length).toBeGreaterThan(0);
    });
  });

  /* =========================================================================
   * Test 2: (Positive) Validasi Request API Get Pindah Kolam
   * ======================================================================== */
  it("Request Api Get Pindah Kolam (Positive): API_CLIENT.get dipanggil dengan Endpoint yang sesuai dan isSuccess: true", async () => {
    const { useListMove: realUseListMove } = jest.requireActual(
      "@/lib/api/service/notes/move/useMove",
    );
    (useListMove as jest.Mock).mockImplementation(realUseListMove);

    const mockResponse = {
      data: [{ id: "1", notes: "Catatan Pindah Kolam C" }],
    };

    (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useListMove(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.get).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.get).toHaveBeenCalledWith(
      API_ENDPOINTS.MOVE_NOTES.GET_ALL,
    );
  });

  /* =========================================================================
   * Test 3: (Negative) Validasi Response Error API Get Pindah Kolam
   * ======================================================================== */
  it("Request Api Get Pindah Kolam (Negative): Penanganan status isError: true ketika Request digagalkan", async () => {
    const { useListMove: realUseListMove } = jest.requireActual(
      "@/lib/api/service/notes/move/useMove",
    );
    (useListMove as jest.Mock).mockImplementation(realUseListMove);

    (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(
      new Error("Data pindah kolam tidak ditemukan"),
    );

    const { result } = renderHook(() => useListMove(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Data pindah kolam tidak ditemukan");
  });
});

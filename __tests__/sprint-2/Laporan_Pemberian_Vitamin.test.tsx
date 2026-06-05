/* 
Description: 
- Testing Laporan Pemberian Vitamin (Vitamin Notes)
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
import VitaminPage from "@/app/dashboard/reports/vitamin/page";
import { useListVitamin } from "@/lib/api/service/notes/vitamin/useVitamin";
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
jest.mock("@/lib/api/service/notes/vitamin/useVitamin", () => ({
  useListVitamin: jest.fn(),
}));

jest.mock("@/lib/api/service/pools/usePool", () => ({
  usePool: jest.fn().mockReturnValue({ data: { data: [] } }),
}));
jest.mock("@/lib/api/service/users/useUser", () => ({
  useGetUsers: jest.fn().mockReturnValue({ data: { data: [] } }),
}));
jest.mock("@/lib/api/service/cycles/useCycle", () => ({
  useListCycle: jest.fn().mockReturnValue({ data: { data: [] } }),
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

describe("Laporan Pemberian Vitamin Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * Test 1: Render Halaman Laporan Vitamin
   * ======================================================================== */
  it("Render Halaman Laporan Vitamin: Halaman pengguna muncul dengan benar tanpa crash", async () => {
    (useListVitamin as jest.Mock).mockReturnValue({
      data: {
        data: [
          {
            id: "1",
            notes: "Catatan Vitamin A",
            createdAt: "2024-01-01T00:00:00.000Z",
            quantity: "10",
          },
          {
            id: "2",
            notes: "Catatan Vitamin B",
            createdAt: "2024-01-02T00:00:00.000Z",
            quantity: "15",
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    await act(async () => {
      renderWithQueryClient(<VitaminPage />);
    });

    // Locate the tab trigger you want to click
    const nextTab = screen.getByRole("tab", { name: /Data Tabel/i });

    // Use mouseDown to trigger the Radix UI internal event
    fireEvent.mouseDown(nextTab);

    await waitFor(() => {
      expect(screen.getAllByTestId("default-card").length).toBeGreaterThan(0);
      expect(screen.getByTestId("data-table")).toBeInTheDocument();
      expect(screen.getByText("Catatan Vitamin A")).toBeInTheDocument();
      expect(screen.getAllByTestId("data-table-row").length).toBeGreaterThan(0);
    });
  });

  /* =========================================================================
   * Test 2: (Positive) Validasi Request API Get Vitamin
   * ======================================================================== */
  it("Request Api Get Vitamin (Positive): API_CLIENT.get dipanggil dengan Endpoint yang sesuai dan isSuccess: true", async () => {
    const { useListVitamin: realUseListVitamin } = jest.requireActual(
      "@/lib/api/service/notes/vitamin/useVitamin",
    );
    (useListVitamin as jest.Mock).mockImplementation(realUseListVitamin);

    const mockResponse = {
      data: [{ id: "1", notes: "Vitamin C" }],
    };

    (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useListVitamin(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.get).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.get).toHaveBeenCalledWith(
      API_ENDPOINTS.VITAMIN_NOTES.GET_ALL,
    );
  });

  /* =========================================================================
   * Test 3: (Negative) Validasi Response Error API Get Vitamin
   * ======================================================================== */
  it("Request Api Get Vitamin (Negative): Penanganan status isError: true ketika Request digagalkan", async () => {
    const { useListVitamin: realUseListVitamin } = jest.requireActual(
      "@/lib/api/service/notes/vitamin/useVitamin",
    );
    (useListVitamin as jest.Mock).mockImplementation(realUseListVitamin);

    (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(
      new Error("Data vitamin tidak ditemukan"),
    );

    const { result } = renderHook(() => useListVitamin(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Data vitamin tidak ditemukan");
  });
});

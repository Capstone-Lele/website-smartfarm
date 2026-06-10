/*
Description:
- Testing Laporan Pemberian Pakan (Feed Notes) sesuai Test Case Document (UT-037 - UT-039)
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
import FeedingPage from "@/app/dashboard/reports/(feeding)/page";
import { useListFeed } from "@/lib/api/service/notes/feed/useFeed";
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
jest.mock("@/lib/api/service/notes/feed/useFeed", () => ({
  useListFeed: jest.fn(),
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
  "@/app/dashboard/reports/(feeding)/_components/feeding-overview",
  () => ({
    FeedingOverview: () => <div data-testid="feeding-overview" />,
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

describe("Laporan Pemberian Pakan Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * UT-037-Laporan Pakan | reports/(feeding)/page.tsx | Render Halaman Laporan Pakan
   * ======================================================================== */
  // it("UT-037-Laporan Pakan: Halaman pengguna muncul dengan benar tanpa crash", async () => {
  //   (useListFeed as jest.Mock).mockReturnValue({
  //     data: {
  //       data: [
  //         { id: "1", notes: "Catatan Pakan A" },
  //         { id: "2", notes: "Catatan Pakan B" },
  //       ],
  //     },
  //     isLoading: false,
  //     error: null,
  //   });

  //   (usePool as jest.Mock).mockReturnValue({ data: { data: [] } });
  //   (useGetUsers as jest.Mock).mockReturnValue({ data: { data: [] } });
  //   (useListCycle as jest.Mock).mockReturnValue({ data: { data: [] } });

  //   await act(async () => {
  //     renderWithQueryClient(<FeedingPage />);
  //   });

  //   // Locate the tab trigger you want to click
  //   const nextTab = screen.getByRole("tab", { name: /Data Tabel/i });

  //   // Use mouseDown to trigger the Radix UI internal event
  //   fireEvent.mouseDown(nextTab);

  //   await waitFor(() => {
  //     expect(screen.getAllByTestId("default-card").length).toBeGreaterThan(0);
  //     expect(screen.getByTestId("data-table")).toBeInTheDocument();
  //     expect(screen.getByText("Catatan Pakan A")).toBeInTheDocument();
  //     expect(screen.getAllByTestId("data-table-row").length).toBeGreaterThan(0);
  //   });
  // });

  /* =========================================================================
   * UT-035-Laporan Pakan | useFeed.ts | Request Api Get Pakan (Positive)
   * ======================================================================== */
  it("UT-035-Laporan Pakan: API_CLIENT.get dipanggil dengan Endpoint yang sesuai dan isSuccess: true", async () => {
    const { useListFeed: realUseListFeed } = jest.requireActual(
      "@/lib/api/service/notes/feed/useFeed",
    );
    (useListFeed as jest.Mock).mockImplementation(realUseListFeed);

    const mockResponse = {
      data: [{ id: "1", notes: "Pakan C" }],
    };

    (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useListFeed(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.get).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.get).toHaveBeenCalledWith(
      API_ENDPOINTS.FEED_NOTES.GET_ALL,
    );
  });

  /* =========================================================================
   * UT-036-Laporan Pakan | useFeed.ts | Request Api Get Pakan (Negative)
   * ======================================================================== */
  it("UT-036-Laporan Pakan: Penanganan status isError: true ketika Request digagalkan", async () => {
    const { useListFeed: realUseListFeed } = jest.requireActual(
      "@/lib/api/service/notes/feed/useFeed",
    );
    (useListFeed as jest.Mock).mockImplementation(realUseListFeed);

    (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(
      new Error("Data pakan tidak ditemukan"),
    );

    const { result } = renderHook(() => useListFeed(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Data pakan tidak ditemukan");
  });
});

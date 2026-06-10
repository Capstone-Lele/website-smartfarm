/*
Description:
- Testing Laporan Sampling sesuai Test Case Document (UT-044 - UT-046)
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
import SamplingPage from "@/app/dashboard/reports/sampling/page";
import { useListSampling } from "@/lib/api/service/notes/sampling/useSampling";
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
jest.mock("@/lib/api/service/notes/sampling/useSampling", () => ({
  useListSampling: jest.fn(),
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
  "@/app/dashboard/reports/sampling/_components/sampling-overview",
  () => ({
    __esModule: true,
    default: () => <div data-testid="sampling-overview" />,
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

describe("Laporan Sampling Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * UT-044-Laporan Sampling | reports/sampling/page.tsx | Render Halaman
   * ======================================================================== */
  // it("UT-044-Laporan Sampling: Halaman pengguna muncul dengan benar tanpa crash", async () => {
  //   (useListSampling as jest.Mock).mockReturnValue({
  //     data: {
  //       data: [
  //         { id: "1", notes: "Catatan Sampling A" },
  //         { id: "2", notes: "Catatan Sampling B" },
  //       ],
  //     },
  //     isLoading: false,
  //     error: null,
  //   });

  //   (usePool as jest.Mock).mockReturnValue({ data: { data: [] } });
  //   (useGetUsers as jest.Mock).mockReturnValue({ data: { data: [] } });
  //   (useListCycle as jest.Mock).mockReturnValue({ data: { data: [] } });

  //   await act(async () => {
  //     renderWithQueryClient(<SamplingPage />);
  //   });

  //   // Locate the tab trigger you want to click
  //   const nextTab = screen.queryByRole("tab", { name: /Data Tabel/i });

  //   if (nextTab) {
  //     fireEvent.mouseDown(nextTab);
  //   }

  //   await waitFor(() => {
  //     expect(screen.getAllByTestId("default-card").length).toBeGreaterThan(0);
  //     expect(screen.getByTestId("data-table")).toBeInTheDocument();
  //     expect(screen.getByText("Catatan Sampling A")).toBeInTheDocument();
  //     expect(screen.getAllByTestId("data-table-row").length).toBeGreaterThan(0);
  //   });
  // });

  /* =========================================================================
   * UT-043-Laporan Sampling | useSampling.ts | Request Api Get (Positive)
   * ======================================================================== */
  it("UT-043-Laporan Sampling: API_CLIENT.get dipanggil dengan Endpoint yang sesuai dan isSuccess: true", async () => {
    const { useListSampling: realUseListSampling } = jest.requireActual(
      "@/lib/api/service/notes/sampling/useSampling",
    );
    (useListSampling as jest.Mock).mockImplementation(realUseListSampling);

    const mockResponse = {
      data: [{ id: "1", notes: "Catatan Sampling C" }],
    };

    (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useListSampling(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.get).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.get).toHaveBeenCalledWith(
      API_ENDPOINTS.SAMPLING_NOTES.GET_ALL,
    );
  });

  /* =========================================================================
   * UT-044-Laporan Sampling | useSampling.ts | Request Api Get (Negative)
   * ======================================================================== */
  it("UT-044-Laporan Sampling: Penanganan status isError: true ketika Request digagalkan", async () => {
    const { useListSampling: realUseListSampling } = jest.requireActual(
      "@/lib/api/service/notes/sampling/useSampling",
    );
    (useListSampling as jest.Mock).mockImplementation(realUseListSampling);

    (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(
      new Error("Data sampling tidak ditemukan"),
    );

    const { result } = renderHook(() => useListSampling(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Data sampling tidak ditemukan");
  });
});

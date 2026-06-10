/*
Description:
- Testing Laporan Alat IoT sesuai Test Case Document (UT-069 - UT-071)
*/

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { renderHook } from "@testing-library/react";
import { act } from "react";

// ---------------------------------------------------------------------------
// Import Target Files
// ---------------------------------------------------------------------------
import IotPage from "@/app/dashboard/reports/iot/page";
import { useIot } from "@/lib/api/service/iot/useIot";
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
jest.mock("@/lib/api/service/iot/useIot", () => ({
  useIot: jest.fn(),
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
        <div key={item.node_id} data-testid="data-table-row">
          {item.createdAt}
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
  "@/app/dashboard/reports/iot/_components/iot-overview",
  () => ({
    IotOverview: () => <div data-testid="iot-overview" />,
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

describe("Laporan Alat IoT Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * UT-069-Laporan Alat IoT | reports/iot/page.tsx | Render Halaman
   * ======================================================================== */
  it("UT-069-Laporan Alat IoT: Halaman pengguna muncul dengan benar tanpa crash", async () => {
    (useIot as jest.Mock).mockReturnValue({
      data: [
        { node_id: "1", ph: 7.2, temp: 28.5, createdAt: "2026-05-30T12:00:00Z" },
        { node_id: "2", ph: 6.8, temp: 27.9, createdAt: "2026-05-30T13:00:00Z" },
      ],
      isLoading: false,
      error: null,
    });

    await act(async () => {
      renderWithQueryClient(<IotPage />);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId("default-card").length).toBeGreaterThan(0);
      expect(screen.getByTestId("iot-overview")).toBeInTheDocument();
    });
  });

  /* =========================================================================
   * UT-070-Laporan Alat IoT | useIot.ts | Request Api Get IoT (Positive)
   * ======================================================================== */
  it("UT-070-Laporan Alat IoT: API_CLIENT.get dipanggil dengan Endpoint yang sesuai dan isSuccess: true", async () => {
    const { useIot: realUseIot } = jest.requireActual(
      "@/lib/api/service/iot/useIot",
    );
    (useIot as jest.Mock).mockImplementation(realUseIot);

    const mockResponse = {
      data: [{ node_id: "1", createdAt: "2026-05-30T12:00:00Z" }],
    };

    (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useIot(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.get).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.get).toHaveBeenCalledWith(
      API_ENDPOINTS.IOT.GET_ALL,
    );
  });

  /* =========================================================================
   * UT-071-Laporan Alat IoT | useIot.ts | Request Api Get IoT (Negative)
   * ======================================================================== */
  it("UT-071-Laporan Alat IoT: Penanganan status isError: true ketika Request digagalkan", async () => {
    const { useIot: realUseIot } = jest.requireActual(
      "@/lib/api/service/iot/useIot",
    );
    (useIot as jest.Mock).mockImplementation(realUseIot);

    (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(
      new Error("Data IOT tidak ditemukan"),
    );

    const { result } = renderHook(() => useIot(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Data IOT tidak ditemukan");
  });
});

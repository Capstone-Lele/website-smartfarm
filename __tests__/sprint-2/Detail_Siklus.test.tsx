/* 
Description: 
- Testing Detail Siklus
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
import CycleDetailPage from "@/app/dashboard/pools/[poolId]/[cycleId]/page";
import { usePoolById } from "@/lib/api/service/pools/usePool";
import { useDetailCycle } from "@/lib/api/service/cycles/useCycle";
import { API_CLIENT } from "@/lib/api/client";

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

jest.mock("next/navigation", () => ({
  useParams: () => ({ poolId: "1", cycleId: "1" }),
}));

// Mock API Client
jest.mock("@/lib/api/client", () => ({
  API_CLIENT: {
    get: jest.fn(),
  },
}));

// Mock hooks
jest.mock("@/lib/api/service/pools/usePool", () => ({
  usePoolById: jest.fn(),
}));

jest.mock("@/lib/api/service/cycles/useCycle", () => ({
  useDetailCycle: jest.fn(),
}));

jest.mock("@/lib/api/service/iot/useIot", () => ({
  useIotByNode: jest.fn().mockReturnValue({ data: null, isLoading: false }),
  useIotLiveByNode: jest.fn().mockReturnValue({ data: null, isLoading: false }),
}));

jest.mock("@/lib/store/useBreadcrumbStore", () => ({
  useBreadcrumbStore: () => ({
    setLabel: jest.fn(),
    removeLabel: jest.fn(),
  }),
}));

// Mock Data Table
jest.mock("@/components/data-table/data-table", () => ({
  DataTable: ({ data }: any) => (
    <div data-testid="data-table">
      {data?.map((item: any) => (
        <div key={item.id} data-testid="data-table-row">
          {item.id}
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

jest.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: any) => <div data-testid="tabs">{children}</div>,
  TabsList: ({ children }: any) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({ children }: any) => <button>{children}</button>,
  TabsContent: ({ children }: any) => (
    <div data-testid="tabs-content">{children}</div>
  ),
}));

// Mock Next/Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Recharts
jest.mock("recharts", () => {
  const OriginalRechartsModule = jest.requireActual("recharts");
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: "100%", height: 300 }}>{children}</div>
    ),
  };
});

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

describe("Detail Siklus Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * Test 1: Render Halaman Detail Siklus
   * ======================================================================== */
  it("Render Halaman Detail Siklus: Halaman muncul dengan benar", async () => {
    (usePoolById as jest.Mock).mockReturnValue({
      data: {
        name: "Kolam A1",
        category: "Nursery",
        diameter: 5,
        height: 1,
        actor: [],
      },
    });

    (useDetailCycle as jest.Mock).mockReturnValue({
      data: {
        data: [
          {
            id: "1",
            condition: "Baik",
            startDate: "2024-01-01T00:00:00Z",
            endDate: "2024-02-01T00:00:00Z",
            initialQuantity: 1000,
            currentQuantity: 950,
          },
        ],
      },
    });

    await act(async () => {
      renderWithQueryClient(<CycleDetailPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Profil Siklus")).toBeInTheDocument();
      expect(screen.getByText("Detail Kolam")).toBeInTheDocument();
      expect(screen.getByText("Kolam A1")).toBeInTheDocument();
    });
  });

  /* =========================================================================
   * Test 2: (Positive) Validasi Request API Get Detail Cycle
   * ======================================================================== */
  it("Request Api Get Detail Cycle (Positive)", async () => {
    const { useDetailCycle: realUseDetailCycle } = jest.requireActual(
      "@/lib/api/service/cycles/useCycle",
    );
    (useDetailCycle as jest.Mock).mockImplementation(realUseDetailCycle);

    const mockResponse = {
      data: [{ id: "1", condition: "Baik" }],
    };

    (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useDetailCycle("1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.get).toHaveBeenCalledWith("/cycle/detail/1");
  });

  /* =========================================================================
   * Test 3: (Negative) Validasi Response Error API Get Detail Cycle
   * ======================================================================== */
  it("Request Api Get Detail Cycle (Negative)", async () => {
    const { useDetailCycle: realUseDetailCycle } = jest.requireActual(
      "@/lib/api/service/cycles/useCycle",
    );
    (useDetailCycle as jest.Mock).mockImplementation(realUseDetailCycle);

    (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(
      new Error("Gagal mengambil data siklus"),
    );

    const { result } = renderHook(() => useDetailCycle("1"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
  });
});

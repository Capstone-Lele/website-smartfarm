/*
Description:
- Testing Laporan Keuangan sesuai Test Case Document (UT-075 - UT-077)
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
import FinancePage from "@/app/dashboard/finance/page";
import { 
  useFinanceCommodity, 
  useFinanceInventory, 
  useFinanceInventorySubmission, 
  useFinanceNonInventory 
} from "@/lib/api/service/finance/useFinance";
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
jest.mock("@/lib/api/service/finance/useFinance", () => ({
  useFinanceCommodity: jest.fn(),
  useFinanceInventory: jest.fn(),
  useFinanceInventorySubmission: jest.fn(),
  useFinanceNonInventory: jest.fn(),
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

jest.mock("@/app/dashboard/finance/_components/cash-flow-chart", () => ({
  __esModule: true,
  default: () => <div data-testid="cash-flow-chart" />,
}));
jest.mock("@/app/dashboard/finance/_components/finance-pie-charts", () => ({
  __esModule: true,
  default: () => <div data-testid="finance-pie-charts" />,
}));
jest.mock("@/app/dashboard/finance/_components/transaction-count-chart", () => ({
  __esModule: true,
  default: () => <div data-testid="transaction-count-chart" />,
}));
jest.mock("@/app/dashboard/finance/_components/transaction-count-pie", () => ({
  __esModule: true,
  default: () => <div data-testid="transaction-count-pie" />,
}));
jest.mock("@/app/dashboard/finance/_commodity", () => ({
  __esModule: true,
  default: () => <div data-testid="finance-commodity" />,
}));
jest.mock("@/app/dashboard/finance/_inventory", () => ({
  __esModule: true,
  default: () => <div data-testid="finance-inventory" />,
}));
jest.mock("@/app/dashboard/finance/_inventory-submission", () => ({
  __esModule: true,
  default: () => <div data-testid="finance-inventory-submission" />,
}));
jest.mock("@/app/dashboard/finance/_non-inventory", () => ({
  __esModule: true,
  default: () => <div data-testid="finance-non-inventory" />,
}));
jest.mock("@/app/dashboard/finance/_stat-cards", () => ({
  __esModule: true,
  default: () => <div data-testid="finance-stat-cards" />,
}));
jest.mock("@/app/dashboard/finance/_report-tab", () => ({
  __esModule: true,
  default: () => <div data-testid="finance-report-tab" />,
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

describe("Laporan Keuangan Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * UT-075-Laporan Keuangan | finance/page.tsx | Render Halaman
   * ======================================================================== */
  it("UT-075-Laporan Keuangan: Halaman pengguna muncul dengan benar tanpa crash", async () => {
    (useFinanceCommodity as jest.Mock).mockReturnValue({ data: [], isLoading: false });
    (useFinanceInventory as jest.Mock).mockReturnValue({ data: [], isLoading: false });
    (useFinanceInventorySubmission as jest.Mock).mockReturnValue({ data: [], isLoading: false });
    (useFinanceNonInventory as jest.Mock).mockReturnValue({ data: [], isLoading: false });

    await act(async () => {
      renderWithQueryClient(<FinancePage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Keuangan")).toBeInTheDocument();
      expect(screen.getByTestId("finance-stat-cards")).toBeInTheDocument();
      expect(screen.getByTestId("cash-flow-chart")).toBeInTheDocument();
    });
  });

  /* =========================================================================
   * UT-076-Laporan Keuangan | useFinance.ts | Request Api Get Finance Inventory (Positive)
   * ======================================================================== */
  it("UT-076-Laporan Keuangan: API_CLIENT.get dipanggil dengan Endpoint yang sesuai dan isSuccess: true", async () => {
    const { useFinanceInventory: realUseFinanceInventory } = jest.requireActual(
      "@/lib/api/service/finance/useFinance",
    );
    (useFinanceInventory as jest.Mock).mockImplementation(realUseFinanceInventory);

    const mockResponse = {
      data: [{ id: "1", notes: "Catatan Keuangan C", transactionDate: "2026-05-30T12:00:00Z" }],
    };

    (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useFinanceInventory(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.get).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.get).toHaveBeenCalledWith(
      API_ENDPOINTS.FINANCES.GET_INVENTORY,
    );
  });

  /* =========================================================================
   * UT-077-Laporan Keuangan | useFinance.ts | Request Api Get Finance Inventory (Negative)
   * ======================================================================== */
  it("UT-077-Laporan Keuangan: Penanganan status isError: true ketika Request digagalkan", async () => {
    const { useFinanceInventory: realUseFinanceInventory } = jest.requireActual(
      "@/lib/api/service/finance/useFinance",
    );
    (useFinanceInventory as jest.Mock).mockImplementation(realUseFinanceInventory);

    (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(
      new Error("Data keuangan tidak ditemukan"),
    );

    const { result } = renderHook(() => useFinanceInventory(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Data keuangan tidak ditemukan");
  });
});

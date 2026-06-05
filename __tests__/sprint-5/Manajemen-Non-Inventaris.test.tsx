/*
Description:
- Testing Manajemen Non-Inventaris (Non-Inventory Management)
- Mencakup: Render Halaman, Hook useNonInventory, Hook useFinanceNonInventory
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
import NonInventoryPage from "@/app/dashboard/non-inventory/page";
import { useNonInventory } from "@/lib/api/service/non-inventory/useNonInventory";
import { useFinanceNonInventory } from "@/lib/api/service/finance/useFinance";
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
jest.mock("@/lib/api/service/non-inventory/useNonInventory", () => ({
  useNonInventory: jest.fn(),
}));

jest.mock("@/lib/api/service/finance/useFinance", () => ({
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
jest.mock("@/components/card/default-card", () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="default-card">{children}</div>
  ),
}));

jest.mock("@/components/card/card-statistic", () => ({
  __esModule: true,
  default: ({ title, value, icon }: any) => (
    <div data-testid="card-statistic">
      <span>{title}</span>
      <span>{value}</span>
      {icon}
    </div>
  ),
}));

jest.mock("@/components/sekeleton/table-skeleton", () => ({
  __esModule: true,
  default: () => <div data-testid="table-skeleton">Loading...</div>,
}));

jest.mock("@/components/data-table/data-table", () => ({
  DataTable: ({ data }: any) => (
    <div data-testid="data-table">
      {data?.map((item: any) => (
        <div key={item.id} data-testid="data-table-row">
          {item.notes} - Rp {item.totalPrice}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/app/dashboard/non-inventory/post", () => ({
  __esModule: true,
  default: () => <div data-testid="post-finance-modal" />,
}));

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------
const mockNonInventoryData = [
  {
    id: "non-1",
    notes: "Pembayaran Listrik",
    type: "out",
    totalPrice: 150000,
  },
  {
    id: "non-2",
    notes: "Sponsorship Event",
    type: "in",
    totalPrice: 500000,
  },
];

// ---------------------------------------------------------------------------
// Query Client Setup
// ---------------------------------------------------------------------------
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

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
describe("Manajemen Non-Inventaris Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Render Halaman Manajemen Non-Inventaris", () => {
    it("Render Halaman: Menampilkan halaman non-inventaris dengan benar beserta statistik dan tabelnya", async () => {
      (useFinanceNonInventory as jest.Mock).mockReturnValue({
        data: mockNonInventoryData,
        isLoading: false,
      });

      renderWithQueryClient(<NonInventoryPage />);

      expect(screen.getByTestId("data-table")).toBeInTheDocument();

      // Verifikasi statistik: total = 2, pemasukan = 1, pengeluaran = 1
      expect(screen.getByText("Total Transaksi")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("Pemasukan")).toBeInTheDocument();
      expect(screen.getByText("Pengeluaran")).toBeInTheDocument();
      expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Hooks: useNonInventory", () => {
    it("useNonInventory (Positive): Berhasil mengambil data detail non-inventaris dari API", async () => {
      const { useNonInventory: realHook } = jest.requireActual(
        "@/lib/api/service/non-inventory/useNonInventory"
      );
      (useNonInventory as jest.Mock).mockImplementation(realHook);
      const mockDetailResponse = {
        success: true,
        data: [mockNonInventoryData[0]],
      };
      (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockDetailResponse);

      const { result } = renderHook(() => useNonInventory("non-1"), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockDetailResponse);
      expect(API_CLIENT.get).toHaveBeenCalledWith(
        API_ENDPOINTS.NON_INVENTORY.GET_BY_ID("non-1")
      );
    });

    it("useNonInventory (Negative): Menangani status error saat API gagal", async () => {
      const { useNonInventory: realHook } = jest.requireActual(
        "@/lib/api/service/non-inventory/useNonInventory"
      );
      (useNonInventory as jest.Mock).mockImplementation(realHook);
      (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

      const { result } = renderHook(() => useNonInventory("non-1"), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe("Network Error");
    });
  });
});

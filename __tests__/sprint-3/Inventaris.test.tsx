/*
Description:
- Testing Inventaris (Inventory)
- Mencakup: Render Halaman (List & Detail), Hook useCreateInventory, Hook usePostInventoryTransaction
*/

import "@testing-library/jest-dom";
import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

// ---------------------------------------------------------------------------
// Import Target Files
// ---------------------------------------------------------------------------
import InventoryListPage from "@/app/dashboard/inventory/page";
import InventoryDetailPage from "@/app/dashboard/inventory/[id]/page";
import {
  useInventory,
  useGetInventoryByIdWithParams,
  useGetInventoryNotesByIdWithParams,
  useGetInventorySubmissionByIdWithParams,
  useGetInventoryConsumptionByIdWithParams,
  useCreateInventory,
  usePostInventoryTransaction,
} from "@/lib/api/service/inventory/useInventory";
import { useGetProductUsage, useGetProducts } from "@/lib/api/service/master-data/product/useProduct";
import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

// Mock API Client
jest.mock("@/lib/api/client", () => ({
  API_CLIENT: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock hooks
jest.mock("@/lib/api/service/inventory/useInventory", () => ({
  useInventory: jest.fn(),
  useGetInventoryByIdWithParams: jest.fn(),
  useGetInventoryNotesByIdWithParams: jest.fn(),
  useGetInventorySubmissionByIdWithParams: jest.fn(),
  useGetInventoryConsumptionByIdWithParams: jest.fn(),
  useCreateInventory: jest.fn(),
  usePostInventoryTransaction: jest.fn(),
}));

jest.mock("@/lib/api/service/master-data/product/useProduct", () => ({
  useGetProductUsage: jest.fn(),
  useGetProducts: jest.fn(),
}));

// Mock React Query
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "inv-1" }),
  usePathname: () => "/dashboard/inventory",
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock utility functions
jest.mock("@/lib/utils/format-date", () => ({
  formatDate: jest.fn((date: string) => "30 Mei 2026"),
  formatDateShort: jest.fn((date: string) => "30 Mei 2026"),
}));

jest.mock("@/lib/utils/format-number", () => ({
  formatNumber: jest.fn((num: any) => String(num)),
}));

jest.mock("@/lib/utils/payload-build", () => ({
  buildPayloadEdit: jest.fn((data: any) => data),
  buildPayloadCreate: jest.fn((data: any) => data),
}));

// Mock Components
jest.mock("@/components/card/default-card", () => ({
  __esModule: true,
  default: ({ children, className }: any) => (
    <div data-testid="default-card" className={className}>{children}</div>
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
  default: () => <div data-testid="table-skeleton">Loading table...</div>,
}));

jest.mock("@/components/date-picker/date-rage-picker", () => ({
  DatePickerWithRange: ({ label }: any) => <div data-testid="date-picker">{label}</div>,
}));

jest.mock("@/components/data-table/data-table", () => ({
  DataTable: ({ data }: any) => (
    <div data-testid="data-table">
      {data?.map((item: any) => (
        <div key={item.id} data-testid="data-table-row">
          {item.product || item.notes || "Item Row"} - {item.type || item.category || "-"}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/ui/separator", () => ({
  Separator: () => <hr />,
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children }: any) => <span>{children}</span>,
}));

jest.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children, defaultValue, className }: any) => (
    <div data-testid="tabs" data-default={defaultValue} className={className}>{children}</div>
  ),
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, value }: any) => (
    <button data-testid={`tabs-trigger-${value}`} data-value={value}>{children}</button>
  ),
  TabsContent: ({ children, value }: any) => (
    <div data-testid={`tabs-content-${value}`}>{children}</div>
  ),
}));

// Mock subcomponents
jest.mock("@/app/dashboard/inventory/_components/inventory-nav-tabs", () => ({
  __esModule: true,
  default: () => <div data-testid="inventory-nav-tabs" />,
}));

jest.mock("@/app/dashboard/inventory/post", () => ({
  __esModule: true,
  default: ({ dataInventory }: any) => <div data-testid="post-inventory-modal" />,
}));

jest.mock("@/app/dashboard/inventory/[id]/post", () => ({
  __esModule: true,
  default: () => <div data-testid="post-stock-in-out" />,
}));

jest.mock("@/app/dashboard/inventory/[id]/_components/inventory-overview", () => ({
  InventoryOverview: ({ details, currentInventory }: any) => (
    <div data-testid="inventory-overview">
      <span>Details count: {details?.length}</span>
    </div>
  ),
}));

jest.mock("@/app/dashboard/inventory/[id]/_report-tab", () => ({
  __esModule: true,
  default: ({ data, rentang_tanggal }: any) => (
    <div data-testid="inventory-report-tab">
      <span>Report data: {data?.length}</span>
    </div>
  ),
}));

jest.mock("@/app/dashboard/inventory/chart-persediaan", () => ({
  ChartBarStacked: ({ data, isLoading }: any) => (
    <div data-testid="chart-bar-stacked">
      <span>Bar data length: {data?.length}</span>
    </div>
  ),
}));

jest.mock("@/app/dashboard/inventory/chart-penggunaan", () => ({
  ChartPie: ({ data, isLoading }: any) => (
    <div data-testid="chart-pie">
      <span>Pie data length: {data?.length}</span>
    </div>
  ),
}));

jest.mock("@/lib/store/useBreadcrumbStore", () => ({
  useBreadcrumbStore: () => ({
    setLabel: jest.fn(),
    removeLabel: jest.fn(),
  }),
}));

jest.mock("@/lib/hooks/useSubNavbarTab", () => ({
  __esModule: true,
  default: () => ({
    setTabComponent: jest.fn(),
  }),
}));

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------
const mockInventoryList = {
  success: true,
  message: "Berhasil mengambil data",
  data: [
    {
      id: "inv-1",
      productId: "prod-1",
      product: "Pakan Lele A",
      totalQuantity: "100",
      minQuantity: "50",
      unit: "Kg",
      deletedAt: null,
    },
    {
      id: "inv-2",
      productId: "prod-2",
      product: "Probiotik B",
      totalQuantity: "20",
      minQuantity: "30",
      unit: "Botol",
      deletedAt: null,
    },
    {
      id: "inv-3",
      productId: "prod-3",
      product: "Vitamin C",
      totalQuantity: "0",
      minQuantity: "10",
      unit: "Pcs",
      deletedAt: null,
    },
  ],
};

const mockProductUsage = {
  success: true,
  data: [
    { name: "Pakan Lele A", value: 10 },
  ],
};

const mockInventoryDetail = {
  success: true,
  data: [
    {
      id: "inv-1",
      productId: "prod-1",
      product: "Pakan Lele A",
      totalQuantity: "100",
      minQuantity: "50",
      unit: "Kg",
      deletedAt: null,
    },
  ],
};

const mockInventoryNotes = {
  success: true,
  data: [
    {
      id: "note-1",
      notes: "Beli pakan rutin",
      type: "in",
      quantity: 50,
      pricePerItem: 10000,
      reportDate: "2026-05-30T00:00:00Z",
      transactionType: "non-grant",
      createdAt: "2026-05-30T00:00:00Z",
      updatedAt: "2026-05-30T00:00:00Z",
    },
  ],
};

const mockInventorySubmissions = {
  success: true,
  data: [
    {
      id: "sub-1",
      notes: "Pengajuan hibah pakan",
      type: "in",
      status: "approved",
      quantity: 30,
      pricePerItem: 12000,
      transactionType: "grant",
      reportDate: "2026-05-29T00:00:00Z",
      createdAt: "2026-05-29T00:00:00Z",
      updatedAt: "2026-05-29T00:00:00Z",
    },
  ],
};

const mockInventoryConsumptions = {
  success: true,
  data: [
    {
      id: "cons-1",
      notes: "Pemberian pakan kolam A",
      type: "out",
      quantity: 20,
      pricePerItem: null,
      transaction_type: "-",
      reportDate: "2026-05-28T00:00:00Z",
      createdAt: "2026-05-28T00:00:00Z",
      updatedAt: "2026-05-28T00:00:00Z",
    },
  ],
};

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
describe("Inventory Module Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================================================
  // SECTION 1: RENDER HALAMAN & GET DATA (LIST & DETAIL)
  // =========================================================================
  describe("Render Halaman & Get Data", () => {
    /* -----------------------------------------------------------------------
     * Test 1: Render Halaman List Inventaris
     * ---------------------------------------------------------------------- */
    it("Render Halaman List: Menampilkan list inventaris dengan benar beserta statistiknya", async () => {
      (useInventory as jest.Mock).mockReturnValue({
        data: mockInventoryList,
        isLoading: false,
      });
      (useGetProductUsage as jest.Mock).mockReturnValue({
        data: mockProductUsage,
        isLoading: false,
      });

      renderWithQueryClient(<InventoryListPage />);

      // Verifikasi rendering table dan mock component
      expect(screen.getByTestId("data-table")).toBeInTheDocument();
      expect(screen.getByTestId("chart-bar-stacked")).toBeInTheDocument();
      expect(screen.getByTestId("chart-pie")).toBeInTheDocument();

      // Verifikasi statistik cards
      expect(screen.getByText("Total Produk Inventaris")).toBeInTheDocument();
      expect(screen.getByText("Produk di atas Stok Minimum")).toBeInTheDocument();
      expect(screen.getByText("Produk di Bawah Stok Minimum")).toBeInTheDocument();
      expect(screen.getByText("Produk Habis")).toBeInTheDocument();

      // total: 3, above: 1 (100>=50), below: 2 (20<30, 0<10), habis: 1 (0)
      const statistics = screen.getAllByTestId("card-statistic");
      expect(statistics.length).toBe(4);

      expect(screen.getByText("3")).toBeInTheDocument(); // total
      expect(screen.getByText("2")).toBeInTheDocument(); // below min
      expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(2); // above min & habis
    });

    /* -----------------------------------------------------------------------
     * Test 2: Render Halaman Detail Inventaris
     * ---------------------------------------------------------------------- */
    it("Render Halaman Detail: Menampilkan detail stok in/out dengan merge data terintegrasi", async () => {
      (useGetInventoryByIdWithParams as jest.Mock).mockReturnValue({
        data: mockInventoryDetail,
        isLoading: false,
      });
      (useGetInventoryNotesByIdWithParams as jest.Mock).mockReturnValue({
        data: mockInventoryNotes,
        isLoading: false,
      });
      (useGetInventorySubmissionByIdWithParams as jest.Mock).mockReturnValue({
        data: mockInventorySubmissions,
        isLoading: false,
      });
      (useGetInventoryConsumptionByIdWithParams as jest.Mock).mockReturnValue({
        data: mockInventoryConsumptions,
        isLoading: false,
      });

      // useParams id "inv-1"
      const paramsPromise = Promise.resolve({ id: "inv-1" });
      await act(async () => {
        renderWithQueryClient(<InventoryDetailPage params={paramsPromise} />);
      });

      // Verifikasi header (menggunakan waitFor untuk menangani Suspense/React 19 use API)
      await waitFor(() => {
        expect(screen.getByText("Detail Inventaris")).toBeInTheDocument();
      });

      // Verifikasi tabs
      expect(screen.getByTestId("tabs")).toBeInTheDocument();
      expect(screen.getByTestId("tabs-trigger-ringkasan")).toBeInTheDocument();
      expect(screen.getByTestId("tabs-trigger-tabel")).toBeInTheDocument();
      expect(screen.getByTestId("tabs-trigger-laporan")).toBeInTheDocument();

      // Verifikasi rendering statistik card
      // Total stok saat ini: 100 Kg
      // Total barang masuk: 50 (note) + 30 (submission) = 80 Kg
      // Total barang keluar: 20 Kg
      // Total Kejadian In/Out: 3
      expect(screen.getByText("Total Stok Saat Ini")).toBeInTheDocument();
      expect(screen.getByText("Total Barang Masuk")).toBeInTheDocument();
      expect(screen.getByText("Total Barang Keluar")).toBeInTheDocument();
      expect(screen.getByText("Total Kejadian In/Out")).toBeInTheDocument();

      expect(screen.getByText("100 Kg")).toBeInTheDocument();
      expect(screen.getByText("80 Kg")).toBeInTheDocument();
      expect(screen.getByText("20 Kg")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  // =========================================================================
  // SECTION 2: API MUTATIONS & ERROR HANDLING
  // =========================================================================
  describe("API Mutations & Error Handling", () => {
    /* -----------------------------------------------------------------------
     * Test 3: (Positive) Hook useCreateInventory (POST)
     * ---------------------------------------------------------------------- */
    it("useCreateInventory (POST) - Positive: Berhasil memanggil API POST untuk tambah inventaris", async () => {
      const { useCreateInventory: realHook } = jest.requireActual(
        "@/lib/api/service/inventory/useInventory",
      );
      (useCreateInventory as jest.Mock).mockImplementation(realHook);

      const mockResponse = { success: true, message: "Berhasil menambahkan inventaris" };
      (API_CLIENT.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useCreateInventory(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          productId: "prod-1",
          minQuantity: 10,
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isSuccess).toBe(true);
      expect(API_CLIENT.post).toHaveBeenCalledTimes(1);
      expect(API_CLIENT.post).toHaveBeenCalledWith(
        API_ENDPOINTS.INVENTORY.CREATE,
        { productId: "prod-1", minQuantity: 10 },
      );
    });

    /* -----------------------------------------------------------------------
     * Test 4: (Negative) Hook useCreateInventory (POST) Error Handling
     * ---------------------------------------------------------------------- */
    it("useCreateInventory (POST) - Negative: Menangani error saat API POST tambah inventaris gagal", async () => {
      const { useCreateInventory: realHook } = jest.requireActual(
        "@/lib/api/service/inventory/useInventory",
      );
      (useCreateInventory as jest.Mock).mockImplementation(realHook);

      (API_CLIENT.post as jest.Mock).mockRejectedValueOnce(
        new Error("Gagal membuat inventaris baru"),
      );

      const { result } = renderHook(() => useCreateInventory(), { wrapper });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            productId: "prod-1",
            minQuantity: 10,
          });
        } catch (e) {
          // Expected error
        }
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe("Gagal membuat inventaris baru");
    });

    /* -----------------------------------------------------------------------
     * Test 5: (Positive) Hook usePostInventoryTransaction (POST)
     * ---------------------------------------------------------------------- */
    it("usePostInventoryTransaction (POST) - Positive: Berhasil memanggil API POST untuk mencatat transaksi stok", async () => {
      const { usePostInventoryTransaction: realHook } = jest.requireActual(
        "@/lib/api/service/inventory/useInventory",
      );
      (usePostInventoryTransaction as jest.Mock).mockImplementation(realHook);

      const mockResponse = { success: true, message: "Transaksi berhasil" };
      (API_CLIENT.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => usePostInventoryTransaction(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          inventoryId: "inv-1",
          quantity: 15,
          transactionType: "non-grant",
          notes: "Pembelian tambahan",
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isSuccess).toBe(true);
      expect(API_CLIENT.post).toHaveBeenCalledTimes(1);
      expect(API_CLIENT.post).toHaveBeenCalledWith(
        API_ENDPOINTS.INVENTORY.POST_TRANSACTION,
        {
          inventoryId: "inv-1",
          quantity: 15,
          transactionType: "non-grant",
          notes: "Pembelian tambahan",
        },
      );
    });

    /* -----------------------------------------------------------------------
     * Test 6: (Negative) Hook usePostInventoryTransaction (POST) Error Handling
     * ---------------------------------------------------------------------- */
    it("usePostInventoryTransaction (POST) - Negative: Menangani error saat API POST transaksi stok gagal", async () => {
      const { usePostInventoryTransaction: realHook } = jest.requireActual(
        "@/lib/api/service/inventory/useInventory",
      );
      (usePostInventoryTransaction as jest.Mock).mockImplementation(realHook);

      (API_CLIENT.post as jest.Mock).mockRejectedValueOnce(
        new Error("Gagal mengirim transaksi"),
      );

      const { result } = renderHook(() => usePostInventoryTransaction(), { wrapper });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            inventoryId: "inv-1",
            quantity: 15,
            transactionType: "non-grant",
            notes: "Pembelian tambahan",
          });
        } catch (e) {
          // Expected error
        }
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe("Gagal mengirim transaksi");
    });
  });
});

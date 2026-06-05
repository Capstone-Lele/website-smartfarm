/*
Description:
- Testing Manajemen Komoditas (Commodity Management)
- Mencakup: Render Halaman, Hook useCommodity, Hook useCommodityById, Hook useCreateCommodity, Hook useCommodityByIdAndType
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
import CommodityPage from "@/app/dashboard/commodity/page";
import {
  useCommodity,
  useCommodityById,
  useCreateCommodity,
  useCommodityByIdAndType,
} from "@/lib/api/service/commodity/useCommodity";
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
  },
}));

// Mock hooks
jest.mock("@/lib/api/service/commodity/useCommodity", () => ({
  useCommodity: jest.fn(),
  useCommodityById: jest.fn(),
  useCreateCommodity: jest.fn(),
  useCommodityByIdAndType: jest.fn(),
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

jest.mock("@/components/date-picker/date-rage-picker", () => ({
  DatePickerWithRange: ({ label }: any) => <div data-testid="date-picker">{label}</div>,
}));

jest.mock("@/components/data-table/data-table", () => ({
  DataTable: ({ data }: any) => (
    <div data-testid="data-table">
      {data?.map((item: any) => (
        <div key={item.id} data-testid="data-table-row">
          {item.notes || "Item"} - {item.quantity} ekor
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/app/dashboard/commodity/post", () => ({
  __esModule: true,
  default: () => <div data-testid="post-sell-commodity-modal" />,
}));

jest.mock("@/app/dashboard/commodity/_report-tab", () => ({
  __esModule: true,
  default: () => <div data-testid="commodity-report-tab" />,
}));

jest.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children, defaultValue }: any) => (
    <div data-testid="tabs" data-default={defaultValue}>{children}</div>
  ),
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, value }: any) => (
    <button data-testid={`tabs-trigger-${value}`}>{children}</button>
  ),
  TabsContent: ({ children, value }: any) => (
    <div data-testid={`tabs-content-${value}`}>{children}</div>
  ),
}));

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------
const mockCommodityData = {
  success: true,
  message: "Berhasil mengambil data komoditas",
  data: [
    {
      id: "com-1",
      date: "2026-05-30T00:00:00Z",
      quantity: "1000",
      type: "in",
      notes: "Bibit Unggul Lele",
    },
    {
      id: "com-2",
      date: "2026-05-31T00:00:00Z",
      quantity: "300",
      type: "out",
      notes: "Penjualan Lele Konsumsi",
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
describe("Manajemen Komoditas Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Render Halaman Manajemen Komoditas", () => {
    it("Render Halaman: Menampilkan halaman komoditas dengan benar beserta statistik dan tabelnya", async () => {
      (useCommodity as jest.Mock).mockReturnValue({
        data: mockCommodityData,
        isLoading: false,
      });

      renderWithQueryClient(<CommodityPage />);

      expect(screen.getByText("Komoditas")).toBeInTheDocument();
      expect(screen.getByTestId("data-table")).toBeInTheDocument();

      // Verifikasi statistik: stock = 1000 - 300 = 700 ekor, masuk = 1000, keluar = 300
      expect(screen.getByText("Total Stock Ikan")).toBeInTheDocument();
      expect(screen.getByText("700 ekor")).toBeInTheDocument();
      expect(screen.getByText("300 ekor")).toBeInTheDocument();
      expect(screen.getByText("1.000 ekor")).toBeInTheDocument();
    });
  });

  describe("Hooks: useCommodity & useCreateCommodity", () => {
    it("useCommodity (Positive): Berhasil mengambil data komoditas dari API", async () => {
      const { useCommodity: realHook } = jest.requireActual(
        "@/lib/api/service/commodity/useCommodity"
      );
      (useCommodity as jest.Mock).mockImplementation(realHook);
      (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockCommodityData);

      const { result } = renderHook(() => useCommodity(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockCommodityData);
      expect(API_CLIENT.get).toHaveBeenCalledWith(API_ENDPOINTS.COMMODITY.GET_ALL);
    });

    it("useCommodity (Negative): Menangani status error saat API gagal", async () => {
      const { useCommodity: realHook } = jest.requireActual(
        "@/lib/api/service/commodity/useCommodity"
      );
      (useCommodity as jest.Mock).mockImplementation(realHook);
      (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

      const { result } = renderHook(() => useCommodity(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe("Network Error");
    });

    it("useCreateCommodity (Positive): Berhasil memanggil POST API untuk membuat komoditas baru", async () => {
      const { useCreateCommodity: realHook } = jest.requireActual(
        "@/lib/api/service/commodity/useCommodity"
      );
      (useCreateCommodity as jest.Mock).mockImplementation(realHook);
      const mockResponse = { success: true, message: "Komoditas berhasil dibuat" };
      (API_CLIENT.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useCreateCommodity(), { wrapper });

      const formData = new FormData();
      formData.append("quantity", "100");

      await act(async () => {
        await result.current.mutateAsync(formData);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isSuccess).toBe(true);
      expect(API_CLIENT.post).toHaveBeenCalledWith(
        API_ENDPOINTS.COMMODITY.CREATE,
        formData,
        expect.any(Object)
      );
    });
  });
});

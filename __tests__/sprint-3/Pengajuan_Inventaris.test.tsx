/*
Description:
- Testing Pengajuan Inventaris (Inventory Submission) sesuai Test Case Document (UT-063 - UT-068)
- Mencakup: Render Halaman (List & Detail), Hook useGetInventorySubmissions, Hook useGetInventorySubmissionById, Hook useUpdateInventorySubmission, Hook usePostInventoryTransaction
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
import SubmissionListPage from "@/app/dashboard/inventory-submission/page";
import SubmissionDetailPage from "@/app/dashboard/inventory-submission/[id]/page";
import EditSubmissionModal from "@/app/dashboard/inventory-submission/edit";
import {
  useGetInventorySubmissions,
  useGetInventorySubmissionById,
  useUpdateInventorySubmission,
} from "@/lib/api/service/inventory-submission/useInventorySubmission";
import { usePostInventoryTransaction } from "@/lib/api/service/inventory/useInventory";
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
  },
}));

// Mock hooks
jest.mock("@/lib/api/service/inventory-submission/useInventorySubmission", () => ({
  useGetInventorySubmissions: jest.fn(),
  useGetInventorySubmissionById: jest.fn(),
  useUpdateInventorySubmission: jest.fn(),
}));

jest.mock("@/lib/api/service/inventory/useInventory", () => ({
  usePostInventoryTransaction: jest.fn(),
}));

jest.mock("@/lib/api/service/finance/useFinance", () => ({
  useFinanceBySourceId: jest.fn(() => ({
    data: [
      {
        id: "fin-1",
        transactionDate: "2026-05-30T00:00:00Z",
        totalPrice: 50000,
        notes: "Pembelian pakan",
        image: "https://example.com/receipt.jpg",
      },
    ],
    isLoading: false,
  })),
  useFinanceInventorySubmission: jest.fn(() => ({
    data: [
      {
        sourceId: "sub-1",
        transactionType: "non-grant",
        pricePerItem: 10000,
        quantity: 5,
      },
    ],
    isLoading: false,
    isError: false,
  })),
}));

jest.mock("@/lib/api/service/users/useUser", () => ({
  useGetUserById: jest.fn(() => ({
    data: { name: "Budi" },
    isLoading: false,
  })),
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
  useParams: () => ({ id: "sub-1" }),
  usePathname: () => "/dashboard/inventory-submission",
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
}));

jest.mock("@/lib/utils/format-rupiah", () => ({
  formatRupiah: jest.fn((num: number) => `Rp ${num.toLocaleString("id-ID")}`),
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
          {item.product} - {item.status}
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

jest.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children, open, onOpenChange }: any) => (
    <div data-testid="sheet" data-open={open ? "true" : "false"}>
      {children}
    </div>
  ),
  SheetTrigger: ({ children }: any) => <div>{children}</div>,
  SheetContent: ({ children }: any) => <div data-testid="sheet-content">{children}</div>,
  SheetHeader: ({ children }: any) => <div>{children}</div>,
  SheetTitle: ({ children }: any) => <h2>{children}</h2>,
  SheetDescription: ({ children }: any) => <p>{children}</p>,
}));

jest.mock("@/components/ui/field", () => ({
  Field: ({ children }: any) => <div>{children}</div>,
  FieldLabel: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
  FieldDescription: ({ children }: any) => <p>{children}</p>,
  FieldError: ({ errors }: any) => <span data-testid="field-error">{errors?.[0]?.message}</span>,
  FieldSet: ({ children }: any) => <fieldset>{children}</fieldset>,
  FieldGroup: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/combobox", () => ({
  Combobox: ({ data, selectedValue, onValueChange }: any) => (
    <select
      data-testid="combobox-select"
      value={selectedValue}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {data?.map((item: any) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({ id, placeholder, value, onChange, ...rest }: any) => (
    <input
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data-testid={`input-${id}`}
      {...rest}
    />
  ),
}));

jest.mock("@/components/ui/input-group", () => ({
  InputGroup: ({ children }: any) => <div>{children}</div>,
  InputGroupAddon: ({ children }: any) => <div>{children}</div>,
  InputGroupInput: ({ id, placeholder, value, onChange, ...rest }: any) => (
    <input
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data-testid={`input-${id}`}
      {...rest}
    />
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, type, onClick, disabled }: any) => (
    <button type={type || "button"} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/popup-confimation", () => ({
  __esModule: true,
  default: ({ isOpen, onConfirm }: any) => (
    isOpen ? (
      <div data-testid="popup-confirmation">
        <button onClick={onConfirm}>Confirm Save</button>
      </div>
    ) : null
  ),
}));

// Mock store / custom hooks
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
const mockSubmissionsList = {
  success: true,
  message: "Berhasil mengambil data",
  data: [
    {
      id: "sub-1",
      product: "Pakan Lele Super",
      category: "Pakan",
      quantity: 10,
      unit: "Kg",
      user: "Budi",
      status: "pending",
      notes: "Kebutuhan kolam A",
      createdAt: "2026-05-30T00:00:00Z",
      updatedAt: "2026-05-30T00:00:00Z",
    },
    {
      id: "sub-2",
      product: "Probiotik EM4",
      category: "Obat-obatan",
      quantity: 5,
      unit: "Botol",
      user: "Andi",
      status: "approved",
      notes: "Persiapan air kolam B",
      createdAt: "2026-05-29T00:00:00Z",
      updatedAt: "2026-05-29T00:00:00Z",
    },
  ],
};

const mockSubmissionDetail = {
  success: true,
  message: "Berhasil mengambil data detail",
  data: [mockSubmissionsList.data[0]],
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

describe("Inventory Submission Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================================================
  // SECTION 1: RENDER HALAMAN & GET DATA (LIST & DETAIL)
  // =========================================================================

  describe("Render Halaman & Get Data", () => {
    /* -----------------------------------------------------------------------
     * UT-061-Pengajuan Inventaris | inventory-submission/page.tsx | Render List
     * ---------------------------------------------------------------------- */
    it("UT-061-Pengajuan Inventaris: Menampilkan list pengajuan inventaris dengan benar", async () => {
      (useGetInventorySubmissions as jest.Mock).mockReturnValue({
        data: mockSubmissionsList,
        isLoading: false,
        error: null,
      });

      renderWithQueryClient(<SubmissionListPage />);

      expect(screen.getByText("Pengajuan Inventaris")).toBeInTheDocument();
      expect(screen.getByTestId("data-table")).toBeInTheDocument();
      expect(screen.getByText("Pakan Lele Super - pending")).toBeInTheDocument();
      expect(screen.getByText("Probiotik EM4 - approved")).toBeInTheDocument();

      // Cek statistic cards
      expect(screen.getAllByTestId("card-statistic").length).toBe(4);
    });


    /* -----------------------------------------------------------------------
     * UT-062-Pengajuan Inventaris | inventory-submission/[id]/page.tsx | Render Detail
     * ---------------------------------------------------------------------- */
    it("UT-062-Pengajuan Inventaris: Menampilkan detail pengajuan dengan benar saat data berhasil dimuat", async () => {
      (useGetInventorySubmissionById as jest.Mock).mockReturnValue({
        data: mockSubmissionDetail,
        isLoading: false,
      });

      renderWithQueryClient(<SubmissionDetailPage />);

      expect(screen.getByText("Informasi Produk")).toBeInTheDocument();
      expect(screen.getByText("Pakan Lele Super")).toBeInTheDocument();
      expect(screen.getByText("Kategori Produk")).toBeInTheDocument();
      expect(screen.getByText("Unit Satuan")).toBeInTheDocument();
      expect(screen.getByText("Dibuat Oleh")).toBeInTheDocument();
    });
  });

  // =========================================================================
  // SECTION 2: REQUEST API POST, PUT & HANDLING ERROR
  // =========================================================================

  describe("API Mutations & Error Handling", () => {
    /* -----------------------------------------------------------------------
     * UT-063-Pengajuan Inventaris | useInventorySubmission.ts | useUpdateInventorySubmission (PUT) Positive
     * ---------------------------------------------------------------------- */
    it("UT-063-Pengajuan Inventaris: Berhasil memanggil API PUT untuk update pengajuan", async () => {
      const { useUpdateInventorySubmission: realHook } = jest.requireActual(
        "@/lib/api/service/inventory-submission/useInventorySubmission",
      );
      (useUpdateInventorySubmission as jest.Mock).mockImplementation(realHook);

      const mockResponse = { success: true, message: "Berhasil update" };
      (API_CLIENT.put as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useUpdateInventorySubmission(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          id: "sub-1",
          data: { status: "approved" },
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isSuccess).toBe(true);
      expect(API_CLIENT.put).toHaveBeenCalledTimes(1);
      expect(API_CLIENT.put).toHaveBeenCalledWith(
        API_ENDPOINTS.INVENTORY_SUBMISSION.UPDATE("sub-1"),
        { status: "approved" },
      );
    });

    /* -----------------------------------------------------------------------
     * UT-064-Pengajuan Inventaris | useInventorySubmission.ts | useUpdateInventorySubmission (PUT) Negative
     * ---------------------------------------------------------------------- */
    it("UT-064-Pengajuan Inventaris: Menangani error saat API PUT gagal", async () => {
      const { useUpdateInventorySubmission: realHook } = jest.requireActual(
        "@/lib/api/service/inventory-submission/useInventorySubmission",
      );
      (useUpdateInventorySubmission as jest.Mock).mockImplementation(realHook);

      (API_CLIENT.put as jest.Mock).mockRejectedValueOnce(
        new Error("Gagal mengupdate pengajuan"),
      );

      const { result } = renderHook(() => useUpdateInventorySubmission(), { wrapper });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            id: "sub-1",
            data: { status: "rejected" },
          });
        } catch (e) {
          // Expected error
        }
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe("Gagal mengupdate pengajuan");
    });

    /* -----------------------------------------------------------------------
     * UT-065-Pengajuan Inventaris | useInventory.ts | usePostInventoryTransaction (POST) Positive
     * ---------------------------------------------------------------------- */
    it("UT-065-Pengajuan Inventaris: Berhasil memanggil API POST untuk mencatat transaksi", async () => {
      const { usePostInventoryTransaction: realHook } = jest.requireActual(
        "@/lib/api/service/inventory/useInventory",
      );
      (usePostInventoryTransaction as jest.Mock).mockImplementation(realHook);

      const mockResponse = { success: true, message: "Transaksi dicatat" };
      (API_CLIENT.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => usePostInventoryTransaction(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          inventoryId: "inv-123",
          quantity: 10,
          pricePerItem: 5000,
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isSuccess).toBe(true);
      expect(API_CLIENT.post).toHaveBeenCalledTimes(1);
      expect(API_CLIENT.post).toHaveBeenCalledWith(
        API_ENDPOINTS.INVENTORY.POST_TRANSACTION,
        { inventoryId: "inv-123", quantity: 10, pricePerItem: 5000 },
      );
    });

    /* -----------------------------------------------------------------------
     * UT-066-Pengajuan Inventaris | useInventory.ts | usePostInventoryTransaction (POST) Negative
     * ---------------------------------------------------------------------- */
    it("UT-066-Pengajuan Inventaris: Menangani error saat API POST transaksi gagal", async () => {
      const { usePostInventoryTransaction: realHook } = jest.requireActual(
        "@/lib/api/service/inventory/useInventory",
      );
      (usePostInventoryTransaction as jest.Mock).mockImplementation(realHook);

      (API_CLIENT.post as jest.Mock).mockRejectedValueOnce(
        new Error("Gagal memposting transaksi"),
      );

      const { result } = renderHook(() => usePostInventoryTransaction(), { wrapper });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            inventoryId: "inv-123",
            quantity: 10,
          });
        } catch (e) {
          // Expected error
        }
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe("Gagal memposting transaksi");
    });
  });
});

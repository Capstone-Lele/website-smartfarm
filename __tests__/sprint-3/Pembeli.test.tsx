/*
Description:
- Testing Pembeli (Buyer) sesuai Test Case Document (UT-047 - UT-051)
*/

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, Suspense } from "react";
import { renderHook } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Import Target Files
// ---------------------------------------------------------------------------
import BuyerPage from "@/app/dashboard/master-data/buyers/page";
import {
  useGetBuyers,
  useCreateBuyer,
  useUpdateBuyer,
} from "@/lib/api/service/master-data/buyer/useBuyer";
import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { buildPayloadCreate, buildPayloadEdit } from "@/lib/utils/payload-build";

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

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock payload builders
jest.mock("@/lib/utils/payload-build", () => ({
  buildPayloadCreate: jest.fn((data: any) => data),
  buildPayloadEdit: jest.fn((data: any) => data),
}));

// Mock useBuyer hooks
jest.mock("@/lib/api/service/master-data/buyer/useBuyer", () => ({
  useGetBuyers: jest.fn(),
  useCreateBuyer: jest.fn(),
  useUpdateBuyer: jest.fn(),
}));

// Mock @tanstack/react-query's useQueryClient
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>
    </QueryClientProvider>,
  );
};

// Mock the DataTable component
jest.mock("@/components/data-table/data-table", () => ({
  DataTable: ({ data }: any) => (
    <div data-testid="data-table">
      {data?.map((item: any) => (
        <div key={item.id} data-testid="data-table-row">
          {item.name}
        </div>
      ))}
    </div>
  ),
}));

// Mock DefaultCard component
jest.mock("@/components/card/default-card", () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="default-card">{children}</div>
  ),
}));

// Mock table skeleton
jest.mock("@/components/sekeleton/table-skeleton", () => ({
  __esModule: true,
  default: () => <div data-testid="table-skeleton" />,
}));

// Mock PostBuyerModal
jest.mock("@/app/dashboard/master-data/buyers/post", () => ({
  __esModule: true,
  default: () => <button data-testid="btn-tambah-pembeli">Tambah Pembeli</button>,
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// ---------------------------------------------------------------------------
// Test Suites
// ---------------------------------------------------------------------------

describe("Pembeli (Buyer) Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * UT-045-Pembeli | buyers/page.tsx | Render Halaman Pembeli
   * ======================================================================== */
  it("UT-045-Pembeli: Halaman pengguna muncul dengan benar tanpa crash", () => {
    (useCreateBuyer as jest.Mock).mockReturnValue({ isPending: false });
    (useUpdateBuyer as jest.Mock).mockReturnValue({ isPending: false });
    (useGetBuyers as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: "1", name: "Budi" },
          { id: "2", name: "Andi" },
        ],
      },
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<BuyerPage />);

    expect(screen.getByTestId("default-card")).toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getAllByTestId("data-table-row").length).toBeGreaterThan(0);
    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(screen.getByTestId("btn-tambah-pembeli")).toBeInTheDocument();
  });

  /* =========================================================================
   * UT-046-Pembeli | useBuyer.ts | Request Api Post Buyer (Positive)
   * ======================================================================== */
  it("UT-046-Pembeli: Memastikan API_CLIENT.post dipanggil 1x untuk CREATE pembeli dan isSuccess: true", async () => {
    const { useCreateBuyer: realUseCreateBuyer } = jest.requireActual(
      "@/lib/api/service/master-data/buyer/useBuyer",
    );
    (useCreateBuyer as jest.Mock).mockImplementation(realUseCreateBuyer);

    const mockData = { name: "Budi" };
    const mockResponse = { data: { id: "1", ...mockData } };

    (API_CLIENT.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (buildPayloadCreate as jest.Mock).mockReturnValueOnce(mockData);

    const { result } = renderHook(() => useCreateBuyer(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(mockData as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.post).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.post).toHaveBeenCalledWith(
      API_ENDPOINTS.BUYER.CREATE,
      mockData,
    );
  });

  /* =========================================================================
   * UT-047-Pembeli | useBuyer.ts | Request Api Put Buyer (Positive)
   * ======================================================================== */
  it("UT-047-Pembeli: Memastikan API_CLIENT.put dipanggil 1x untuk UPDATE pembeli dan isSuccess: true", async () => {
    const { useUpdateBuyer: realUseUpdateBuyer } = jest.requireActual(
      "@/lib/api/service/master-data/buyer/useBuyer",
    );
    (useUpdateBuyer as jest.Mock).mockImplementation(realUseUpdateBuyer);

    const buyerId = "1";
    const mockData = { name: "Budiono" };
    const mockResponse = { data: { id: buyerId, ...mockData } };

    (API_CLIENT.put as jest.Mock).mockResolvedValueOnce(mockResponse);
    (buildPayloadEdit as jest.Mock).mockReturnValueOnce(mockData);

    const { result } = renderHook(() => useUpdateBuyer(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ id: buyerId, data: mockData } as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.put).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.put).toHaveBeenCalledWith(
      API_ENDPOINTS.BUYER.UPDATE(buyerId),
      mockData,
    );
  });

  /* =========================================================================
   * UT-048-Pembeli | useBuyer.ts | Handling API Error saat Tambah Pembeli
   * ======================================================================== */
  it("UT-048-Pembeli: Handling API Error saat Tambah Pembeli (state isError: true)", async () => {
    const { useCreateBuyer: realUseCreateBuyer } = jest.requireActual(
      "@/lib/api/service/master-data/buyer/useBuyer",
    );
    (useCreateBuyer as jest.Mock).mockImplementation(realUseCreateBuyer);

    (API_CLIENT.post as jest.Mock).mockRejectedValueOnce(
      new Error("Gagal menambah pembeli"),
    );
    (buildPayloadCreate as jest.Mock).mockReturnValueOnce({ name: "Budi" });

    const { result } = renderHook(() => useCreateBuyer(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({ name: "Budi" } as any);
      } catch (e) {
        // expected to throw an error
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Gagal menambah pembeli");
  });

  /* =========================================================================
   * UT-049-Pembeli | useBuyer.ts | Handling API Error saat Edit Pembeli
   * ======================================================================== */
  it("UT-049-Pembeli: Handling API Error saat Edit Pembeli (state isError: true)", async () => {
    const { useUpdateBuyer: realUseUpdateBuyer } = jest.requireActual(
      "@/lib/api/service/master-data/buyer/useBuyer",
    );
    (useUpdateBuyer as jest.Mock).mockImplementation(realUseUpdateBuyer);

    (API_CLIENT.put as jest.Mock).mockRejectedValueOnce(
      new Error("Internal Server Error"),
    );
    (buildPayloadEdit as jest.Mock).mockReturnValueOnce({ name: "Budi" });

    const { result } = renderHook(() => useUpdateBuyer(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          id: "1",
          data: { name: "Budi" },
        } as any);
      } catch (e) {
        // expected to throw an error
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Internal Server Error");
  });
});

/* 
Description: 
- Testing Produk (Product) sesuai Test Case Document (UT-018-Produk)
*/

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, Suspense } from "react";
import { renderHook } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Import Target Files
// ---------------------------------------------------------------------------
import ProductPage from "@/app/dashboard/master-data/products/page";
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
} from "@/lib/api/service/master-data/product/useProduct";
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

// Mock useProduct hooks
jest.mock("@/lib/api/service/master-data/product/useProduct", () => ({
  useGetProducts: jest.fn(),
  useCreateProduct: jest.fn(),
  useUpdateProduct: jest.fn(),
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

// Mock PostProductModal
jest.mock("@/app/dashboard/master-data/products/post", () => ({
  __esModule: true,
  default: () => <button data-testid="btn-tambah-produk">Tambah Produk</button>,
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

describe("Produk Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * UT-018-Produk | products/page.tsx | Render Halaman Produk
   * ======================================================================== */
  it("UT-018-Produk: Halaman pengguna muncul dengan benar tanpa crash", () => {
    (useCreateProduct as jest.Mock).mockReturnValue({ isPending: false });
    (useUpdateProduct as jest.Mock).mockReturnValue({ isPending: false });
    (useGetProducts as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: "1", name: "Bibit Lele" },
          { id: "2", name: "Pakan Pelet" },
        ],
      },
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<ProductPage />);

    expect(screen.getByTestId("default-card")).toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getAllByTestId("data-table-row").length).toBeGreaterThan(0);
    expect(screen.getByText("Bibit Lele")).toBeInTheDocument();
    expect(screen.getByTestId("btn-tambah-produk")).toBeInTheDocument();
  });

  /* =========================================================================
   * UT-018-Produk | useProduct.ts | Request Api Post Product
   * ======================================================================== */
  it("UT-018-Produk: Memastikan API_CLIENT.post dipanggil 1x untuk CREATE product dan isSuccess: true", async () => {
    const { useCreateProduct: realUseCreateProduct } = jest.requireActual(
      "@/lib/api/service/master-data/product/useProduct",
    );
    (useCreateProduct as jest.Mock).mockImplementation(realUseCreateProduct);

    const mockData = {
      name: "Produk Baru",
      type: "inventory",
      category: "Pakan",
      unit: "Kg",
    };
    const mockResponse = { data: { id: "1", ...mockData } };

    (API_CLIENT.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCreateProduct(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(mockData as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.post).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.post).toHaveBeenCalledWith(
      API_ENDPOINTS.MASTER_DATA.PRODUCT.CREATE,
      mockData,
    );
  });

  /* =========================================================================
   * UT-018-Produk | useProduct.ts | Request Api Put Product
   * ======================================================================== */
  it("UT-018-Produk: Memastikan API_CLIENT.put dipanggil 1x untuk UPDATE product dan isSuccess: true", async () => {
    const { useUpdateProduct: realUseUpdateProduct } = jest.requireActual(
      "@/lib/api/service/master-data/product/useProduct",
    );
    (useUpdateProduct as jest.Mock).mockImplementation(realUseUpdateProduct);

    const productId = "1";
    const mockData = { name: "Produk Edit" };
    const mockResponse = { data: { id: productId, ...mockData } };

    (API_CLIENT.put as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUpdateProduct(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        id: productId,
        data: mockData,
      } as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.put).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.put).toHaveBeenCalledWith(
      API_ENDPOINTS.MASTER_DATA.PRODUCT.UPDATE(productId),
      mockData,
    );
  });

  /* =========================================================================
   * UT-018-Produk | useProduct.ts | Handling API Error saat Tambah Product
   * ======================================================================== */
  it("UT-018-Produk: Handling API Error saat Tambah Product (state isError: true)", async () => {
    const { useCreateProduct: realUseCreateProduct } = jest.requireActual(
      "@/lib/api/service/master-data/product/useProduct",
    );
    (useCreateProduct as jest.Mock).mockImplementation(realUseCreateProduct);

    (API_CLIENT.post as jest.Mock).mockRejectedValueOnce(
      new Error("Gagal menambah produk"),
    );

    const { result } = renderHook(() => useCreateProduct(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({ name: "Error Produk" } as any);
      } catch (e) {
        // expected to throw an error
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Gagal menambah produk");
  });

  /* =========================================================================
   * UT-018-Produk | useProduct.ts | Handling API Error saat Edit Product
   * ======================================================================== */
  it("UT-018-Produk: Handling API Error saat Edit Product (state isError: true)", async () => {
    const { useUpdateProduct: realUseUpdateProduct } = jest.requireActual(
      "@/lib/api/service/master-data/product/useProduct",
    );
    (useUpdateProduct as jest.Mock).mockImplementation(realUseUpdateProduct);

    (API_CLIENT.put as jest.Mock).mockRejectedValueOnce(
      new Error("Internal Server Error"),
    );

    const { result } = renderHook(() => useUpdateProduct(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          id: "1",
          data: { name: "Produk Gagal" },
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

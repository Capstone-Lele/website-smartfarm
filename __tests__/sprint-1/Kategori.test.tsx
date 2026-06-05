/* 
Description: 
- Testing Kategori (Category) sesuai Test Case Document (UT-016, UT-017)
*/

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { renderHook } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Import Target Files
// ---------------------------------------------------------------------------
import CategoryPage from "@/app/dashboard/master-data/categories/page";
import { useCategory } from "@/lib/api/service/master-data/category/useCategory";
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

// Mock useCategory hooks
jest.mock("@/lib/api/service/master-data/category/useCategory", () => ({
  useCategory: jest.fn(),
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

describe("Kategori Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * UT-016-Kategori | categories/page.tsx | Render Halaman Kategori
   * ======================================================================== */
  it("UT-016-Kategori: Halaman pengguna muncul dengan benar tanpa crash", () => {
    (useCategory as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: "1", name: "Pakan" },
          { id: "2", name: "Vitamin" },
        ],
      },
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<CategoryPage />);

    expect(screen.getByTestId("default-card")).toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getAllByTestId("data-table-row").length).toBeGreaterThan(0);
    expect(screen.getByText("Pakan")).toBeInTheDocument();
  });

  /* =========================================================================
   * UT-017-Kategori | useCategory.ts | Request Api Get Category
   * ======================================================================== */
  it("UT-017-Kategori: Memastikan API_CLIENT.get dipanggil 1x untuk GET category dan isSuccess: true", async () => {
    const { useCategory: realUseCategory } = jest.requireActual(
      "@/lib/api/service/master-data/category/useCategory",
    );
    (useCategory as jest.Mock).mockImplementation(realUseCategory);

    const mockResponse = {
      data: [{ id: "1", name: "Kategori Baru" }],
    };

    (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCategory(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.get).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.get).toHaveBeenCalledWith(
      API_ENDPOINTS.MASTER_DATA.KATEGORI.GET_ALL,
    );
  });
});

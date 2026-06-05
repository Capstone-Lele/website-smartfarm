/* 
Description: 
- Testing Satuan (Unit) sesuai Test Case Document (UT-018)
*/

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, Suspense } from "react";
import { renderHook } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Import Target Files
// ---------------------------------------------------------------------------
import UnitPage from "@/app/dashboard/master-data/units/page";
import {
  useUnit,
  useCreateUnit,
  useUpdateUnit,
} from "@/lib/api/service/master-data/unit/useUnit";
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

// Mock useUnit hooks
jest.mock("@/lib/api/service/master-data/unit/useUnit", () => ({
  useUnit: jest.fn(),
  useCreateUnit: jest.fn(),
  useUpdateUnit: jest.fn(),
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

// Mock PostUnitModal
jest.mock("@/app/dashboard/master-data/units/post", () => ({
  __esModule: true,
  default: () => <button data-testid="btn-tambah-satuan">Tambah Satuan</button>,
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

describe("Unit (Satuan) Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================================
   * UT-018-Unit | units/page.tsx | Render Halaman Satuan
   * ======================================================================== */
  it("UT-018-Unit: Halaman pengguna muncul dengan benar tanpa crash", () => {
    (useCreateUnit as jest.Mock).mockReturnValue({ isPending: false });
    (useUpdateUnit as jest.Mock).mockReturnValue({ isPending: false });
    (useUnit as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: "1", name: "Kilogram" },
          { id: "2", name: "Liter" },
        ],
      },
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<UnitPage />);

    expect(screen.getByTestId("default-card")).toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getAllByTestId("data-table-row").length).toBeGreaterThan(0);
    expect(screen.getByText("Kilogram")).toBeInTheDocument();
    expect(screen.getByTestId("btn-tambah-satuan")).toBeInTheDocument();
  });

  /* =========================================================================
   * UT-018-Unit | useUnit.ts | Request Api Post Unit
   * ======================================================================== */
  it("UT-018-Unit: Memastikan API_CLIENT.post dipanggil 1x untuk CREATE unit dan isSuccess: true", async () => {
    const { useCreateUnit: realUseCreateUnit } = jest.requireActual(
      "@/lib/api/service/master-data/unit/useUnit",
    );
    (useCreateUnit as jest.Mock).mockImplementation(realUseCreateUnit);

    const mockData = { name: "Kg" };
    const mockResponse = { data: { id: "1", ...mockData } };

    (API_CLIENT.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCreateUnit(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(mockData as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.post).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.post).toHaveBeenCalledWith(
      API_ENDPOINTS.MASTER_DATA.UNIT.CREATE,
      mockData,
    );
  });

  /* =========================================================================
   * UT-018-Unit | useUnit.ts | Request Api Put Unit
   * ======================================================================== */
  it("UT-018-Unit: Memastikan API_CLIENT.put dipanggil 1x untuk UPDATE unit dan isSuccess: true", async () => {
    const { useUpdateUnit: realUseUpdateUnit } = jest.requireActual(
      "@/lib/api/service/master-data/unit/useUnit",
    );
    (useUpdateUnit as jest.Mock).mockImplementation(realUseUpdateUnit);

    const unitId = "1";
    const mockData = { name: "Kilogram" };
    const mockResponse = { data: { id: unitId, ...mockData } };

    (API_CLIENT.put as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUpdateUnit(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ id: unitId, data: mockData } as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.put).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.put).toHaveBeenCalledWith(
      API_ENDPOINTS.MASTER_DATA.UNIT.UPDATE(unitId),
      mockData,
    );
  });

  /* =========================================================================
   * UT-018-Unit | useUnit.ts | Handling API Error saat Tambah Unit
   * ======================================================================== */
  it("UT-018-Unit: Handling API Error saat Tambah Unit (state isError: true)", async () => {
    const { useCreateUnit: realUseCreateUnit } = jest.requireActual(
      "@/lib/api/service/master-data/unit/useUnit",
    );
    (useCreateUnit as jest.Mock).mockImplementation(realUseCreateUnit);

    (API_CLIENT.post as jest.Mock).mockRejectedValueOnce(
      new Error("Gagal menambah satuan"),
    );

    const { result } = renderHook(() => useCreateUnit(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({ name: "Kg" } as any);
      } catch (e) {
        // expected to throw an error
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Gagal menambah satuan");
  });

  /* =========================================================================
   * UT-018-Unit | useUnit.ts | Handling API Error saat Edit Unit
   * ======================================================================== */
  it("UT-018-Unit: Handling API Error saat Edit Unit (state isError: true)", async () => {
    const { useUpdateUnit: realUseUpdateUnit } = jest.requireActual(
      "@/lib/api/service/master-data/unit/useUnit",
    );
    (useUpdateUnit as jest.Mock).mockImplementation(realUseUpdateUnit);

    (API_CLIENT.put as jest.Mock).mockRejectedValueOnce(
      new Error("Internal Server Error"),
    );

    const { result } = renderHook(() => useUpdateUnit(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          id: "1",
          data: { name: "Gram" },
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

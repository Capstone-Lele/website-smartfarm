/*
Description:
- Testing Menu Beranda Dashboard sesuai Test Case Document (UT-084 - UT-085)
*/

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { act } from "react";

// Mock dependencies
import DashboardPage from "@/app/dashboard/page";
import { useDashboard } from "@/lib/api/service/dashboard/useDashboard";
import {
  useFinanceCommodity,
  useFinanceInventory,
  useFinanceInventorySubmission,
  useFinanceNonInventory,
} from "@/lib/api/service/finance/useFinance";
import { useListFeed } from "@/lib/api/service/notes/feed/useFeed";
import { useGetInventorySubmissions } from "@/lib/api/service/inventory-submission/useInventorySubmission";
import { useInventory } from "@/lib/api/service/inventory/useInventory";

jest.mock("@/lib/api/service/dashboard/useDashboard", () => ({
  useDashboard: jest.fn(),
}));
jest.mock("@/lib/api/service/finance/useFinance", () => ({
  useFinanceCommodity: jest.fn(),
  useFinanceInventory: jest.fn(),
  useFinanceInventorySubmission: jest.fn(),
  useFinanceNonInventory: jest.fn(),
}));
jest.mock("@/lib/api/service/notes/feed/useFeed", () => ({
  useListFeed: jest.fn(),
}));
jest.mock(
  "@/lib/api/service/inventory-submission/useInventorySubmission",
  () => ({ useGetInventorySubmissions: jest.fn() }),
);
jest.mock("@/lib/api/service/inventory/useInventory", () => ({
  useInventory: jest.fn(),
}));

// components/card/default-card mocked component
jest.mock(
  "@/components/card/default-card",
  () =>
    function DefaultCard({ children }: any) {
      return <div data-testid="default-card">{children}</div>;
    },
);

jest.mock("recharts", () => {
  const OriginalRecharts = jest.requireActual("recharts");
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    AreaChart: ({ children }: any) => (
      <div data-testid="area-chart">{children}</div>
    ),
    Area: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
  };
});

jest.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: any) => (
    <div data-testid="chart-container">{children}</div>
  ),
  ChartTooltip: () => <div />,
  ChartTooltipContent: () => <div />,
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("Menu Beranda Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("UT-084-Menu Beranda: Komponen utama muncul dengan benar beserta data stats", async () => {
    (useDashboard as jest.Mock).mockReturnValue({
      data: {
        totalPool: 10,
        totalSeed: 5000,
        totalStaff: 5,
        totalHarvestQuantity: 200,
        totalFood: 300,
        survivalRate: 85,
        fishPopulation: { current: 4000, mortality: 100, quarantine: 50 },
      },
    });

    (useFinanceCommodity as jest.Mock).mockReturnValue({ data: [] });
    (useFinanceInventory as jest.Mock).mockReturnValue({ data: [] });
    (useFinanceInventorySubmission as jest.Mock).mockReturnValue({ data: [] });
    (useFinanceNonInventory as jest.Mock).mockReturnValue({ data: [] });
    (useListFeed as jest.Mock).mockReturnValue({ data: { data: [] } });
    (useGetInventorySubmissions as jest.Mock).mockReturnValue({
      data: { data: [] },
    });
    (useInventory as jest.Mock).mockReturnValue({ data: { data: [] } });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <DashboardPage />
        </QueryClientProvider>,
      );
    });

    expect(screen.getByText("Dashboard SmartFarm Lele")).toBeInTheDocument();
    expect(screen.getByText("Total Kolam")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Total Benih")).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument();
  });

  it("UT-085-Menu Beranda: Menampilkan notifikasi stok rendah jika terdapat item inventaris limit", async () => {
    (useDashboard as jest.Mock).mockReturnValue({
      data: { fishPopulation: {} },
    });
    (useFinanceCommodity as jest.Mock).mockReturnValue({ data: [] });
    (useFinanceInventory as jest.Mock).mockReturnValue({ data: [] });
    (useFinanceInventorySubmission as jest.Mock).mockReturnValue({ data: [] });
    (useFinanceNonInventory as jest.Mock).mockReturnValue({ data: [] });
    (useListFeed as jest.Mock).mockReturnValue({ data: { data: [] } });
    (useGetInventorySubmissions as jest.Mock).mockReturnValue({
      data: { data: [] },
    });

    // Simulate low stock
    (useInventory as jest.Mock).mockReturnValue({
      data: {
        data: [{ id: 1, totalQuantity: 5, minQuantity: 10 }],
      },
    });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <DashboardPage />
        </QueryClientProvider>,
      );
    });

    expect(screen.getByText(/stoknya rendah atau habis/i)).toBeInTheDocument();
  });
});

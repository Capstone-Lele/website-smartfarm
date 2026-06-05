/* 
Description: 
- Testing Landing Page Guest
*/

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";

// Mock dependencies
import Home from "@/app/page";
import { useGeneralInfo } from "@/lib/api/service/guest/useGuest";

jest.mock("@/lib/api/service/guest/useGuest", () => ({
  useGeneralInfo: jest.fn(),
}));

jest.mock("@/components/navigation/HomeNavbar", () => () => (
  <div data-testid="home-navbar">Navbar</div>
));
jest.mock("@/components/home/Header", () => () => (
  <div data-testid="home-header">Header</div>
));
jest.mock("@/components/home/Profile", () => () => (
  <div data-testid="home-profile">Profile</div>
));
jest.mock("@/components/home/Kolam", () => () => (
  <div data-testid="home-kolam">Kolam</div>
));
jest.mock("@/components/home/Populasi", () => () => (
  <div data-testid="home-populasi">Populasi</div>
));
jest.mock("@/components/home/Panen", () => () => (
  <div data-testid="home-panen">Panen</div>
));
jest.mock("@/components/home/summary-keuangan", () => () => (
  <div data-testid="home-keuangan">Keuangan</div>
));
jest.mock("@/components/home/CTA", () => () => (
  <div data-testid="home-cta">CTA</div>
));
jest.mock("@/components/home/Footer", () => () => (
  <div data-testid="home-footer">Footer</div>
));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("Landing Page Guest Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Render Landing Page: Komponen utama muncul dengan benar", async () => {
    (useGeneralInfo as jest.Mock).mockReturnValue({
      data: {},
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>,
    );

    expect(screen.getByTestId("home-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("home-header")).toBeInTheDocument();
    expect(screen.getByTestId("home-profile")).toBeInTheDocument();
    expect(screen.getByTestId("home-kolam")).toBeInTheDocument();
    expect(screen.getByTestId("home-populasi")).toBeInTheDocument();
    expect(screen.getByTestId("home-panen")).toBeInTheDocument();
    expect(screen.getByTestId("home-keuangan")).toBeInTheDocument();
    expect(screen.getByTestId("home-cta")).toBeInTheDocument();
    expect(screen.getByTestId("home-footer")).toBeInTheDocument();
  });

  it("Request UseGeneralInfo (Positive): Custom hook berfungsi", async () => {
    (useGeneralInfo as jest.Mock).mockReturnValue({
      data: { success: true },
      isSuccess: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useGeneralInfo(), { wrapper });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data?.success).toBe(true);
  });
});

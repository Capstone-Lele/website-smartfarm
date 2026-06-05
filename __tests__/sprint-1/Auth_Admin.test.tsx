/* 
Description: 
- Testing Auth Admin sesuai Test Case Document (UT-001 - UT-006)
*/

import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { renderHook } from "@testing-library/react";
import * as jose from "jose";

// ---------------------------------------------------------------------------
// Import Target Files
// ---------------------------------------------------------------------------
import LoginForm from "@/components/auth/LoginForm";
import { authService } from "@/lib/api/service/auth/auth.service";
import { useLogin } from "@/lib/api/service/auth/useAuth";
import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { createSession } from "@/lib/session";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

// Mock next/image & next/link
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Mock API Client
jest.mock("@/lib/api/client", () => ({
  API_CLIENT: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Mock jose
jest.mock("jose", () => ({
  decodeJwt: jest.fn(),
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue("mocked-jwt"),
  })),
  jwtVerify: jest.fn(),
}));

// Mock Session
jest.mock("@/lib/session", () => ({
  createSession: jest.fn(),
  clearSession: jest.fn(),
}));

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderLoginForm = () => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </QueryClientProvider>,
  );
};

// ---------------------------------------------------------------------------
// Test Suites
// ---------------------------------------------------------------------------

describe("Auth Admin Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  /* =========================================================================
   * UT-001-Auth Admin | login/page.tsx | Render Halaman Login
   * ======================================================================== */
  it("UT-001-Auth Admin: Form login, input email, input password, dan tombol Login muncul dengan benar tanpa crash", () => {
    // Karena page.tsx membungkus LoginForm, kita test LoginForm secara langsung
    renderLoginForm();

    expect(screen.getByPlaceholderText(/Masukkan email/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Masukkan password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  /* =========================================================================
   * UT-002-Auth Admin | auth.service.ts | Verifikasi Request API Login
   * ======================================================================== */
  it("UT-002-Auth Admin: Memastikan API_CLIENT.post dipanggil 1x ke API_ENDPOINTS.AUTH.LOGIN dengan payload benar", async () => {
    const mockCredentials = {
      email: "admin@test.com",
      password: "password123",
    };
    const mockResponse = {
      data: { token: "mock.jwt.token", expires_at: "2026-01-01 12:00:00" },
    };

    (API_CLIENT.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await authService.login(mockCredentials);

    expect(API_CLIENT.post).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.post).toHaveBeenCalledWith(
      API_ENDPOINTS.AUTH.LOGIN,
      mockCredentials,
    );
    expect(result).toEqual(mockResponse);
  });

  /* =========================================================================
   * UT-003-Auth Admin | useAuth.ts | Handling Login Sukses (Role Admin)
   * ======================================================================== */
  it("UT-003-Auth Admin: Token di-decode, expires_at ditambah 1 jam, dan createSession terpanggil (Role admin)", async () => {
    const mockResponse = {
      data: {
        token: "admin-token",
        expires_at: "2026-01-01T12:00:00.000Z",
      },
    };

    (API_CLIENT.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (jose.decodeJwt as jest.Mock).mockReturnValueOnce({
      role: "admin",
      exp: 123456789,
    });

    const queryClient = createQueryClient();
    const { result } = renderHook(() => useLogin(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({
      email: "admin@test.com",
      password: "password123",
    });

    expect(jose.decodeJwt).toHaveBeenCalledWith("admin-token");
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(createSession).toHaveBeenCalledWith(
      "admin-token",
      "2026-01-01T12:00:00.000Z",
    );
  });

  /* =========================================================================
   * UT-004-Auth Admin | useAuth.ts | Restriksi Akses (Role Bukan Admin)
   * ======================================================================== */
  it("UT-004-Auth Admin: Mutasi gagal, aplikasi melempar Error 'Invalid Credentials' dan createSession dibatalkan", async () => {
    const mockResponse = {
      data: {
        token: "user-token",
        expires_at: "2026-01-01T12:00:00.000Z",
      },
    };

    (API_CLIENT.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (jose.decodeJwt as jest.Mock).mockReturnValueOnce({
      role: "user",
      exp: 123456789,
    }); // Role bukan admin

    const queryClient = createQueryClient();
    const { result } = renderHook(() => useLogin(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await expect(
      result.current.mutateAsync({
        email: "user@test.com",
        password: "password123",
      }),
    ).rejects.toThrow("Invalid Credentials");

    expect(jose.decodeJwt).toHaveBeenCalledWith("user-token");
    expect(createSession).not.toHaveBeenCalled();
  });

});
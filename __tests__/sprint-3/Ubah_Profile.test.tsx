/*
Description:
- Testing Ubah Profile (Update Profile) sesuai Test Case Document (UT-052 - UT-056)
- Mencakup: Render Halaman, Hook useGetProfile, Hook useUpdateProfile
*/

import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { renderHook } from "@testing-library/react";
import { act } from "react";

// ---------------------------------------------------------------------------
// Import Target Files
// ---------------------------------------------------------------------------
import ProfileSettingPage from "@/app/dashboard/profile-setting/page";
import {
  useGetProfile,
  useUpdateProfile,
} from "@/lib/api/service/profile/useProfile";
import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

// Mock API Client
jest.mock("@/lib/api/client", () => ({
  API_CLIENT: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

// Mock redisService
jest.mock("@/lib/api/service/redis/redis.service", () => ({
  redisService: {
    clearCache: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock hooks
jest.mock("@/lib/api/service/profile/useProfile", () => ({
  useGetProfile: jest.fn(),
  useUpdateProfile: jest.fn(),
}));

// Mock React Query (untuk hook tests agar tidak mengganggu komponen)
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock lib/session
jest.mock("@/lib/session", () => ({
  getCookieDecryptedSession: jest.fn().mockResolvedValue({ userId: "user-1" }),
}));

// Mock utility functions
jest.mock("@/lib/utils/avatar", () => ({
  getAvatarUrl: jest.fn((name: string) => `https://avatar.example.com/${name}`),
}));

jest.mock("@/lib/utils/get-dirty-value", () => ({
  getDirtyValues: jest.fn((dirtyFields: any, values: any) => {
    const result: any = {};
    Object.keys(dirtyFields).forEach((key) => {
      result[key] = values[key];
    });
    return result;
  }),
}));

jest.mock("@/lib/utils/payload-build", () => ({
  buildPayloadEdit: jest.fn((data: any) => data),
}));

// Mock Components
jest.mock("@/components/card/default-card", () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="default-card">{children}</div>
  ),
}));

jest.mock("@/components/sekeleton/profile-setting-skeleton", () => ({
  __esModule: true,
  default: () => <div data-testid="profile-setting-skeleton">Loading...</div>,
}));

// Mock UI Components agar tidak gagal saat import CSS/komponen complex
jest.mock("@/components/ui/field", () => ({
  Field: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  FieldContent: ({ children }: any) => <div>{children}</div>,
  FieldDescription: ({ children }: any) => <p>{children}</p>,
  FieldError: ({ errors }: any) => (
    <p data-testid="field-error">{errors?.[0]?.message}</p>
  ),
  FieldGroup: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  FieldLabel: ({ children, htmlFor }: any) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
  FieldLegend: ({ children }: any) => <legend>{children}</legend>,
  FieldSeparator: () => <hr />,
  FieldSet: ({ children }: any) => <fieldset>{children}</fieldset>,
  FieldTitle: ({ children }: any) => <p>{children}</p>,
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({ id, type, placeholder, disabled, onChange, ...rest }: any) => (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      data-testid={`input-${id}`}
      {...rest}
    />
  ),
}));

jest.mock("@/components/ui/input-group", () => ({
  InputGroup: ({ children }: any) => <div>{children}</div>,
  InputGroupAddon: ({ children, onClick }: any) => (
    <button type="button" onClick={onClick} data-testid="password-toggle">
      {children}
    </button>
  ),
  InputGroupInput: ({ id, type, placeholder, ...rest }: any) => (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      data-testid={`input-${id}`}
      {...rest}
    />
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, type, disabled, onClick, ...rest }: any) => (
    <button
      type={type || "button"}
      disabled={disabled}
      onClick={onClick}
      data-testid={`button-${typeof children === "string" ? children.trim() : "btn"}`}
      {...rest}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: any) => (
    <span data-testid="spinner" className={className} />
  ),
}));

jest.mock("@/components/ui/combobox", () => ({
  Combobox: () => <div>Combobox</div>,
}));

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------
const mockProfileData = {
  id: "user-1",
  name: "Budi Santoso",
  email: "budi@gmail.com",
  password: "hashed_password",
  role: "admin",
  image: "https://example.com/avatar.jpg",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  deletedAt: null,
};

const mockProfileResponse = {
  success: true,
  message: "Profil berhasil diambil",
  data: [mockProfileData],
};

// ---------------------------------------------------------------------------
// Query Client & Wrapper Setup
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

describe("Ubah Profile Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================================================
  // SECTION 1: RENDER HALAMAN
  // =========================================================================

  describe("Render Halaman Profile Setting", () => {
    /* -----------------------------------------------------------------------
     * UT-050-Ubah Profile | profile-setting/page.tsx | Render Halaman
     * ---------------------------------------------------------------------- */
    it("UT-050-Ubah Profile: Halaman profile muncul dengan benar saat data berhasil dimuat", async () => {
      (useGetProfile as jest.Mock).mockReturnValue({
        data: mockProfileResponse,
        isLoading: false,
        error: null,
      });
      (useUpdateProfile as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
        isPending: false,
      });

      await act(async () => {
        renderWithQueryClient(<ProfileSettingPage />);
      });

      await waitFor(() => {
        expect(screen.getByTestId("default-card")).toBeInTheDocument();
      });

      // Cek label field yang ditampilkan
      expect(screen.getAllByText(/Nama/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Email/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Role/i).length).toBeGreaterThan(0);
      expect(screen.getByText("Password Baru")).toBeInTheDocument();
      expect(screen.getByText("Konfirmasi Password Baru")).toBeInTheDocument();
    });
  });
});

// =========================================================================
// SECTION 4: HOOK - useGetProfile
// =========================================================================

describe("Hook: useGetProfile", () => {
  /* -----------------------------------------------------------------------
   * UT-051-Ubah Profile | useProfile.ts | useGetProfile (Positive)
   * ---------------------------------------------------------------------- */
  it("UT-051-Ubah Profile: API_CLIENT.get dipanggil dengan endpoint yang benar dan isSuccess = true", async () => {
    const { useGetProfile: realUseGetProfile } = jest.requireActual(
      "@/lib/api/service/profile/useProfile",
    );
    (useGetProfile as jest.Mock).mockImplementation(realUseGetProfile);

    (API_CLIENT.get as jest.Mock).mockResolvedValueOnce(mockProfileResponse);

    const { result } = renderHook(() => useGetProfile(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual(mockProfileResponse);
    expect(API_CLIENT.get).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.get).toHaveBeenCalledWith(
      API_ENDPOINTS.PROFILE.GET_PROFILE,
    );
  });

  /* -----------------------------------------------------------------------
   * UT-052-Ubah Profile | useProfile.ts | useGetProfile (Negative)
   * ---------------------------------------------------------------------- */
  it("UT-052-Ubah Profile: isError = true dan error message sesuai saat API gagal (Get Profile)", async () => {
    const { useGetProfile: realUseGetProfile } = jest.requireActual(
      "@/lib/api/service/profile/useProfile",
    );
    (useGetProfile as jest.Mock).mockImplementation(realUseGetProfile);

    (API_CLIENT.get as jest.Mock).mockRejectedValueOnce(
      new Error("Profil pengguna tidak ditemukan"),
    );

    const { result } = renderHook(() => useGetProfile(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe(
      "Profil pengguna tidak ditemukan",
    );
  });
});

// =========================================================================
// SECTION 5: HOOK - useUpdateProfile
// =========================================================================

describe("Hook: useUpdateProfile", () => {
  /* -----------------------------------------------------------------------
   * UT-053-Ubah Profile | useProfile.ts | useUpdateProfile (Positive)
   * ---------------------------------------------------------------------- */
  it("UT-053-Ubah Profile: API_CLIENT.put dipanggil dengan endpoint dan data yang benar", async () => {
    const { useUpdateProfile: realUseUpdateProfile } = jest.requireActual(
      "@/lib/api/service/profile/useProfile",
    );
    (useUpdateProfile as jest.Mock).mockImplementation(realUseUpdateProfile);

    const updatePayload = { name: "Nama Baru" };
    const mockUpdateResponse = {
      success: true,
      message: "Profil berhasil diubah",
      data: [{ ...mockProfileData, name: "Nama Baru" }],
    };

    (API_CLIENT.get as jest.Mock).mockResolvedValue({ data: "cache cleared" });
    (API_CLIENT.put as jest.Mock).mockResolvedValueOnce(mockUpdateResponse);

    const { result } = renderHook(() => useUpdateProfile(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(updatePayload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isSuccess).toBe(true);
    expect(API_CLIENT.put).toHaveBeenCalledTimes(1);
    expect(API_CLIENT.put).toHaveBeenCalledWith(
      API_ENDPOINTS.PROFILE.UPDATE,
      expect.anything(),
    );
  });

  /* -----------------------------------------------------------------------
   * UT-054-Ubah Profile | useProfile.ts | useUpdateProfile (Negative)
   * ---------------------------------------------------------------------- */
  it("UT-054-Ubah Profile: isError = true saat API_CLIENT.put gagal", async () => {
    const { useUpdateProfile: realUseUpdateProfile } = jest.requireActual(
      "@/lib/api/service/profile/useProfile",
    );
    (useUpdateProfile as jest.Mock).mockImplementation(realUseUpdateProfile);

    (API_CLIENT.put as jest.Mock).mockRejectedValueOnce(
      new Error("Gagal memperbarui profil"),
    );

    const { result } = renderHook(() => useUpdateProfile(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({ name: "Test" });
      } catch {
        // expected error
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Gagal memperbarui profil");
  });
});

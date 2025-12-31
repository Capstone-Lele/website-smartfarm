import { LoginRequest, LoginResponse } from "@/types/auth.types";
import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoint";
import { clearSession, createSession } from "@/lib/session";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // const response = await apiClient.post<LoginResponse>(
    //     API_ENDPOINTS.AUTH.LOGIN,
    //     credentials
    // );

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // dummy response for testing
    const response: LoginResponse = {
      success: true,
      message: "Login successful",
      data: {
        expires_at: "2026-01-30 22:37:16",
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdlMDA1MDE5LTAxMGQtNGNjMy04OWJhLTMzYjA4YWY0ZjIxMiIsIm5hbWUiOiJFbXBsb3llZSBVc2VyIDEiLCJlbWFpbCI6ImVtcGxveWVlMUBleGFtcGxlLmNvbSIsInJvbGUiOiJlbXBsb3llZSIsImlhdCI6MTc2NzEwNTQzNiwiZXhwIjoxNzY3MTA5MDM2fQ.O0FR-19jAYz_MtJ9iTW5nvtluyK7leYYXymgXmrv8pM",
        type: "Bearer",
      },
    };

    return response;
  },

  logout: async (): Promise<string> => {
    // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    await clearSession();

    return "success";
  },
};

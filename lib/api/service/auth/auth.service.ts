import { LoginRequest, LoginResponse } from "@/types/auth.types";
import { apiClient } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";
import { clearSession, createSession } from "@/lib/session";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    console.log("Auth Service Login Response: ", response);
    return response;
  },

  logout: async (): Promise<string> => {
    // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    await clearSession();

    return "success";
  },

  getUserInfo: async (): Promise<any> => {
      const response = await apiClient.get<any>(API_ENDPOINTS.AUTH.INFO);
      return response;
  }
};

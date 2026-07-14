import { LoginRequest, LoginResponse, VerifyOtpSend } from "@/types/auth.types";
import { API_CLIENT } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";
import { clearSession, createSession } from "@/lib/session";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await API_CLIENT.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    console.log("Auth Service Login Response: ", response);
    return response;
  },

  logout: async (): Promise<string> => {
    // await API_CLIENT.post(API_ENDPOINTS.AUTH.LOGOUT);
    await clearSession();

    return "success";
  },

  getUserInfo: async (): Promise<any> => {
    const response = await API_CLIENT.get<any>(API_ENDPOINTS.AUTH.INFO);
    return response;
  },

  // verify otp
  verifyOtp: async (credentials: VerifyOtpSend): Promise<LoginResponse> => {
    const response = await API_CLIENT.post<LoginResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      credentials,
    );
    return response;
  },
};

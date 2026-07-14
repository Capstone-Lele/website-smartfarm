'use client';
import { authService } from "@/lib/api/service/auth/auth.service";
import { createSession } from "@/lib/session";
import { LoginRequest, LoginResponse, VerifyOtpSend } from "@/types/auth.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { decodeJwt } from "jose";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (req: LoginRequest) => {
      // Login hanya memvalidasi kredensial & memicu pengiriman OTP ke email.
      // Session akan dibuat setelah OTP berhasil diverifikasi.
      const response = await authService.login(req);
      return response;
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      return await authService.logout();
    },
  });
};

export const useUserInfo = () => {
  return useQuery<any>({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const response = await authService.getUserInfo();
      return response;
    }
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (credentials: VerifyOtpSend) => {
      const response = await authService.verifyOtp(credentials);

      // Setelah OTP berhasil, simpan session
      if (response.data.token && response.data.expires_at) {
        const dataToken = decodeJwt(response.data.token);
        if (dataToken.role !== "admin") {
          throw new Error("Invalid Credentials");
        }
        await createSession(response.data.token, response.data.expires_at);
      }

      return response;
    },
  });
};

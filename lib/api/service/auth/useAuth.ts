'use client';
import { authService } from "@/lib/api/service/auth/auth.service";
import { createSession } from "@/lib/session";
import { LoginRequest, LoginResponse } from "@/types/auth.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { decodeJwt } from "jose";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (req: LoginRequest) => {
      const response = await authService.login(req);

      if (response.data.token && response.data.expires_at) {
        const  dataToken = decodeJwt(response.data.token);
        const expiresAtPlus1Hour = new Date(response.data.expires_at);
        expiresAtPlus1Hour.setHours(expiresAtPlus1Hour.getHours() + 1);
        dataToken.expires_at = expiresAtPlus1Hour.toISOString().replace("T", " ").split(".")[0];
        if (dataToken.role !== "admin") {
          throw new Error("Invalid Credentials");
        }
        await createSession(response.data.token, response.data.expires_at);
      }

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

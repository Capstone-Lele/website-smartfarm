import { authService } from "@/lib/api/service/auth.service";
import { createSession } from "@/lib/session";
import { LoginRequest, LoginResponse } from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (req: LoginRequest) => {
      console.log("Login mutation: ", req);
      const response =  await authService.login(req);

      if (response.data.token && response.data.expires_at) {
        await createSession(response.data.token, response.data.expires_at);
      }

      return response;
    },
    onSuccess: (data) => {
      console.log("Login successful: ", data);
    },
    onError: (error) => {
      console.error("Login failed: ", error);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      return await authService.logout();
    },
    onSuccess: (data) => {
      console.log("Logout successful: ", data);
    },
    onError: (error) => {
      console.error("Logout failed: ", error);
    },
  });
};

import { authService } from "@/lib/api/service/auth.service";
import { LoginRequest } from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";


export const useLogin = () => {
    return useMutation({
        mutationFn: (req: LoginRequest) => {
            console.log("Login mutation: ", req);
            return authService.login(req);
        },
        onSuccess: (data) => {
            console.log("Login successful: ", data);
        },
        onError: (error) => {
            console.error("Login failed: ", error);
        },
    })
};

export const useLogout = () => {
    return useMutation({
        mutationFn: () => {
            return authService.logout();
        },
        onSuccess: (data) => {
            console.log("Logout successful: ", data);
        },
        onError: (error) => {
            console.error("Logout failed: ", error);
        },
    });
};
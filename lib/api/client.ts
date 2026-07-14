"use client";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { getCookiesToken, clearSession } from "../session";
import { SessionPayload } from "@/types/session.types";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(`API Error: ${status}`);
    this.status = status;
    this.data = data;
  }
}

let isRedirecting = false;

function redirectToLogin() {
  if (isRedirecting || typeof window === "undefined") return;
  isRedirecting = true;
  clearSession().finally(() => {
    window.location.href = "/login?message=expired";
  });
}

function isSessionExpired(token: SessionPayload): boolean {
  const expiresAt = new Date(token.expires_at.replace(" ", "T")).getTime();
  return Date.now() >= expiresAt;
}

function isProtectedRoute(): boolean {
  if (typeof window === "undefined") return false;
  const pathname = window.location.pathname;
  // /login dan /otp adalah halaman publik yang tidak butuh session
  return pathname !== "/login" && pathname !== "/" && pathname !== "/otp";
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor — validasi session sebelum kirim request
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getCookiesToken();

    if (!token?.token || isSessionExpired(token)) {
      if (isProtectedRoute()) {
        redirectToLogin();
        return Promise.reject(new Error("Session expired"));
      }
      return config;
    }

    config.headers.Authorization = `Bearer ${token.token}`;

    // Remove Content-Type for FormData so browser sets it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response Interceptor — tangkap 401 dari backend sebagai safety net
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && isProtectedRoute()) {
      redirectToLogin();
    }
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);

export const API_CLIENT = {
  get: <T>(url: string, config?: any) =>
    axiosInstance.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: any, config?: any) =>
    axiosInstance.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: any, config?: any) =>
    axiosInstance.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: any, config?: any) =>
    axiosInstance.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: any) =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
};

export default axiosInstance;

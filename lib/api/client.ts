"use client";
import axios, { AxiosError, AxiosInstance } from "axios";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(`API Error: ${status}`);
    this.status = status;
    this.data = data;
  }
}

const CookieName = "session_token";

/** Hapus cookie session di sisi client */
function deleteClientCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/** Ambil token dari cookie secara langsung di browser */
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CookieName}=`));
  return match ? match.split("=")[1] : null;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Cek token langsung di request, tidak perlu tunggu response
    if (typeof window !== "undefined") {
      const token = getTokenFromCookie();
      const pathname = window.location.pathname;

      if (!token && pathname !== "/login" && pathname !== "/") {
        deleteClientCookie(CookieName);
        window.location.href = "/login?message=Session expired, please log in again";
        return Promise.reject(new Error("Unauthorized: Token not found"));
      }
    }

    // Remove Content-Type for FormData so browser sets it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response Interceptor — handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API Success Response:", response);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      console.log("❌ API Error Response:", error.response.data);

      if (status === 401 && typeof window !== "undefined") {
        const pathname = window.location.pathname;
        if (pathname !== "/login" && pathname !== "/") {
          const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME;
          if (cookieName) deleteClientCookie(cookieName);
          window.location.href =
            "/login?message=Session expired, please log in again";
        }
      }

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

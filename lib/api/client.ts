"use client";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { getCookiesToken } from "../session";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(`API Error: ${status}`);
    this.status = status;
    this.data = data;
  }
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
  async (config: InternalAxiosRequestConfig) => {
    const token = await getCookiesToken();
    console.log("Token Value:", token?.token);

    if (token?.token) {
      config.headers.Authorization = `Bearer ${token.token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API Success Response:", response);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // handle shometing here i am lazy rn
      console.log("❌ API Error Response:", error.response.data);
      // throw new ApiError(error.response.status, error.response.data);
      // return Promise.reject(new ApiError(error.response.status, error.response.data));
      return Promise.reject(error.response.data);
    }
  }
);

export const apiClient = {
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

import { UserResponse } from "@/types/user.types";
import { apiClient } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";
import { DUMMY_USER_RESPONSE as response } from "@/lib/constants/dummy-respoonse/user";

export const userService = {
  getAll: async (): Promise<UserResponse> => {
    // const response = await apiClient.get<UserResponse>(
    //     API_ENDPOINTS.USERS.GET_ALL
    // );
    return response;
  },

  create: async (data: {
    name: string;
    email: string;
    role: string;
    image: File | null;
    password: string;
  }): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>(
      API_ENDPOINTS.USERS.CREATE,
      data
    );
    return response;
  },

  delete: async (id: string): Promise<UserResponse> => {
    const response = await apiClient.delete<UserResponse>(`${API_ENDPOINTS.USERS.DELETE}/${id}`);
    return response;
  },

  update: async (
    id: string,
    data: {
      name: string;
      email: string;
      role: string;
      image: File | null;
      password: string;
    }
  ): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>(
      `${API_ENDPOINTS.USERS.UPDATE}/${id}`,
      data
    );
    return response;
  },
};

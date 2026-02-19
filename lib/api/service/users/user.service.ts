import { UserEditInput, UserFormInput, UserOnlyResponse, UserResponse } from "@/types/user.types";
import { apiClient } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";
import { DUMMY_USER_RESPONSE as response } from "@/lib/constants/dummy-respoonse/user";
import {
  buildPayloadCreate,
  buildPayloadEdit,
} from "@/lib/utils/payload-build";

export const userService = {
  getAll: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>(
      API_ENDPOINTS.USERS.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<UserOnlyResponse> => {
    const response = await apiClient.get<UserOnlyResponse>(
      API_ENDPOINTS.USERS.GET_BY_ID(id),
    );
    return response;
  },

  create: async (data: UserFormInput): Promise<UserResponse> => {
    const payload = buildPayloadCreate(data);
    const response = await apiClient.post<UserResponse>(
      API_ENDPOINTS.USERS.CREATE,
      payload,
    );
    return response;
  },

  delete: async (id: string): Promise<UserResponse> => {
    const response = await apiClient.delete<UserResponse>(
      API_ENDPOINTS.USERS.DELETE(id),
    );
    return response;
  },

  update: async (id: string, data: UserEditInput): Promise<UserResponse> => {
    const payload = buildPayloadEdit(data);
    const response = await apiClient.put<UserResponse>(
      API_ENDPOINTS.USERS.UPDATE(id),
      payload,
    );
    return response;
  },
};

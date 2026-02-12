import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { ByIdVitaminResponse, VitaminResponse } from "@/types/notes/vitamin.types";

export const vitaminService = {
  getAll: async (): Promise<VitaminResponse> => {
    const response = await apiClient.get<VitaminResponse>(
      API_ENDPOINTS.VITAMIN_NOTES.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<ByIdVitaminResponse> => {
    const response = await apiClient.get<ByIdVitaminResponse>(
      API_ENDPOINTS.VITAMIN_NOTES.GET_BY_ID(id),
    );
    return response;
  },
};

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "../../endpoint";
import { CycleResponse } from "@/types/cycle";

export const cycleService = {
  // NOte: this using id of pool
  getAllById: async (id: string): Promise<CycleResponse> => {
    const response = await apiClient.get<CycleResponse>(
      API_ENDPOINTS.CYCLES.GET_ALL_BY_ID(id),
    );
    return response;
  },

//   getDetailById: async (id: string) => {
//     const response = await apiClient.get(`/cycles/detail/${id}`);
//     return response;
//   },
};

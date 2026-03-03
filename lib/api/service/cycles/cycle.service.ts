import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "../../endpoint";
import { CycleDetailResponse, CycleResponse } from "@/types/cycle";

export const cycleService = {
  // NOte: this using id of pool
  getAllById: async (id: string): Promise<CycleResponse> => {
    const response = await API_CLIENT.get<CycleResponse>(
      API_ENDPOINTS.CYCLES.GET_ALL_BY_ID(id),
    );
    return response;
  },

  // Note: this using id of pool
  getDetailById: async (id: string): Promise<CycleDetailResponse> => {
    const response = await API_CLIENT.get<CycleDetailResponse>(
      API_ENDPOINTS.CYCLES.GET_DETAIL_BY_ID(id),
    );
    return response;
  },
};

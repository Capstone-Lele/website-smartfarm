import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { ByIdHarvestResponse, HarvestResponse } from "@/types/notes/harvest";

export const harvestService = {
  getAll: async (): Promise<HarvestResponse> => {
    const response = await API_CLIENT.get<HarvestResponse>(
      API_ENDPOINTS.HARVEST_NOTES.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<ByIdHarvestResponse> => {
    const response = await API_CLIENT.get<ByIdHarvestResponse>(
      API_ENDPOINTS.HARVEST_NOTES.GET_BY_ID(id),
    );
    return response;
  },
};

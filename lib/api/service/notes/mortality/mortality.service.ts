import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { ByIdMortalityResponse, MortalityResponse } from "@/types/notes/mortality";

export const mortalityService = {
  getAll: async (): Promise<MortalityResponse> => {
    const response = await API_CLIENT.get<MortalityResponse>(
      API_ENDPOINTS.MORTALITY_NOTES.GET_ALL,
    );
    return response;
  },

  getAllWithParams: async (params: Record<string, string>): Promise<MortalityResponse> => {
    const response = await API_CLIENT.get<MortalityResponse>(
      API_ENDPOINTS.MORTALITY_NOTES.GET_ALL_WITH_PARAMS(params),
    );
    return response;
  },

  getById: async (id: string): Promise<ByIdMortalityResponse> => {
    const response = await API_CLIENT.get<ByIdMortalityResponse>(
      API_ENDPOINTS.MORTALITY_NOTES.GET_BY_ID(id),
    );
    return response;
  },
};

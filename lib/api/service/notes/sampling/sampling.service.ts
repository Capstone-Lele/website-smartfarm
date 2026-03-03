import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { SamplingResponse } from "@/types/notes/sampling.types";

export const samplingService = {
  getAll: async (): Promise<SamplingResponse> => {
    const response = await API_CLIENT.get<SamplingResponse>(
      API_ENDPOINTS.SAMPLING_NOTES.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<SamplingResponse> => {
    const response = await API_CLIENT.get<SamplingResponse>(
      API_ENDPOINTS.SAMPLING_NOTES.GET_BY_ID(id),
    );
    return response;
  },
};

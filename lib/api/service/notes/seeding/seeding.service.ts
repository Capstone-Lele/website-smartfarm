import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { ByIdSeedResponse, SeedResponse } from "@/types/notes/seed";

export const seedingService = {
  getAll: async (): Promise<SeedResponse> => {
    const response = await API_CLIENT.get<SeedResponse>(
      API_ENDPOINTS.SEED_NOTES.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<ByIdSeedResponse> => {
    const response = await API_CLIENT.get<ByIdSeedResponse>(
      API_ENDPOINTS.SEED_NOTES.GET_BY_ID(id),
    );
    return response;
  },
};

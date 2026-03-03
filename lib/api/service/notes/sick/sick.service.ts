import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { ByIdSickResponse, SickResponse } from "@/types/notes/sick.types";

export const sickService = {
  getAll: async (): Promise<SickResponse> => {
    const response = await API_CLIENT.get<SickResponse>(
      API_ENDPOINTS.SICK_NOTES.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<ByIdSickResponse> => {
    const response = await API_CLIENT.get<ByIdSickResponse>(
      API_ENDPOINTS.SICK_NOTES.GET_BY_ID(id),
    );
    return response;
  },
};

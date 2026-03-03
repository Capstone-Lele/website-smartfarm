import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { MovePoolResponse } from "@/types/notes/move";

export const moveService = {
  getAll: async (): Promise<MovePoolResponse> => {
    const response = await API_CLIENT.get<MovePoolResponse>(
      API_ENDPOINTS.MOVE_NOTES.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<MovePoolResponse> => {
    const response = await API_CLIENT.get<MovePoolResponse>(
      API_ENDPOINTS.MOVE_NOTES.GET_BY_ID(id),
    );
    return response;
  },
};

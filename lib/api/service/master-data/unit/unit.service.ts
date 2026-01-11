import { ResponseDefault } from "@/types/response";
import { apiClient } from "../../../client";
import { API_ENDPOINTS } from "../../../endpoint";
import { DUMMY_UNIT_RESPONSE as response } from "@/lib/constants/dummy-respoonse/unit";
import {
  UnitResponse,
  Unit,
  UnitRequest,
} from "@/types/master-data/unit.types";

export const unitService = {
  getAll: async (): Promise<UnitResponse> => {
    const response = await apiClient.get<UnitResponse>(
      API_ENDPOINTS.MASTER_DATA.UNIT.GET_ALL
    );
    return response;
  },

  create: async (data: UnitRequest): Promise<UnitResponse> => {
    const response = await apiClient.post<UnitResponse>(
      API_ENDPOINTS.MASTER_DATA.UNIT.CREATE,
      {
        name: { value: data.name },
      }
    );
    return response;
  },

  delete: async (id: string): Promise<ResponseDefault> => {
    const response = await apiClient.delete<ResponseDefault>(API_ENDPOINTS.MASTER_DATA.UNIT.DELETE(id));
    return response;
  },

  update: async (id: string, data: UnitRequest): Promise<ResponseDefault> => {
    const response = await apiClient.put<ResponseDefault>(
      API_ENDPOINTS.MASTER_DATA.UNIT.UPDATE(id),
      {
        name: { value: data.name },
      }
    );
    return response;
  },
};

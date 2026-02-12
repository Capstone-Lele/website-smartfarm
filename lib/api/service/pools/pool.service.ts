import { ResponseDefault } from "@/types/response";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { PoolResponse, Pool, PoolRequest, ByIdPoolResponse } from "@/types/pool.types";
import { buildPayloadCreate, buildPayloadEdit } from "@/lib/utils/payload-build";
// import { KOLAM_DUMMY_RESPONSE } from "@/lib/constants/dummy-respoonse/kolam";

export const poolService = {
  getAll: async (): Promise<PoolResponse> => {
    const response = await apiClient.get<PoolResponse>(
      API_ENDPOINTS.POOLS.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<ByIdPoolResponse> => {
    const response = await apiClient.get<ByIdPoolResponse>(
      API_ENDPOINTS.POOLS.GET_BY_ID(id),
    );
    return response;
  },

  create: async (data: PoolRequest): Promise<PoolResponse> => {
    const payload  = buildPayloadCreate(data);
    const response = await apiClient.post<PoolResponse>(
      API_ENDPOINTS.POOLS.CREATE,
      payload,
    );
    return response;
  },

  delete: async (id: string): Promise<ResponseDefault> => {
    const response = await apiClient.delete<ResponseDefault>(
      API_ENDPOINTS.POOLS.DELETE(id),
    );
    return response;
  },

  update: async (id: string, data: PoolRequest): Promise<ResponseDefault> => {
    const payload  = buildPayloadEdit(data);
    const response = await apiClient.put<ResponseDefault>(
      API_ENDPOINTS.POOLS.UPDATE(id),
      payload,
    );
    return response;
  },
};

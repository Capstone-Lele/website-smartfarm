import { ResponseDefault } from "@/types/response";
import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import {
  PoolResponse,
  Pool,
  PoolRequest,
  ByIdPoolResponse,
} from "@/types/pool.types";
import {
  buildPayloadCreate,
  buildPayloadEdit,
} from "@/lib/utils/payload-build";
// import { KOLAM_DUMMY_RESPONSE } from "@/lib/constants/dummy-respoonse/kolam";

export const poolService = {
  getAll: async (): Promise<PoolResponse> => {
    const response = await API_CLIENT.get<PoolResponse>(
      API_ENDPOINTS.POOLS.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<ByIdPoolResponse> => {
    const response = await API_CLIENT.get<ByIdPoolResponse>(
      API_ENDPOINTS.POOLS.GET_BY_ID(id),
    );
    return response;
  },

  create: async (data: PoolRequest): Promise<PoolResponse> => {
    const payload = buildPayloadCreate(data);
    const response = await API_CLIENT.post<PoolResponse>(
      API_ENDPOINTS.POOLS.CREATE,
      payload,
    );
    return response;
  },

  delete: async (id: string): Promise<ResponseDefault> => {
    const response = await API_CLIENT.delete<ResponseDefault>(
      API_ENDPOINTS.POOLS.DELETE(id),
    );
    return response;
  },

  update: async (id: string, data: PoolRequest): Promise<ResponseDefault> => {
    const payload = buildPayloadEdit(data);
    const response = await API_CLIENT.put<ResponseDefault>(
      API_ENDPOINTS.POOLS.UPDATE(id),
      payload,
    );
    return response;
  },
};

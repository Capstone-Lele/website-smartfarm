import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { ResponseDefault } from "@/types/response";
import {
  buildPayloadCreate,
  buildPayloadEdit,
} from "@/lib/utils/payload-build";

export const productService = {
  getAll: async (): Promise<ResponseDefault> => {
    const response = await apiClient.get<ResponseDefault>(
      API_ENDPOINTS.MASTER_DATA.PRODUCT.GET_ALL,
    );
    return response;
  },

  create: async (data: any): Promise<ResponseDefault> => {
    const payload = buildPayloadCreate(data);
    const response = await apiClient.post<ResponseDefault>(
      API_ENDPOINTS.MASTER_DATA.PRODUCT.CREATE,
      payload,
    );
    return response;
  },

  delete: async (id: string): Promise<ResponseDefault> => {
    const response = await apiClient.delete<ResponseDefault>(
      API_ENDPOINTS.MASTER_DATA.PRODUCT.DELETE(id),
    );
    return response;
  },
  update: async (id: string, data: any): Promise<ResponseDefault> => {
    const payload = buildPayloadEdit(data);
    const response = await apiClient.put<ResponseDefault>(
      API_ENDPOINTS.MASTER_DATA.PRODUCT.UPDATE(id),
      payload,
    );
    return response;
  },
};

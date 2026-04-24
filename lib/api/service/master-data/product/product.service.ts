import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { ResponseDefault } from "@/types/response";
import {
  buildPayloadCreate,
  buildPayloadEdit,
} from "@/lib/utils/payload-build";
import { ProductResponse } from "@/types/master-data/product.types";

export const productService = {
  getAll: async (): Promise<ProductResponse> => {
    const response = await API_CLIENT.get<ProductResponse>(
      API_ENDPOINTS.MASTER_DATA.PRODUCT.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<ProductResponse> => {
    const response = await API_CLIENT.get<ProductResponse>(
      API_ENDPOINTS.MASTER_DATA.PRODUCT.GET_BY_ID(id),
    );
    return response;
  },

  create: async (data: any): Promise<ResponseDefault> => {
    const payload = buildPayloadCreate(data);
    const response = await API_CLIENT.post<ResponseDefault>(
      API_ENDPOINTS.MASTER_DATA.PRODUCT.CREATE,
      payload,
    );
    return response;
  },

  delete: async (id: string): Promise<ResponseDefault> => {
    const response = await API_CLIENT.delete<ResponseDefault>(
      API_ENDPOINTS.MASTER_DATA.PRODUCT.DELETE(id),
    );
    return response;
  },
  update: async (id: string, data: any): Promise<ResponseDefault> => {
    const payload = buildPayloadEdit(data);
    const response = await API_CLIENT.put<ResponseDefault>(
      API_ENDPOINTS.MASTER_DATA.PRODUCT.UPDATE(id),
      payload,
    );
    return response;
  },

  // New method to get product usage
  getProductUsage: async (): Promise<ResponseDefault> => {
    const response = await API_CLIENT.get<ResponseDefault>(
      API_ENDPOINTS.MASTER_DATA.PRODUCT.GET_PRODUCT_USAGE,
    );
    return response;
  },
};

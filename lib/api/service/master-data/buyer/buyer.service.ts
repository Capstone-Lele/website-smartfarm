import { apiClient } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/endpoint"
import { buildPayloadCreate, buildPayloadEdit } from "@/lib/utils/payload-build";
import { BuyerResponse } from "@/types/master-data/buyer.types"

export const buyerService = {
  getAll: async (): Promise<BuyerResponse> => {
    const response = await apiClient.get<BuyerResponse>(
        API_ENDPOINTS.BUYER.GET_ALL,
    );
    return response;
  },
  getById: async (id: string): Promise<BuyerResponse> => {
    const response = await apiClient.get<BuyerResponse>(
        API_ENDPOINTS.BUYER.GET_BY_ID(id),
    );
    return response;
  },
  create: async (data: any): Promise<BuyerResponse> => {
    const payload = buildPayloadCreate(data);
    const response = await apiClient.post<BuyerResponse>(
        API_ENDPOINTS.BUYER.CREATE,
        payload,
    );
    return response;
  },
  delete: async (id: string): Promise<BuyerResponse> => {
    const response = await apiClient.delete<BuyerResponse>(
        API_ENDPOINTS.BUYER.DELETE(id),
    );
    return response;
  },
  update: async (id: string, data: any): Promise<BuyerResponse> => {
    const payload = buildPayloadEdit(data);
    const response = await apiClient.put<BuyerResponse>(
        API_ENDPOINTS.BUYER.UPDATE(id),
        payload,
    );
    return response;
  },
};
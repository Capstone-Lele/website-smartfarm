import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import {
  buildPayloadCreate,
  buildPayloadEdit,
} from "@/lib/utils/payload-build";
import { BuyerResponse } from "@/types/master-data/buyer.types";

export const buyerService = {
  getAll: async (): Promise<BuyerResponse> => {
    const response = await API_CLIENT.get<BuyerResponse>(
      API_ENDPOINTS.BUYER.GET_ALL,
    );
    return response;
  },
  getById: async (id: string): Promise<BuyerResponse> => {
    const response = await API_CLIENT.get<BuyerResponse>(
      API_ENDPOINTS.BUYER.GET_BY_ID(id),
    );
    return response;
  },
  create: async (data: any): Promise<BuyerResponse> => {
    const payload = buildPayloadCreate(data);
    const response = await API_CLIENT.post<BuyerResponse>(
      API_ENDPOINTS.BUYER.CREATE,
      payload,
    );
    return response;
  },
  delete: async (id: string): Promise<BuyerResponse> => {
    const response = await API_CLIENT.delete<BuyerResponse>(
      API_ENDPOINTS.BUYER.DELETE(id),
    );
    return response;
  },
  update: async (id: string, data: any): Promise<BuyerResponse> => {
    const payload = buildPayloadEdit(data);
    const response = await API_CLIENT.put<BuyerResponse>(
      API_ENDPOINTS.BUYER.UPDATE(id),
      payload,
    );
    return response;
  },
};

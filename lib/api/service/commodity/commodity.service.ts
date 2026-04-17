import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { CommodityByIdAndSourceIdResponse, CommodityByIdAndTypeOUT, CommodityRequest, CommodityResponse } from "@/types/comodity";

export const commodityService = {
  getAll: async (): Promise<CommodityResponse> => {
    const response = await API_CLIENT.get<CommodityResponse>(
      API_ENDPOINTS.COMMODITY.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<CommodityResponse> => {
    const response = await API_CLIENT.get<CommodityResponse>(
      API_ENDPOINTS.COMMODITY.GET_BY_ID(id),
    );
    return response;
  },

  create: async (data: FormData): Promise<CommodityRequest> => {
    const response = await API_CLIENT.post<CommodityRequest>(
      API_ENDPOINTS.COMMODITY.CREATE,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  },

  getCommodityByIdAndType: async (
    id: string,
    sourceType: string,
  ): Promise<CommodityByIdAndSourceIdResponse> => {
    const response = await API_CLIENT.get<CommodityByIdAndSourceIdResponse>(
      API_ENDPOINTS.COMMODITY.GET_COMMODITY_BY_ID_AND_TYPE(id, sourceType),
    );
    return response;
  },

  getCommodityByIdAndTypeOut: async (
    id: string,
    sourceType: string,
  ): Promise<CommodityByIdAndTypeOUT> => {
    const response = await API_CLIENT.get<CommodityByIdAndTypeOUT>(
      API_ENDPOINTS.COMMODITY.GET_COMMODITY_BY_ID_AND_TYPE(id, sourceType),
    );
    return response;
  },
};

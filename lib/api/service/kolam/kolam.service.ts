import { ResponseDefault } from "@/types/response";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { KolamResponse, Kolam, KolamRequest } from "@/types/kolam.types";
// import { KOLAM_DUMMY_RESPONSE } from "@/lib/constants/dummy-respoonse/kolam";

export const kolamService = {
  getAll: async (): Promise<KolamResponse> => {
    const response = await apiClient.get<KolamResponse>(
      API_ENDPOINTS.POOLS.GET_ALL,
    );
    return response;
  },

  create: async (data: KolamRequest): Promise<KolamResponse> => {
    const response = await apiClient.post<KolamResponse>(
      API_ENDPOINTS.POOLS.CREATE,
      {
        name: { value: data.name },
        kategori: { value: data.kategori },
        ukuran: { value: data.ukuran },
        kondisi: { value: data.kondisi },
        siklus: { value: data.siklus },
        ikan: { value: data.ikan },
        kematian: { value: data.kematian },
        umur: { value: data.umur },
        status_air: { value: data.status_air },
      },
    );
    return response;
  },

  delete: async (id: string): Promise<ResponseDefault> => {
    const response = await apiClient.delete<ResponseDefault>(
      API_ENDPOINTS.POOLS.DELETE(id),
    );
    return response;
  },

  update: async (id: string, data: KolamRequest): Promise<ResponseDefault> => {
    const response = await apiClient.put<ResponseDefault>(
      API_ENDPOINTS.POOLS.UPDATE(id),
      {
        name: { value: data.name },
        kategori: { value: data.kategori },
        ukuran: { value: data.ukuran },
        kondisi: { value: data.kondisi },
        siklus: { value: data.siklus },
        ikan: { value: data.ikan },
        kematian: { value: data.kematian },
        umur: { value: data.umur },
        status_air: { value: data.status_air },
      },
    );
    return response;
  },
};

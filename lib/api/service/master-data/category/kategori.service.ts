import { Kategori, KategoriResponse } from "@/types/master-data/kategori.types";
import { apiClient } from "../../../client";
import { API_ENDPOINTS } from "../../../endpoint";
// import { dummyKategoriResponse as response } from "@/lib/constants/dummy-respoonse/kategori";

export const kategoriService = {
  getAll: async (): Promise<KategoriResponse> => {
    const response = await apiClient.get<KategoriResponse>(
        API_ENDPOINTS.MASTER_DATA.KATEGORI.GET_ALL
    );
    return response;
  },
};

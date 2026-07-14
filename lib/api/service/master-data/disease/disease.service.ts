import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { DiseaseFormInput, DiseaseResponse } from "@/types/master-data/disease.types";

export const diseaseService = {
  getAll: async (): Promise<DiseaseResponse> => {
    const response = await API_CLIENT.get<DiseaseResponse>(
        API_ENDPOINTS.MASTER_DATA.DISEASE.GET_ALL,
    );
    return response;
  },
  getById: async (id: string): Promise<DiseaseResponse> => {
    const response = await API_CLIENT.get<DiseaseResponse>(
        API_ENDPOINTS.MASTER_DATA.DISEASE.GET_BY_ID(id)
    );
    return response;
  },
  create: async (data: DiseaseFormInput): Promise<DiseaseResponse> => {
    const response = await API_CLIENT.post<DiseaseResponse>(
        API_ENDPOINTS.MASTER_DATA.DISEASE.CREATE,
        data
    );
    return response;
  },
  update: async (id: string, data: DiseaseFormInput): Promise<DiseaseResponse> => {
    const response = await API_CLIENT.put<DiseaseResponse>(
        API_ENDPOINTS.MASTER_DATA.DISEASE.UPDATE(id),
        data
    );
    return response;
  },
  delete: async (id: string): Promise<DiseaseResponse> => {
    const response = await API_CLIENT.delete<DiseaseResponse>(
        API_ENDPOINTS.MASTER_DATA.DISEASE.DELETE(id)
    );
    return response;
  }
};

import {
  InventorySubmissionDetailResponse,
  InventorySubmissionResponse,
} from "@/types/inventory";
import { API_CLIENT } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";
import { buildPayloadEdit } from "@/lib/utils/payload-build";

export const inventorySubmissionService = {
  getAll: async (): Promise<InventorySubmissionResponse> => {
    const response = await API_CLIENT.get<InventorySubmissionResponse>(
      API_ENDPOINTS.INVENTORY_SUBMISSION.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<InventorySubmissionDetailResponse> => {
    const response = await API_CLIENT.get<InventorySubmissionDetailResponse>(
      API_ENDPOINTS.INVENTORY_SUBMISSION.GET_BY_ID(id),
    );
    return response;
  },

  update: async (id: string, data: any): Promise<InventorySubmissionDetailResponse> => {
    const payload = buildPayloadEdit(data);
    const response = await API_CLIENT.put<InventorySubmissionDetailResponse>(
      API_ENDPOINTS.INVENTORY_SUBMISSION.UPDATE(id),
      payload,
    );
    return response;
  },
};

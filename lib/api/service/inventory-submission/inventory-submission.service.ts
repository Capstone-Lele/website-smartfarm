import {
  InventorySubmissionDetailResponse,
  InventorySubmissionResponse,
} from "@/types/inventory";
import { API_CLIENT } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";

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
};

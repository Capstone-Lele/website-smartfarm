import { InventoryResponse } from "@/types/inventory";
import { API_CLIENT } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";
import { buildPayloadCreate } from "@/lib/utils/payload-build";

export const inventoryService = {
  getAll: async (): Promise<InventoryResponse> => {
    const response = await API_CLIENT.get<InventoryResponse>(
      API_ENDPOINTS.INVENTORY.GET_ALL,
    );
    return response;
  },
  create: async (data: any): Promise<InventoryResponse> => {
        const payload = buildPayloadCreate(data);
    const response = await API_CLIENT.post<InventoryResponse>(
      API_ENDPOINTS.INVENTORY.CREATE,
        payload,
    );
    return response;
  },
  delete: async (id: string): Promise<InventoryResponse> => {
    const response = await API_CLIENT.delete<InventoryResponse>(
      API_ENDPOINTS.INVENTORY.DELETE(id),
    );
    return response;
  },
};

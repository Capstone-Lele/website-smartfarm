import { ResponseDetailNonInventory } from "@/types/non-inventory";
import { API_CLIENT } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";

export const nonInventoryService = {
  getById: async (id: string): Promise<ResponseDetailNonInventory> => {
    const response = await API_CLIENT.get<ResponseDetailNonInventory>(
      API_ENDPOINTS.NON_INVENTORY.GET_BY_ID(id),
    );
    return response;
  },
};

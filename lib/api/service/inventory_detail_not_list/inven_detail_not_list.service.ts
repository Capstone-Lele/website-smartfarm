import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { InventoryResponseParamNoteDataNotList } from "@/types/inventory";

export const inventoryDetailNotListService = {
  getInvenDetailNotList: async (
    note_id: string,
  ): Promise<InventoryResponseParamNoteDataNotList> => {
    const response =
      await API_CLIENT.get<InventoryResponseParamNoteDataNotList>(
        API_ENDPOINTS.INVENTORY_NOTE_DETAIL_NOT_LIST(note_id),
      );
    return response;
  },
};

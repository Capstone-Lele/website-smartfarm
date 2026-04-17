import {
  InventoryCreateRequest,
  InventoryResponse,
  InventoryResponseParamConsumption,
  InventoryResponseParamConsumptionData,
  InventoryResponseParamNoteData,
  InventoryResponseParamSubmission,
  InventoryResponseParamSubmissionData,
} from "@/types/inventory";
import { API_CLIENT } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";
import {
  buildPayloadCreate,
  buildPayloadEdit,
} from "@/lib/utils/payload-build";
import { RequestInventoryTransaction } from "@/types/inventory-transaction";

export const inventoryService = {
  getAll: async (): Promise<InventoryResponse> => {
    const response = await API_CLIENT.get<InventoryResponse>(
      API_ENDPOINTS.INVENTORY.GET_ALL,
    );
    return response;
  },
  create: async (data: any): Promise<InventoryCreateRequest> => {
    const payload = buildPayloadCreate(data);
    const response = await API_CLIENT.post<InventoryCreateRequest>(
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
  update: async (id: string, data: any): Promise<InventoryResponse> => {
    const payload = buildPayloadEdit(data);
    const response = await API_CLIENT.put<InventoryResponse>(
      API_ENDPOINTS.INVENTORY.UPDATE(id),
      payload,
    );
    return response;
  },

  // Detail Inventory atau data in outnya
  getByIdParamSubmission: async (
    id: string,
    params: Record<string, string>,
  ): Promise<InventoryResponseParamSubmissionData> => {
    const response = await API_CLIENT.get<InventoryResponseParamSubmissionData>(
      API_ENDPOINTS.INVENTORY.GET_BY_ID_WITH_PARAMS(id, params),
    );
    return response;
  },
  getByIdParamNote: async (
    id: string,
    params: Record<string, string>,
  ): Promise<InventoryResponseParamNoteData> => {
    const response = await API_CLIENT.get<InventoryResponseParamNoteData>(
      API_ENDPOINTS.INVENTORY.GET_BY_ID_WITH_PARAMS(id, params),
    );
    return response;
  },
  getByIdParamConsumption: async (
    id: string,
    params: Record<string, string>,
  ): Promise<InventoryResponseParamConsumptionData> => {
    const response = await API_CLIENT.get<InventoryResponseParamConsumptionData>(
      API_ENDPOINTS.INVENTORY.GET_BY_ID_WITH_PARAMS(id, params),
    );
    return response;
  },

  // Post Transaction
  postTransaction: async (data: any): Promise<RequestInventoryTransaction> => {
    const payload = buildPayloadEdit(data);
    const response = await API_CLIENT.post<RequestInventoryTransaction>(
      API_ENDPOINTS.INVENTORY.POST_TRANSACTION,
      payload,
    );
    return response;
  },
};

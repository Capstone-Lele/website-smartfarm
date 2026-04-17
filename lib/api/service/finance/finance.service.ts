import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { RequestNonInventoryFinance, ResponseFinanceBySourceId } from "@/types/finance/finance";
import { ResponseFinanceInventory } from "@/types/finance/finance-inventory";
import { ResponseFinanceNonInventory } from "@/types/finance/finance-non-inventory";
import { ResponseFinanceInventorySubmission } from "@/types/finance/finance-inventory-submission";
import { ResponseFinanceCommodity } from "@/types/finance/finance-commodity";
import { buildPayloadCreate } from "@/lib/utils/payload-build";

export const financeService = {
  getFinanceBySourceId: async (
    sourceId: string,
  ): Promise<ResponseFinanceBySourceId> => {
    const response = await API_CLIENT.get<ResponseFinanceBySourceId>(
      API_ENDPOINTS.FINANCES.GET_FINANCE_BY_SOURCE_ID(sourceId),
    );
    return response;
  },

  getInventory: async (): Promise<ResponseFinanceInventory> => {
    const response = await API_CLIENT.get<ResponseFinanceInventory>(
      API_ENDPOINTS.FINANCES.GET_INVENTORY,
    );
    return response;
  },

  getNonInventory: async (): Promise<ResponseFinanceNonInventory> => {
    const response = await API_CLIENT.get<ResponseFinanceNonInventory>(
      API_ENDPOINTS.FINANCES.GET_NON_INVENTORY,
    );
    return response;
  },

  getInventorySubmission:
    async (): Promise<ResponseFinanceInventorySubmission> => {
      const response = await API_CLIENT.get<ResponseFinanceInventorySubmission>(
        API_ENDPOINTS.FINANCES.GET_INVENTORY_SUBMISSION,
      );
      return response;
    },

  getCommodity: async (): Promise<ResponseFinanceCommodity> => {
    const response = await API_CLIENT.get<ResponseFinanceCommodity>(
      API_ENDPOINTS.FINANCES.GET_COMMODITY,
    );
    return response;
  },

  /* POST NON INVENTROYR */
  postNonInventory: async (data:any): Promise<RequestNonInventoryFinance> => {
    const payload = buildPayloadCreate(data)
    const response = await API_CLIENT.post<RequestNonInventoryFinance>(
      API_ENDPOINTS.FINANCES.CREATE,
      payload
    );
    return response;
  },
};

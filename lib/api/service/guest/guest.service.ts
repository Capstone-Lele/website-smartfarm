import { GeneralInfoResponse } from "@/types/guest";
import { API_CLIENT } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";
import { ResponseFinanceNonInventory } from "@/types/finance/finance-non-inventory";
import { ResponseFinanceInventory } from "@/types/finance/finance-inventory";
import { ResponseFinanceInventorySubmission } from "@/types/finance/finance-inventory-submission";
import { ResponseFinanceCommodity } from "@/types/finance/finance-commodity";

export const guestService = {
  getGeneralInfo: async (): Promise<GeneralInfoResponse> => {
    const response = await API_CLIENT.get<GeneralInfoResponse>(
        API_ENDPOINTS.GUEST.GENERAL_INFO,   
    );
    return response;
  },

  // PUBLIC FINANCE
  getPublicFinanceInventory: async (): Promise<ResponseFinanceInventory> => {
    const response = await API_CLIENT.get<ResponseFinanceInventory>(
      API_ENDPOINTS.GUEST.GET_PUBLIC_FINANCE_INVENTORY,
    );
    return response;
  },

  getPublicFinanceNonInventory: async (): Promise<ResponseFinanceNonInventory> => {
    const response = await API_CLIENT.get<ResponseFinanceNonInventory>(
      API_ENDPOINTS.GUEST.GET_PUBLIC_FINANCE_NON_INVENTORY,
    );
    return response;
  },

  getPublicFinanceInventorySubmission:
    async (): Promise<ResponseFinanceInventorySubmission> => {
      const response = await API_CLIENT.get<ResponseFinanceInventorySubmission>(
        API_ENDPOINTS.GUEST.GET_PUBLIC_FINANCE_INVENTORY_SUBMISSION,
      );
      return response;
    },

  getPublicFinanceCommodity: async (): Promise<ResponseFinanceCommodity> => {
    const response = await API_CLIENT.get<ResponseFinanceCommodity>(
      API_ENDPOINTS.GUEST.GET_PUBLIC_FINANCE_COMMODITY,
    );
    return response;
  },
};
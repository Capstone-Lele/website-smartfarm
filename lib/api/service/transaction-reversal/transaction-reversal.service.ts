import { API_ENDPOINTS } from "../../endpoint";
import { API_CLIENT } from "../../client";

export const transactionReversalServeice = {
  createTransactionReversalInventoryNote: async (transaction_id: string) => {
    const response = await API_CLIENT.post(
      API_ENDPOINTS.REVERSAL_INVENTORY_NOTE(transaction_id),
    );
    return response;
  },
  createTransactionReversalNonInventoryNote: async (transaction_id: string) => {
    const response = await API_CLIENT.post(
      API_ENDPOINTS.REVERSAL_NON_INVENTORY_NOTE(transaction_id),
    );
    return response;
  },
  createTransactionReversalCommodity: async (transaction_id: string) => {
    const response = await API_CLIENT.post(
      API_ENDPOINTS.REVERSAL_COMMODITY(transaction_id),
    );
    return response;
  },
};

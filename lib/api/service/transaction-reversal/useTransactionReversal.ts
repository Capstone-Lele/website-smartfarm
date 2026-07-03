import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionReversalServeice } from "./transaction-reversal.service";

export const useCreateTransactionReversalInventoryNote = (transaction_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createTransactionReversalInventoryNote", transaction_id],
    mutationFn: async () => {
      const response =
        await transactionReversalServeice.createTransactionReversalInventoryNote(
          transaction_id,
        );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getInventoryNotesByIdWithParams"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getInventorySubmissionByIdWithParams"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getInventoryConsumptionByIdWithParams"],
      });
      queryClient.invalidateQueries({ queryKey: ["getInventory"] });
      queryClient.invalidateQueries({ queryKey: ["getInventoryById"] });
      queryClient.invalidateQueries({
        queryKey: ["getInventoryByIdWithParams"],
      });
    },
  });
};

export const useCreateTransactionReversalNonInventoryNote = (transaction_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createTransactionReversalNonInventoryNote", transaction_id],
    mutationFn: async () => {
      const response =
        await transactionReversalServeice.createTransactionReversalNonInventoryNote(
          transaction_id,
        );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getFinanceNonInventory"] });
      queryClient.invalidateQueries({ queryKey: ["getNonInventory"] });
      queryClient.invalidateQueries({ queryKey: ["getNonInventoryById"] });
      queryClient.invalidateQueries({ queryKey: ["getNonInventoryByIdWithParams"] });
    },
  });
};

export const useCreateTransactionReversalCommodity = (transaction_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createTransactionReversalCommodity", transaction_id],
    mutationFn: async () => {
      const response =
        await transactionReversalServeice.createTransactionReversalCommodity(
          transaction_id,
        );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCommodity"] });
      queryClient.invalidateQueries({ queryKey: ["getCommodityById"] });
      queryClient.invalidateQueries({ queryKey: ["getCommodityByIdWithParams"] });
    },
  });
};

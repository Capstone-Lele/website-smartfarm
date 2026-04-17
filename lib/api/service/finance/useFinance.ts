import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { financeService } from "./finance.service";
import { RequestNonInventoryFinance } from "@/types/finance/finance";

export const useFinanceBySourceId = (sourceId: string) => {
  return useQuery({
    queryKey: ["getFinanceBySourceId", sourceId],
    queryFn: async () => {
      const response = await financeService.getFinanceBySourceId(sourceId);
      return response.data;
    },
    enabled: !!sourceId,
  });
};

export const useFinanceInventory = () => {
  return useQuery({
    queryKey: ["getFinanceInventory"],
    queryFn: async () => {
      const response = await financeService.getInventory();
      return response.data;
    },
  });
};

export const useFinanceNonInventory = () => {
  return useQuery({
    queryKey: ["getFinanceNonInventory"],
    queryFn: async () => {
      const response = await financeService.getNonInventory();
      return response.data;
    },
  });
};

export const useFinanceInventorySubmission = () => {
  return useQuery({
    queryKey: ["getFinanceInventorySubmission"],
    queryFn: async () => {
      const response = await financeService.getInventorySubmission();
      return response.data;
    },
  });
};

export const useFinanceCommodity = () => {
  return useQuery({
    queryKey: ["getFinanceCommodity"],
    queryFn: async () => {
      const response = await financeService.getCommodity();
      return response.data;
    },
  });
};

export const usePostNonInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RequestNonInventoryFinance) => {
      const response = await financeService.postNonInventory(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getFinanceNonInventory"] });
    },
  });
};

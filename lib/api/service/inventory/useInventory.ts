import { InventoryDetailWithParamResponse, InventoryResponse, InventoryResponseParamConsumption, InventoryResponseParamConsumptionData, InventoryResponseParamNote, InventoryResponseParamNoteData, InventoryResponseParamSubmission, InventoryResponseParamSubmissionData } from "@/types/inventory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "./inventory.service";
import { InventoryResponseById } from "@/types/notes/inventory";

export const useInventory = () => {
  return useQuery<InventoryResponse>({
    queryKey: ["getInventory"],
    queryFn: async () => {
      const response = await inventoryService.getAll();
      return response;
    },
  });
};

export const useInventoryById = (id: string) => {
  return useQuery<InventoryResponseById>({
    queryKey: ["getInventoryById", id],
    queryFn: async () => {
      const response = await inventoryService.getById(id);
      return response;
    },
    enabled: !!id,
  });
}

export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createInventory"],
    mutationFn: async (data: any) => {
      const response = await inventoryService.create(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getInventory"] });
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateInventory"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await inventoryService.update(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getInventory"] });
    },
  });
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteInventory"],
    mutationFn: async (id: string) => {
      const response = await inventoryService.delete(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getInventory"] });
    },
  });
};

// export const useStockInOut = (inventoryId: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationKey: ["stockInOut", inventoryId],
//     mutationFn: async (data: FormData) => {
//       const response = await inventoryService.stockInOut(inventoryId, data);
//       return response;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["getInventory"] });
//     },
//   });
// };

export const useGetInventoryByIdWithParams = (id: string, params: Record<string, string>) => {
  return useQuery<InventoryDetailWithParamResponse>({
    queryKey: ["getInventoryByIdWithParams", id, params],
    queryFn: async () => {
      const response = await inventoryService.getByIdParamAll(id, params);
      return response;
    },
  });
}

export const useGetInventoryNotesByIdWithParams = (id: string, params: Record<string, string>) => {
  return useQuery<InventoryResponseParamNoteData>({
    queryKey: ["getInventoryNotesByIdWithParams", id, params],
    queryFn: async () => {
      const response = await inventoryService.getByIdParamNote(id, params);
      return response;
    },
  });
};

export const useGetInventorySubmissionByIdWithParams = (id: string, params: Record<string, string>) => {
  return useQuery<InventoryResponseParamSubmissionData>({
    queryKey: ["getInventorySubmissionByIdWithParams", id, params],
    queryFn: async () => {
      const response = await inventoryService.getByIdParamSubmission(id, params);
      return response;
    },
  });
};

export const useGetInventoryConsumptionByIdWithParams = (id: string, params: Record<string, string>) => {
  return useQuery<InventoryResponseParamConsumptionData>({
    queryKey: ["getInventoryConsumptionByIdWithParams", id, params],
    queryFn: async () => {
      const response = await inventoryService.getByIdParamConsumption(id, params);
      return response;
    },
  });

};
  // Post Transaction
export const usePostInventoryTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["postInventoryTransaction"],
    mutationFn: async (data: any) => {
      const response = await inventoryService.postTransaction(data);
      return response;
    },
    onSuccess: () => {
      // refresh data inventory setelah transaksi berhasil dilakukan
      queryClient.invalidateQueries({ queryKey: ["getInventoryNotesByIdWithParams"] });
      queryClient.invalidateQueries({ queryKey: ["getInventorySubmissionByIdWithParams"] });
      queryClient.invalidateQueries({ queryKey: ["getInventoryConsumptionByIdWithParams"] });
      queryClient.invalidateQueries({ queryKey: ["getInventory"] });
      queryClient.invalidateQueries({ queryKey: ["getInventoryById"] });
      queryClient.invalidateQueries({ queryKey: ["getInventoryByIdWithParams"] });
    },
  });
}

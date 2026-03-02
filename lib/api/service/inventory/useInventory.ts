import { InventoryResponse } from "@/types/inventory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "./inventory.service";

export const useInventory = () => {
  return useQuery<InventoryResponse>({
    queryKey: ["getInventory"],
    queryFn: async () => {
      const response = await inventoryService.getAll();
      return response;
    },
  });
};

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

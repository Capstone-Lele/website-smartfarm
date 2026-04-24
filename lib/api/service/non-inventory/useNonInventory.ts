import { useQuery } from "@tanstack/react-query";
import { nonInventoryService } from "./non-inventory.service";

export const useNonInventory = (id: string) => {
  return useQuery({
    queryKey: ["getNonInventory", id],
    queryFn: async () => {
      const response = await nonInventoryService.getById(id);
      return response;
    },
    enabled: !!id,
  });
};

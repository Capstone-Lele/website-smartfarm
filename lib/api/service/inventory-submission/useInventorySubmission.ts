import { useQuery } from "@tanstack/react-query";
import { inventorySubmissionService } from "./inventory-submission.service";

export const useGetInventorySubmissions = () => {
  return useQuery({
    queryKey: ["inventorySubmissions"],
    queryFn: async () => {
      const response = await inventorySubmissionService.getAll();
      return response;
    },
  });
};

export const useGetInventorySubmissionById = (id: string) => {
  return useQuery({
    queryKey: ["inventorySubmission", id],
    queryFn: async () => {
      const response = await inventorySubmissionService.getById(id);
      return response;
    },
    enabled: !!id,
  });
};

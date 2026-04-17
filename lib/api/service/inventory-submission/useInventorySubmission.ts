import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useUpdateInventorySubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateInventorySubmission"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await inventorySubmissionService.update(id, data);
      return response;
      },
    onSuccess: () => {
      // refresh data inventory submission setelah update berhasil dilakukan
      queryClient.invalidateQueries({ queryKey: ["inventorySubmissions"] });
    },
  });
}

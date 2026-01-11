import { unitService } from "@/lib/api/service/master-data/unit/unit.service";
import {
  Unit,
  UnitRequest,
  UnitResponse,
} from "@/types/master-data/unit.types";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useUnit = () => {
  return useQuery<UnitResponse>({
    queryKey: ["getUnits"],
    queryFn: async () => {
      const response = await unitService.getAll();
      return response;
    },
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createUnit"],
    mutationFn: async (data: UnitRequest) => {
      const response = await unitService.create(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUnits"] });
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateUnit"],
    mutationFn: async ({ id, data }: { id: string; data: UnitRequest }) => {
      const response = await unitService.update(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUnits"] });
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteUnit"],
    mutationFn: async (id: string) => {
      const response = await unitService.delete(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUnits"] });
    },
  });
};
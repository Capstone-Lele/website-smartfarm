import { poolService } from "@/lib/api/service/pools/pool.service";
import { Pool, PoolRequest, PoolResponse } from "@/types/pool.types";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const usePool = () => {
  return useQuery<PoolResponse>({
    queryKey: ["getPool"],
    queryFn: async () => {
      const response = await poolService.getAll();
      return response;
    },
  });
};

export const usePoolById = (id: string) => {
  return useQuery<Pool>({
    queryKey: ["getPoolById", id],
    queryFn: async () => {
      const response = await poolService.getById(id);
      return response.data[0];
    },
    enabled: !!id,
  });
};

export const useCreatePool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createPool"],
    mutationFn: async (data: PoolRequest) => {
      const response = await poolService.create(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPool"] });
    },
  });
};

export const useUpdatePool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updatePool"],
    mutationFn: async ({ id, data }: { id: string; data: PoolRequest }) => {
      const response = await poolService.update(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPool"] });
    },
  });
};

export const useDeletePool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deletePool"],
    mutationFn: async (id: string) => {
      const response = await poolService.delete(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPool"] });
    },
  });
};

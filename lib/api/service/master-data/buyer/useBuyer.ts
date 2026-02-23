import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { buyerService } from "./buyer.service";
import { BuyerResponse } from "@/types/master-data/buyer.types";


export const useGetBuyers = () => {
  return useQuery<BuyerResponse>({
    queryKey: ["getBuyers"],
    queryFn: async () => {
      const response = await buyerService.getAll();
      return response;
    }
    });
};

export const useGetBuyerById = (id: string) => {
  return useQuery<BuyerResponse>({
    queryKey: ["getBuyerById", id],
    queryFn: async () => {
      const response = await buyerService.getById(id);
      return response;
    }
    });
};

export const useCreateBuyer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['createBuyer'],
        mutationFn: async (data: any) => {
            const response = await buyerService.create(data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getBuyers'] });
        }
    });
};

export const useDeleteBuyer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['deleteBuyer'],
        mutationFn: async (id: string) => {
            const response = await buyerService.delete(id);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getBuyers'] });
        }
    });
};

export const useUpdateBuyer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['updateBuyer'],
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await buyerService.update(id, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getBuyers'] });
        }
    });
};
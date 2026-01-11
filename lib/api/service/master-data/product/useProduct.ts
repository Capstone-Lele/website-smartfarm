import { ResponseDefault } from "@/types/response";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { productService } from "./product.service";

export const useGetProducts = () => {
  return useQuery<ResponseDefault>({
    queryKey: ["getProducts"],
    queryFn: async () => {
      const response = await productService.getAll();
      return response;
    },
  });
};
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createProduct"],
    mutationFn: async (data: any) => {
      const response = await productService.create(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await productService.update(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: async (id: string) => {
      const response = await productService.delete(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
    },
  });
};

import { ResponseDefault } from "@/types/response";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { productService } from "./product.service";
import { ProductResponse } from "@/types/master-data/product.types";

export const useGetProducts = () => {
  return useQuery<ProductResponse>({
    queryKey: ["getProducts"],
    queryFn: async () => {
      const response = await productService.getAll();
      return response;
    },
  });
};

export const useGetProductById = (id: string) => {
  return useQuery<ProductResponse>({
    queryKey: ["getProductById", id],
    queryFn: async () => {
      const response = await productService.getById(id);
      return response;
    },
    enabled: !!id,
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

export const useGetProductUsage = () => {
  return useQuery<ResponseDefault>({
    queryKey: ["getProductUsage"],
    queryFn: async () => {
      const response = await productService.getProductUsage();
      return response;
    },
  });
}

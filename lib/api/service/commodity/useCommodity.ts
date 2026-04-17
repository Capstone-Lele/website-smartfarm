import { commodityService } from "./commodity.service";
import { CommodityResponse, Commodity, CommodityByIdAndSourceIdResponse, CommodityByIdAndTypeOUT } from "@/types/comodity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCommodity = () => {
  return useQuery<CommodityResponse>({
    queryKey: ["getCommodity"],
    queryFn: async () => {
      const response = await commodityService.getAll();
      return response;
    },
  });
};

export const useCommodityById = (id: string) => {
  return useQuery<Commodity | undefined>({
    queryKey: ["getCommodityById", id],
    queryFn: async () => {
      const response = await commodityService.getById(id);
      return response.data[0];
    },
    enabled: !!id,
  });
};

export const useCreateCommodity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createCommodity"],
    mutationFn: async (data: FormData) => {
      const response = await commodityService.create(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCommodity"] });
    },
  });
};

export const useCommodityByIdAndType = (id: string, sourceType: string) => {
  return useQuery<CommodityByIdAndSourceIdResponse>({
    queryKey: ["getCommodityByIdAndType", id, sourceType],
    queryFn: async () => {
      const response = await commodityService.getCommodityByIdAndType(
        id,
        sourceType,
      );
      return response;
    },
    enabled: !!id && !!sourceType,
  });
}

export const useCommodityByIdAndTypeOut = (id: string, sourceType: string) => {
  return useQuery<CommodityByIdAndTypeOUT>({
    queryKey: ["getCommodityByIdAndTypeOut", id, sourceType],
    queryFn: async () => {
      const response = await commodityService.getCommodityByIdAndTypeOut(
        id,
        sourceType,
      );
      return response;
    },
    enabled: !!id && !!sourceType,
  });
}

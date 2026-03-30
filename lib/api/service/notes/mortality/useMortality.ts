import { useQuery } from "@tanstack/react-query";
import { mortalityService } from "./mortality.service";

export const useListMortality = () => {
  const query = useQuery({
    queryKey: ["mortalityNotes"],
    queryFn: async () => {
      const response = await mortalityService.getAll();
      return response;
    },
  });
  return query;
};

export const useListMortalityWithParams = (params: Record<string, string>) => {
  const query = useQuery({
    queryKey: ["mortalityNotes", params],
    queryFn: async () => {
      const response = await mortalityService.getAllWithParams(params);
      return response;
    },
    enabled: Object.keys(params).length > 0,
  });
  return query;
};

export const useMortalityById = (id: string) => {
  return useQuery({
    queryKey: ["mortalityNote", id],
    queryFn: async () => {
      const response = await mortalityService.getById(id);
      return response;
    },
    enabled: !!id,
  });
};

import { useQuery } from "@tanstack/react-query";
import { harvestService } from "./harvest.service";

export const useListHarvest = () => {
  const query = useQuery({
    queryKey: ["harvestNotes"],
    queryFn: async () => {
      const response = await harvestService.getAll();
      return response;
    },
  });
  return query;
};

export const useHarvestById = (id: string) => {
  return useQuery({
    queryKey: ["harvestNote", id],
    queryFn: async () => {
      const response = await harvestService.getById(id);
      return response;
    },
    enabled: !!id,
  });
};

import { useQuery } from "@tanstack/react-query";
import { samplingService } from "./sampling.service";

export const useListSampling = () => {
  const query = useQuery({
    queryKey: ["samplingNotes"],
    queryFn: async () => {
      const response = await samplingService.getAll();
      return response;
    },
  });
  return query;
};

export const useSamplingById = (id: string) => {
  return useQuery({
    queryKey: ["samplingNote", id],
    queryFn: async () => {
      const response = await samplingService.getById(id);
      return response;
    },
    enabled: !!id,
  });
};

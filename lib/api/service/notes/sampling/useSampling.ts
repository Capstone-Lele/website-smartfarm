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

export const useListSamplingWithParams = (params: Record<string, string>) => {
  const query = useQuery({
    queryKey: ["samplingNotes", params],
    queryFn: async () => {
      const response = await samplingService.getAllWithParams(params);
      return response;
    },
    enabled: Object.keys(params).length > 0, // Hanya jalankan query jika params tidak kosong
  });
  return query;
}

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

import { kolamService } from "@/lib/api/service/kolam/kolam.service";
import { Kolam, KolamRequest, KolamResponse } from "@/types/kolam.types";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useKolam = () => {
  return useQuery<KolamResponse>({
    queryKey: ["getKolam"],
    queryFn: async () => {
      const response = await kolamService.getAll();
      return response;
    },
  });
};

export const useCreateKolam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createKolam"],
    mutationFn: async (data: KolamRequest) => {
      const response = await kolamService.create(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getKolam"] });
    },
  });
};

export const useUpdateKolam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateKolam"],
    mutationFn: async ({ id, data }: { id: string; data: KolamRequest }) => {
      const response = await kolamService.update(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getKolam"] });
    },
  });
};

export const useDeleteKolam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteKolam"],
    mutationFn: async (id: string) => {
      const response = await kolamService.delete(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getKolam"] });
    },
  });
};

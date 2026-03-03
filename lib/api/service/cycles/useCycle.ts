import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { cycleService } from "./cycle.service";

export const useListCycle = (id: string) => {
  return useQuery({
    queryKey: ["getCycle", id],
    queryFn: async () => {
      const response = await cycleService.getAllById(id);
      return response;
    },
    enabled: !!id,
  });
}

export const useDetailCycle = (id: string) => {
  return useQuery({
    queryKey: ["getCycleDetail", id],
    queryFn: async () => {
      const response = await cycleService.getDetailById(id);
      return response;
    },
    enabled: !!id,
  });
}

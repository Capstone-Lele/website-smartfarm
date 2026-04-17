import { useQuery } from "@tanstack/react-query";
import { moveService } from "./move.service";

export const useListMove = () => {
  const query = useQuery({
    queryKey: ["moveNotes"],
    queryFn: async () => {
      const response = await moveService.getAll();
      return response;
    },
  });
  return query;
};

export const useMoveById = (id: string) => {
  return useQuery({
    queryKey: ["moveNote", id],
    queryFn: async () => {
      const response = await moveService.getById(id);
      return response;
    },
    enabled: !!id,
  });
};

export const useListMoveWithParams = (params: Record<string, string>) => {
  const query = useQuery({
    queryKey: ["moveNotes", params],
    queryFn: async () => {
      const response = await moveService.getAllWithParams(params);
      return response;
    },
  });
  return query;
};

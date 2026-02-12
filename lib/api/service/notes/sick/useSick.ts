import { useQuery } from "@tanstack/react-query";
import { sickService } from "./sick.service";

export const useListSick = () => {
  const query = useQuery({
    queryKey: ["sickNotes"],
    queryFn: async () => {
      const response = await sickService.getAll();
      return response;
    },
  });
  return query;
};

export const useSickById = (id: string) => {
  return useQuery({
    queryKey: ["sickNote", id],
    queryFn: async () => {
      const response = await sickService.getById(id);
      return response;
    },
    enabled: !!id,
  });
};

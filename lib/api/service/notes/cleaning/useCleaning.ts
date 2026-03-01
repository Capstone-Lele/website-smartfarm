import { useQuery } from "@tanstack/react-query";
import { cleaningService } from "./cleaning.service";

export const useListCleaning = () => {
  const query = useQuery({
    queryKey: ["cleaningNotes"],
    queryFn: async () => {
      const response = await cleaningService.getAll();
      return response;
    },
  });
  return query;
};

export const useCleaningById = (id: string) => {
  return useQuery({
    queryKey: ["cleaningNote", id],
    queryFn: async () => {
      const response = await cleaningService.getById(id);
      return response;
    },
    enabled: !!id,
  });
};

import { useQuery } from "@tanstack/react-query";
import { seedingService } from "./seeding.service";

export const useListSeeding = () => {
  const query = useQuery({
    queryKey: ["seedNotes"],
    queryFn: async () => {
      const response = await seedingService.getAll();
      return response;
    },
  });
  return query;
};

export const useSeedingById = (id: string) => {
  return useQuery({
    queryKey: ["seedNote", id],
    queryFn: async () => {
      const response = await seedingService.getById(id);
      return response;
    },
    enabled: !!id,
  });
};

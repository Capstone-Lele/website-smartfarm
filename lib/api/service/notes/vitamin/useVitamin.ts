import { useQuery } from "@tanstack/react-query";
import { vitaminService } from "./vitamin.service";

export const useListVitamin = () => {
  const query = useQuery({
    queryKey: ["vitaminNotes"],
    queryFn: async () => {
      const response = await vitaminService.getAll();
      return response;
    },
  });
  return query;
};

export const useVitaminById = (id: string) => {
  return useQuery({
    queryKey: ["vitaminNote", id],
    queryFn: async () => {
      const response = await vitaminService.getById(id);
      return response;
    },
    enabled: !!id,
  });
};

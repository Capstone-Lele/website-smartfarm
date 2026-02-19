import { useQuery } from "@tanstack/react-query";
import { feedService } from "./feed.service";

export const useListFeed = () => {
  const query = useQuery({
    queryKey: ["feedNotes"],
    queryFn: async () => {
      const response = await feedService.getAll();
      return response;
    },
  });
  return query;
};

export const useFeedById = (id: string) => {
  return useQuery({
    queryKey: ["feedNote", id],
    queryFn: async () => {
      const response = await feedService.getById(id);
      return response;
    },
    enabled: !!id,
  });
};

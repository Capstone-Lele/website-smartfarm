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

export const useListFeedWithParams = (params: Record<string, string>) => {
  const query = useQuery({
    queryKey: ["feedNotes", params],
    queryFn: async () => {
      const response = await feedService.getAllWithParams(params);
      return response;
    },
    enabled: Object.keys(params).length > 0,
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

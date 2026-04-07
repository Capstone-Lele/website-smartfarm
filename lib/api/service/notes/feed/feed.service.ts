import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { ByIdFeedResponse, FeedResponse } from "@/types/notes/feed.types";

export const feedService = {
  getAll: async (): Promise<FeedResponse> => {
    const response = await API_CLIENT.get<FeedResponse>(
      API_ENDPOINTS.FEED_NOTES.GET_ALL,
    );
    return response;
  },

  getAllWithParams: async (params: Record<string, string>): Promise<FeedResponse> => {
    const response = await API_CLIENT.get<FeedResponse>(
      API_ENDPOINTS.FEED_NOTES.GET_ALL_WITH_PARAMS(params),
    );
    return response;
  },

  getById: async (id: string): Promise<ByIdFeedResponse> => {
    const response = await API_CLIENT.get<ByIdFeedResponse>(
      API_ENDPOINTS.FEED_NOTES.GET_BY_ID(id),
    );
    return response;
  },
};

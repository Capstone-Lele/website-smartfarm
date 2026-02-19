import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { ByIdFeedResponse, FeedResponse } from "@/types/notes/feed.types";

export const feedService = {
  getAll: async (): Promise<FeedResponse> => {
    const response = await apiClient.get<FeedResponse>(
      API_ENDPOINTS.FEED_NOTES.GET_ALL,
    );
    return response;
  },

  getById: async (id: string): Promise<ByIdFeedResponse> => {
    const response = await apiClient.get<ByIdFeedResponse>(
      API_ENDPOINTS.FEED_NOTES.GET_BY_ID(id),
    );
    return response;
  },
};

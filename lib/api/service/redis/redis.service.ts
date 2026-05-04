import { API_CLIENT } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";

export const redisService = {
  clearCache: async (): Promise<any> => {
    const response = await API_CLIENT.get(API_ENDPOINTS.CLEAR_REDIS_CACHE);
    return response;
  },
};

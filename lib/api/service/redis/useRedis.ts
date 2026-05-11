import { useQuery } from "@tanstack/react-query";
import { redisService } from "./redis.service";

export const useClearRedisCache = () => {
  return useQuery({
    queryKey: ['clearRedisCache'],
    queryFn: async () => {
      const response = await redisService.clearCache();
      return response;
    },
  });
};

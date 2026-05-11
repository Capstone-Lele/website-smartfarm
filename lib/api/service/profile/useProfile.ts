import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "./profile.service";
import { ProfileEditInput } from "@/types/profile";
import { redisService } from "../redis/redis.service";

export const useGetProfile = () => {
  const query = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await profileService.getProfile();
      return response;
    },
  });
  return query;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: async (data: ProfileEditInput) => {
      const response = await profileService.updateProfile(data);
      return response;
    },
    onSuccess: async () => {
      await redisService.clearCache();
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
  });
};

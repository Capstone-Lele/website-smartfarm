import { ProfileEditInput, ProfileResponse } from "@/types/profile";
import { apiClient } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";
import { buildPayloadEdit } from "@/lib/utils/payload-build";

export const profileService = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>(
      API_ENDPOINTS.PROFILE.GET_PROFILE,
    );
    return response;
  },
  updateProfile: async (data: ProfileEditInput): Promise<ProfileResponse> => {
    const payload = buildPayloadEdit(data);
    console.log("Payload untuk update profile:", payload);
    const response = await apiClient.put<ProfileResponse>(
      API_ENDPOINTS.PROFILE.UPDATE,
      payload,
    );
    return response;
  },
};

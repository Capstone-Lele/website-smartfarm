import { ProfileEditInput, ProfileResponse } from "@/types/profile";
import { API_CLIENT } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";
import { buildPayloadEdit } from "@/lib/utils/payload-build";

export const profileService = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await API_CLIENT.get<ProfileResponse>(
      API_ENDPOINTS.PROFILE.GET_PROFILE,
    );
    return response;
  },
  updateProfile: async (data: ProfileEditInput): Promise<ProfileResponse> => {
    const payload = buildPayloadEdit(data);
    console.log("Payload untuk update profile:", payload);
    const response = await API_CLIENT.put<ProfileResponse>(
      API_ENDPOINTS.PROFILE.UPDATE,
      payload,
    );
    return response;
  },
};

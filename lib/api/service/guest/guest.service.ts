import { GeneralInfoResponse } from "@/types/guest";
import { API_CLIENT } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";

export const guestService = {
  getGeneralInfo: async (): Promise<GeneralInfoResponse> => {
    const response = await API_CLIENT.get<GeneralInfoResponse>(
        API_ENDPOINTS.GUEST.GENERAL_INFO,   
    );
    return response;
  }
};
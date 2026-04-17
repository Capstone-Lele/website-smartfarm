import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { DashboardResponse } from "@/types/dashboard";

export const dashboardService = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await API_CLIENT.get<DashboardResponse>(
      API_ENDPOINTS.DASHBOARD.GET,
    );
    return response;
  },
}
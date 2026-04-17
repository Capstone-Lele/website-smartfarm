import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "./dashboard.service";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["getDashboard"],
    queryFn: async () => {
      const response = await dashboardService.getDashboard();
      return response.data[0];
    },
  });
};
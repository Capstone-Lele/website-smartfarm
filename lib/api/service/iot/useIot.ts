import { useQuery } from "@tanstack/react-query";
import { iotService } from "./iot.service";

export const useIot = () => {
  return useQuery({
    queryKey: ["getIotData"],
    queryFn: async () => {
        const response = await iotService.getAll();
        return response.data;
    },
  });
};
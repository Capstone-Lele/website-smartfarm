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

export const useIotByNode = (nodeId: string) => {
  return useQuery({
    queryKey: ["getIotDataByNode", nodeId],
    queryFn: async () => {
        const response = await iotService.getByNode(nodeId);
        return response.data;
    },
    enabled: !!nodeId, // Only run the query if nodeId is provided
  });
}

export const useIotLive = () => {
  return useQuery({
    queryKey: ["getIotLiveData"],
    queryFn: async () => {
        const response = await iotService.getAllLive();
        return response.data;
    },
  });
}

export const useIotLiveByNode = (nodeId: string) => {
  return useQuery({
    queryKey: ["getIotLiveDataByNode", nodeId],
    queryFn: async () => {
        const response = await iotService.getLiveByNode(nodeId);
        return response.data;
    },
    enabled: !!nodeId, // Only run the query if nodeId is provided
  });
}

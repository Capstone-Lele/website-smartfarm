import { IOTDataLiveDetail, ResponseIOTData, ResponseIOTDataHistorical } from "@/types/notes/iot";
import { API_CLIENT } from "../../client";
import { API_ENDPOINTS } from "../../endpoint";

export const iotService = {
  getAll: async () => {
    const response = await API_CLIENT.get<ResponseIOTDataHistorical>(
      API_ENDPOINTS.IOT.GET_ALL,
    );
    return response;
    // return {
    //   success: true,
    //   message: "All pool data retrieved successfully",
    //   data: [
    //     {
    //       node_id: 1,
    //       ph: 7.05,
    //       temp: 28.34,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T08:00:00.000Z",
    //     },
    //     {
    //       node_id: 2,
    //       ph: 7.85,
    //       temp: 29.12,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T08:00:05.000Z",
    //     },
    //     {
    //       node_id: 3,
    //       ph: 8.15,
    //       temp: 28.45,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T08:00:10.000Z",
    //     },
    //     {
    //       node_id: 1,
    //       ph: 6.95,
    //       temp: 28.56,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T09:15:00.000Z",
    //     },
    //     {
    //       node_id: 2,
    //       ph: 7.92,
    //       temp: 29.34,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T09:15:05.000Z",
    //     },
    //     {
    //       node_id: 3,
    //       ph: 8.22,
    //       temp: 28.67,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T09:15:10.000Z",
    //     },
    //     {
    //       node_id: 1,
    //       ph: 6.82,
    //       temp: 28.78,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T10:30:00.000Z",
    //     },
    //     {
    //       node_id: 2,
    //       ph: 8.01,
    //       temp: 29.56,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T10:30:05.000Z",
    //     },
    //     {
    //       node_id: 3,
    //       ph: 8.18,
    //       temp: 28.89,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T10:30:10.000Z",
    //     },
    //     {
    //       node_id: 1,
    //       ph: 7.12,
    //       temp: 29.01,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T11:45:00.000Z",
    //     },
    //     {
    //       node_id: 2,
    //       ph: 8.09,
    //       temp: 29.78,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T11:45:05.000Z",
    //     },
    //     {
    //       node_id: 3,
    //       ph: 8.25,
    //       temp: 29.12,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T11:45:10.000Z",
    //     },
    //   ],
    // };
  },

  getByNode: async (nodeId: string) => {
    const response = await API_CLIENT.get<ResponseIOTDataHistorical>(
      API_ENDPOINTS.IOT.GET_BY_NODE(nodeId),
    );
    return response;
    // return {
    //   success: true,
    //   message: "All pool data retrieved successfully",
    //   data: [
    //     {
    //       node_id: { nodeId },
    //       ph: 7.05,
    //       temp: 28.34,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T08:00:00.000Z",
    //     },
    //     {
    //       node_id: { nodeId },
    //       ph: 6.95,
    //       temp: 28.56,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T09:15:00.000Z",
    //     },
    //     {
    //       node_id: { nodeId },
    //       ph: 6.82,
    //       temp: 28.78,
    //       timestamp: 1769697026.2630956,
    //       receivedAt: "2026-01-29T10:30:00.000Z",
    //     },
    //   ],
    // };
  },

  getAllLive: async () => {
    const response = await API_CLIENT.get<ResponseIOTData>(
      API_ENDPOINTS.IOT.GET_ALL_LIVE,
    );
    // return response;
    return {
      success: true,
      message: "All pool data retrieved successfully",
      data: [
        {
          node_id: 1,
          ph: 7.05,
          temp: 28.34,
          timestamp: 1769697026.2630956,
          receivedAt: "2026-01-29T08:00:00.000Z",
        },
        {
          node_id: 2,
          ph: 7.85,
          temp: 29.12,
          timestamp: 1769697026.2630956,
          receivedAt: "2026-01-29T08:00:05.000Z",
        },
        {
          node_id: 3,
          ph: 8.15,
          temp: 28.45,
          timestamp: 1769697026.2630956,
          receivedAt: "2026-01-29T08:00:10.000Z",
        },
      ],
    };
  },

  getLiveByNode: async (nodeId: string) => {
    // const response = await API_CLIENT.get<IOTDataLiveDetail>(
    //   API_ENDPOINTS.IOT.GET_LIVE_BY_NODE(nodeId),
    // );
    // return response;
    return {
      success: true,
      message: "All pool data retrieved successfully",
      data: [
        {
          node_id: {nodeId},
          ph: 2.05,
          temp: 3.87,
          timestamp: 1769697026.2630956,
          receivedAt: "2026-01-29T08:00:00.000Z",
        },
      ],
    };
  },
};

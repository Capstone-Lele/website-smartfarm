import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { SamplingResponse } from "@/types/notes/sampling.types";

export const samplingService = {
  getAll: async (): Promise<SamplingResponse> => {
    const response = await API_CLIENT.get<SamplingResponse>(
      API_ENDPOINTS.SAMPLING_NOTES.GET_ALL,
    );
    return response;
  },

  getAllWithParams: async (
    params: Record<string, string>,
  ): Promise<SamplingResponse> => {
    // const response = await API_CLIENT.get<SamplingResponse>(
    //   API_ENDPOINTS.SAMPLING_NOTES.GET_ALL_WITH_PARAMS(params),
    // );
    // return response;

    const poolId = params.poolId || "e78db58d-4025-4f06-b2d6-bd550e0bfbc6";
    const cycleId = params.cycleId || "da2c9711-37b8-4bcf-8e96-139993c353ec";

    return {
      data: [
        {
          userId: "b466c71a-fbde-4546-9dc6-a7ee56f39550",
          user: "Staff User 1",
          poolId,
          poolName: "Kolam 1",
          poolCategory: "growing",
          id: "5c3ee852-6087-4501-bdc8-faa351d0b7eb-1",
          cycleId,
          reportDate: "2026-02-20T03:36:20.120Z",
          quantity: 980,
          averageWeight: "120.50",
          image: "https://example.com/sampling-note.jpg",
          createdAt: "2026-02-20T03:36:20.120Z",
          updatedAt: "2026-02-20T03:36:20.120Z",
          deletedAt: null,
        },
        {
          userId: "b466c71a-fbde-4546-9dc6-a7ee56f39550",
          user: "Staff User 2",
          poolId,
          poolName: "Kolam 1",
          poolCategory: "growing",
          id: "5c3ee852-6087-4501-bdc8-faa351d0b7eb-2",
          cycleId,
          reportDate: "2026-02-24T03:36:20.120Z",
          quantity: 965,
          averageWeight: "240.75",
          image: "https://example.com/sampling-note.jpg",
          createdAt: "2026-02-24T03:36:20.120Z",
          updatedAt: "2026-02-24T03:36:20.120Z",
          deletedAt: null,
        },
        {
          userId: "b466c71a-fbde-4546-9dc6-a7ee56f39550",
          user: "Staff User 3",
          poolId,
          poolName: "Kolam 1",
          poolCategory: "growing",
          id: "5c3ee852-6087-4501-bdc8-faa351d0b7eb-3",
          cycleId,
          reportDate: "2026-02-28T03:36:20.120Z",
          quantity: 950,
          averageWeight: "300.10",
          image: "https://example.com/sampling-note.jpg",
          createdAt: "2026-02-28T03:36:20.120Z",
          updatedAt: "2026-02-28T03:36:20.120Z",
          deletedAt: null,
        },
      ],
      message: "Success",
      success: true,
    };
  },

  getById: async (id: string): Promise<SamplingResponse> => {
    const response = await API_CLIENT.get<SamplingResponse>(
      API_ENDPOINTS.SAMPLING_NOTES.GET_BY_ID(id),
    );
    return response;
  },
};

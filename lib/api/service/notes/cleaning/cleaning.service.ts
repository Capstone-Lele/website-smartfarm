import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { CleaningResponse } from "@/types/notes/cleaning";

export const cleaningService = {
  getAll: async (): Promise<CleaningResponse> => {
    const response = await API_CLIENT.get<CleaningResponse>(
      API_ENDPOINTS.CLEANING_NOTES.GET_ALL,
    );
    // return response;
    return {
      success: true,
      message: "Cleaning notes retrieved successfully",
      data: [
        {
          userId: "5eba2329-bfdc-4fe6-9639-5c6362ce53ee",
          user: "PIC User",
          poolName: "Kolam 1",
          poolCategory: "growing",
          id: "05e7ff01-7b46-4128-8dfd-0ff534a59209",
          poolId: "81f1e0e4-8201-4db4-9bc3-f3f9bbee2c5a",
          reportDate: "2026-02-13T14:36:14.000Z",
          image:
            "notes/cleaning-notes/3e0cd994-4da7-4861-8428-c68c0d7d3022.webp",
          createdAt: "2026-02-17T14:47:54.651Z",
          updatedAt: "2026-02-17T14:58:23.180Z",
          deletedAt: null,
        },
      ],
    };
  },

  getById: async (id: string): Promise<CleaningResponse> => {
    const response = await API_CLIENT.get<CleaningResponse>(
      API_ENDPOINTS.CLEANING_NOTES.GET_BY_ID(id),
    );
    return response;
  },
};

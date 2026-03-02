import { API_CLIENT } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoint";
import { MovePoolResponse } from "@/types/notes/move";

export const moveService = {
  getAll: async (): Promise<MovePoolResponse> => {
    // const response = await API_CLIENT.get<MovePoolResponse>(
    //   API_ENDPOINTS.MOVE_NOTES.GET_ALL,
    // );
    // return response;
    return {
      success: true,
      message: "Sick Notes fetched successfully",
      data: [
        {
          originPoolName: "Kolam 1",
          originCategory: "breeding",
          destinationPoolName: "Kolam 2",
          destinationCategory: "growing",
          user: "PIC User",
          startDate: "2026-02-08T16:27:01.661Z",
          id: "2ef16c4b-90d8-4284-8c1a-5d22bd51a0a9",
          originCycleId: "ef975d16-d095-4a17-b331-12a7c4189b86",
          destinationCycleId: "7382ad7b-6d28-41b0-acc4-df32b7b46ff6",
          userId: "3d5d1d0b-9e6e-4581-b1aa-d3fe2e3a5876",
          reportDate: "2024-02-10T05:12:12.000Z",
          quantity: 5,
          image:
            "notes/cleaning-notes/3e0cd994-4da7-4861-8428-c68c0d7d3022.webp",
          type: "move",
          createdAt: "2026-02-09T14:41:56.525Z",
          updatedAt: "2026-02-09T14:41:56.525Z",
          deletedAt: null,
        },
        {
          originPoolName: "Kolam 2",
          originCategory: "breeding",
          destinationPoolName: "Kolam 3",
          destinationCategory: "growing",
          user: "PIC User",
          startDate: "2026-02-08T16:27:01.661Z",
          id: "33881d4b-a34f-416b-a81a-869f12add703",
          originCycleId: "ef975d16-d095-4a17-b331-12a7c4189b86",
          destinationCycleId: "7382ad7b-6d28-41b0-acc4-df32b7b46ff6",
          userId: "3d5d1d0b-9e6e-4581-b1aa-d3fe2e3a5876",
          reportDate: "2024-02-10T05:12:12.000Z",
          quantity: 5,
          image:
            "notes/cleaning-notes/3e0cd994-4da7-4861-8428-c68c0d7d3022.webp",
          type: "move",
          createdAt: "2026-02-09T14:41:48.361Z",
          updatedAt: "2026-02-09T14:41:48.361Z",
          deletedAt: null,
        },
      ],
    };
  },

  getById: async (id: string): Promise<MovePoolResponse> => {
    const response = await API_CLIENT.get<MovePoolResponse>(
      API_ENDPOINTS.MOVE_NOTES.GET_BY_ID(id),
    );
    return response;
  },
};

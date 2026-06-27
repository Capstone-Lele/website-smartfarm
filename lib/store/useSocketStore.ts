"use client";

import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { IOTData } from "@/types/notes/iot";

type SocketStore = {
  socket: Socket | null;
  iotData: Record<number, IOTData>;
  connect: () => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  iotData: {},

  connect: () => {
    if (get().socket) return;

    const url = process.env.NEXT_PUBLIC_API_BASE_URL_BASE || "";
    const s = io(url, { transports: ["websocket"] });

    s.on("pool-data", (incoming: IOTData) => {
      console.log("[WS] pool-data received:", incoming);
      set((state) => ({
        iotData: { ...state.iotData, [incoming.node_id]: incoming },
      }));
    });

    set({ socket: s });
  },

  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null, iotData: {} });
  },
}));

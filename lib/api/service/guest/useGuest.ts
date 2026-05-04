"use client";
import { useQuery } from "@tanstack/react-query";
import { guestService } from "./guest.service";

export const useGeneralInfo = () => {
  return useQuery({
    queryKey: ["generalInfo"],
    queryFn: async () => {
      const response = await guestService.getGeneralInfo();
        return response;
    },
  });
}
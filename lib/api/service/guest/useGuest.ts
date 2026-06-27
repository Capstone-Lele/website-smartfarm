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

// public finance

export const usePublicFinanceInventory = () => {
  return useQuery({
    queryKey: ["getPublicFinanceInventory"],
    queryFn: async () => {
      const response = await guestService.getPublicFinanceInventory();
      return response.data;
    },
  });
};

export const usePublicFinanceNonInventory = () => {
  return useQuery({
    queryKey: ["getPublicFinanceNonInventory"],
    queryFn: async () => {
      const response = await guestService.getPublicFinanceNonInventory();
      return response.data;
    },
  });
};

export const usePublicFinanceInventorySubmission = () => {
  return useQuery({
    queryKey: ["getPublicFinanceInventorySubmission"],
    queryFn: async () => {
      const response = await guestService.getPublicFinanceInventorySubmission();
      return response.data;
    },
  });
};

export const usePublicFinanceCommodity = () => {
  return useQuery({
    queryKey: ["getPublicFinanceCommodity"],
    queryFn: async () => {
      const response = await guestService.getPublicFinanceCommodity();
      return response.data;
    },
  });
};
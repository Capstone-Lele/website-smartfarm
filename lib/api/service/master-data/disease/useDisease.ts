import {
  DiseaseFormInput,
  DiseaseResponse,
} from "@/types/master-data/disease.types";
import { diseaseService } from "./disease.service";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const useDisease = () => {
  return useQuery<DiseaseResponse>({
    queryKey: ["getDiseases"],
    queryFn: async () => {
      const response = await diseaseService.getAll();
      return response;
    },
  });
};

export const useDiseaseById = (id: string) => {
  return useQuery<DiseaseResponse>({
    queryKey: ["getDiseaseById", id],
    queryFn: async () => {
      const response = await diseaseService.getById(id);
      return response;
    },
    enabled: !!id, // Only run the query if id is not null or undefined
  });
};

export const useCreateDisease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createDisease"],
    mutationFn: async (data: DiseaseFormInput) => {
      const response = await diseaseService.create(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDiseases"] });
    },
  });
};

export const useUpdateDisease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateDisease"],
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DiseaseFormInput;
    }) => {
      const response = await diseaseService.update(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDiseases"] });
    },
  });
};

export const useDeleteDisease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteDisease"],
    mutationFn: async (id: string) => {
      const response = await diseaseService.delete(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDiseases"] });
    },
  });
};

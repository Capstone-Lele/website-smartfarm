import { kategoriService } from "@/lib/api/service/master-data/kategori.service";
import { KategoriResponse } from "@/types/master-data/kategori.types";
import { useQuery } from "@tanstack/react-query";

export const useCategory = () => {
    return useQuery<KategoriResponse>({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await kategoriService.getAll();
            return response;
        },
    });
}
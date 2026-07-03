import { useQuery } from "@tanstack/react-query";
import { inventoryDetailNotListService } from "./inven_detail_not_list.service";

export const useInvenDetailNotList = (note_id: string) => {
  return useQuery({
    queryKey: ["inventory-detail-not-list", note_id],
    queryFn: () => inventoryDetailNotListService.getInvenDetailNotList(note_id),
    enabled: !!note_id,
  });
};

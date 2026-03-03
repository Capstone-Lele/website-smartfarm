import { ResponseDefault } from "@/types/response";
import { API_CLIENT } from "../../../client";
import { API_ENDPOINTS } from "../../../endpoint";
import { DUMMY_UNIT_RESPONSE as response } from "@/lib/constants/dummy-respoonse/unit";
import {
  UnitResponse,
  Unit,
  UnitRequest,
} from "@/types/master-data/unit.types";
import {
  buildPayloadCreate,
  buildPayloadEdit,
} from "@/lib/utils/payload-build";

export const unitService = {
  getAll: async (): Promise<UnitResponse> => {
    const response = await API_CLIENT.get<UnitResponse>(
      API_ENDPOINTS.MASTER_DATA.UNIT.GET_ALL,
    );
    return response;
  },

  create: async (data: UnitRequest): Promise<UnitResponse> => {
    const payload = buildPayloadCreate(data);
    const response = await API_CLIENT.post<UnitResponse>(
      API_ENDPOINTS.MASTER_DATA.UNIT.CREATE,
      payload,
    );
    return response;
  },

  delete: async (id: string): Promise<ResponseDefault> => {
    const response = await API_CLIENT.delete<ResponseDefault>(
      API_ENDPOINTS.MASTER_DATA.UNIT.DELETE(id),
    );
    return response;
  },

  update: async (id: string, data: UnitRequest): Promise<ResponseDefault> => {
    const payload = buildPayloadEdit(data);
    const response = await API_CLIENT.put<ResponseDefault>(
      API_ENDPOINTS.MASTER_DATA.UNIT.UPDATE(id),
      payload,
    );
    return response;
  },
};

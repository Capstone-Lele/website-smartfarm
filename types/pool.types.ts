export type Pool = {
  acidityMax?: string | null;
  acidityMin?: string | null;
  category: string;
  createdAt?: string | null;
  cycleEndDate?: string | null;
  cycle?: null | string;
  cycleId: string;
  deletedAt: null | string;
  diameter?: null | string;
  height?: string | null;
  id: string;
  length?: string | null;
  name: string;
  cycleStartDate?: string | null;
  mortality?: number | null;
  movedQuantity?: number | null;
  currentQuantity?: number | null;
  temperatureMax?: string | null;
  temperatureMin?: string | null;
  updatedAt?: string | null;
  width?: string | null;
};

export type PoolRequest = {
  name: string;
  category: string;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  diameter?: number | null;
};

export type PoolResponse = {
  success: boolean;
  message: string;
  data: Pool[];
};

export type ByIdPoolResponse = {
  success: boolean;
  message: string;
  data: Pool[];
};

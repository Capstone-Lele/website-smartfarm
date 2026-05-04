type PoolActor = {
  role: string;
  image: string;
  userId: string;
  userName: string;
};

export type Pool = {
  acidityMax: number[] | null;
  acidityMin: number[] | null;
  acidityNormal: number[] | null;
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
  temperatureMax: number[] | null;
  temperatureNormal: number[] | null;
  temperatureMin: number[] | null;
  updatedAt?: string | null;
  width?: string | null;
  actor: PoolActor[] | null;
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

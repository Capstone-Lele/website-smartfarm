export type Mortality = {
  poolName: string;
  poolCategory: string;
  userId: string;
  user: string;
  id: string;
  cycleId: string;
  poolId: string;
  reportDate: string;
  quantity: number;
  image: string;
  createdAt: string;
  updatedAt?: null | string;
  deletedAt?: null | string;
};

export type MortalityResponse = {
  success: boolean;
  message: string;
  data: Mortality[];
};

export type ByIdMortalityResponse = {
  success: boolean;
  message: string;
  data: Mortality;
};

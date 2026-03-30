export type Seed = {
  id: string;
  poolName: string;
  poolCategory: string;
  poolId: string;
  cycleId: string;
  userId: string;
  reportDate: string;
  initialQuantity: number;
  currentQuantity: number;
  initialAverageWeight: string;
  image: string;
  condition: string;
  createdAt: string;
  updatedAt?: null | string;
  deletedAt?: string | null;
};

export type SeedResponse = {
  success: boolean;
  message: string;
  data: Seed[];
};

export type ByIdSeedResponse = {
  success: boolean;
  message: string;
  data: Seed;
};

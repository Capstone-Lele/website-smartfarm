export type Sampling = {
  user: string;
  poolName: string;
  poolCategory: string;
  id: string;
  poolId: string;
  cycleId: string;
  userId: string;
  reportDate: string;
  quantity: number;
  averageWeight: string;
  image: string;
  cycle: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type SamplingResponse = {
  success: boolean;
  message: string;
  data: Sampling[];
};

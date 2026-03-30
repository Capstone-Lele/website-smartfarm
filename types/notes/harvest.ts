export type Harvest = {
  id: string;
  userId: string;
  user: string;
  date: string;
  cycle: string;
  cycleId: string;
  poolId: string;
  poolName: string;
  poolCategory: string;
  amount: number;
  image: string;
};

export type HarvestResponse = {
  success: boolean;
  message: string;
  data: Harvest[];
};

export type ByIdHarvestResponse = {
  success: boolean;
  message: string;
  data: Harvest;
};

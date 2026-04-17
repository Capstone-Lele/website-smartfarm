export type Vitamin = {
  vitaminName: string;
  poolName: string;
  poolCategory: string;
  startDate: string;
  unit: string;
  id: string;
  cycleId: string;
  cycleStartDate: string;
  userId: string;
  user: string;
  inventoryId: string;
  type: string;
  reportDate: string;
  quantity: string;
  image: string;
  poolId: string;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type VitaminResponse = {
  success: boolean;
  message: string;
  data: Vitamin[];
};

export type ByIdVitaminResponse = {
  success: boolean;
  message: string;
  data: Vitamin;
};

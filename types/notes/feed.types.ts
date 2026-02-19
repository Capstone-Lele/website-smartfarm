export type Feed = {
  foodName: string;
  poolName: string;
  poolCategory: string;
  startDate: string;
  unit: string;
  id: string;
  cycleId: string;
  userId: string;
  user:string;
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

export type FeedResponse = {
  success: boolean;
  message: string;
  data: Feed[];
};

export type ByIdFeedResponse = {
  success: boolean;
  message: string;
  data: Feed;
};
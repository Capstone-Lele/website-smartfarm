export type Cleaning = {
  userId: string;
  user: string;
  poolName: string;
  poolCategory: string;
  id: string;
  poolId: string;
  reportDate: string;
  image: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type CleaningResponse = {
  success: boolean;
  message: string;
  data: Cleaning[];
};

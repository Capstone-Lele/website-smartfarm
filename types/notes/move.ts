export type MovePool = {
  id: string;
  originCycleId: string;
  destinationCycleId: string;
  userId: string;
  reportDate: string;
  quantity: number;
  image?: string | null;
  type: "move";
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  originPoolName: string;
  originCategory: string;
  destinationPoolName: string;
  destinationCategory: string;
  user: string;
  startDate: string;
};

export type MovePoolResponse = {
  success: boolean;
  message: string;
  data: MovePool[];
};
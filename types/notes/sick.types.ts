export type Sick = {
  id: string;
  originCycleId: string;
  destinationCycleId: string;
  userId: string;
  reportDate: string;
  quantity: number;
  image?: string | null;
  type: "sick";
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  originPoolName: string;
  originCategory: string;
  destinationPoolName: string;
  destinationCategory: string;
  user: string;
  originStartDate: string;
  destinationStartDate: string;
  notes?: string | null;
  sickTypes?: { id: string; name: string }[];
};

export type SickResponse = {
  success: boolean;
  message: string;
  data: Sick[];
};

export type ByIdSickResponse = {
  success: boolean;
  message: string;
  data: Sick;
};

export type Cycle = {
  id: string;
  startDate: string;
  endDate?: string;
  condition?: string;
  initialQuantity?: number;
  currentQuantity?: number;
  mortality?: number;
  age?: number;
  movePool?: number;
};

export type CycleResponse = {
  success: boolean;
  message: string;
  data: Cycle[];
};

export type CycleDetail = {
  age: number| string;
  startDate: string;
  user: string;
  endDate: string;
  initialQuantity: number;
  currentQuantity: number;
};

export type CycleDetailResponse = {
  success: boolean;
  message: string;
  data: CycleDetail[];
};
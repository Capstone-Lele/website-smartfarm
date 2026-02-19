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

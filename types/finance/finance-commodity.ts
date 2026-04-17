export type FinanceCommodity = {
  id: string;
  sourceId: string;
  transactionDate: string;
  type: string;
  transactionSource: string;
  notes: string;
  buyer: string;
  totalOrder: number;
  totalItem: number;
  totalKg: number;
  totalPrice: number;
  createdAt: string;
};


export type ResponseFinanceCommodity = {
  success: boolean;
  message: string;
  data: FinanceCommodity[];
};
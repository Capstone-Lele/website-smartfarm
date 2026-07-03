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
  referenceId: string | null;
  referenceTransactionSourceId: string | null;
  // Computed reversal info (added client-side)
  reversedBySourceId?: string | null;
  reversalSourceId?: string | null;
  reversalSourceLabel?: string | null;
};

export type ResponseFinanceCommodity = {
  success: boolean;
  message: string;
  data: FinanceCommodity[];
};

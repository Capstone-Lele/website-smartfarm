export type FinanceInventory = {
  id: string;
  type: string;
  sourceId: string;
  transactionSource: string;
  transactionDate: string;
  productCategory: string;
  product: string;
  transactionType: string | null;
  notes: string;
  quantity: string;
  unit: string;
  pricePerItem: number | null;
  totalPrice: number;
  createdAt: string;
  referenceId: string | null;
  referenceTransactionSourceId: string | null;
  // Computed reversal info (added client-side)
  reversedBySourceId?: string | null;
  reversalSourceId?: string | null;
  reversalSourceLabel?: string | null;
};

export type ResponseFinanceInventory = {
  success: boolean;
  message: string;
  data: FinanceInventory[];
};

export type FinanceNonInventory = {
  id: string;
  transactionDate: string;
  sourceId: string;
  type: string;
  productCategory: string;
  product: string;
  transactionType: string;
  notes: string;
  quantity: string;
  unit: string;
  pricePerItem: number;
  totalPrice: number | null;
  createdAt: string;
  referenceId: string | null;
  referenceTransactionSourceId: string | null;
  // Computed reversal info (added client-side)
  reversedBySourceId?: string | null;
  reversalSourceId?: string | null;
  reversalSourceLabel?: string | null;
};

export type ResponseFinanceNonInventory = {
  success: boolean;
  message: string;
  data: FinanceNonInventory[];
};

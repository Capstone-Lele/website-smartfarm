export type FinanceInventorySubmission = {
  id: string;
  transactionDate: string;
  type: string;
  sourceId: string;
  transactionSource: string;
  applicant: string;
  productCategory: string;
  product: string;
  transactionType: string | null;
  notes: string;
  quantity: number;
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

export type ResponseFinanceInventorySubmission = {
  success: boolean;
  message: string;
  data: FinanceInventorySubmission[];
};

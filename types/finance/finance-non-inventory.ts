export type FinanceNonInventory = {
  id: string;
  transactionDate: string;
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
};

export type ResponseFinanceNonInventory = {
  success: boolean;
  message: string;
  data: FinanceNonInventory[];
};
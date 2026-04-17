export type FinanceInventory = {
  id: string;
  type: string;
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
};

export type ResponseFinanceInventory = {
  success: boolean;
  message: string;
  data: FinanceInventory[];
};
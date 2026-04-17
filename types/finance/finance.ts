export type Finance = {
  id: string;
  transactionDate: string;
  type: string;
  transactionSource: string;
  productCategory?: string;
  transactionType?: string;
  product?: string;
  notes: string;
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
  deleteAt?: string | null;
};

export type FinanceBySourceId = {
  id: string;
  sourceId: string;
  sourceType: string;
  transactionDate: string;
  type: string;
  notes: string;
  image: string;
  pricePerItem: number | null;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  deleteddAt: null | string;
};


export type ResponseFinanceBySourceId = {
  success: boolean;
  message: string;
  data: FinanceBySourceId[];
};


/* Non inventory form */
export type RequestNonInventoryFinance = {
    image: string;
    notes?: string;
    pricePerItem: number;
    productId: string;
    quantity: number;
    totalPrice: number;
    transactionDate: string;
    transactionType: string;
    type: string;
}

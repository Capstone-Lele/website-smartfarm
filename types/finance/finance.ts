export type Finance = {
  id: string;
  transactionDate: string;
  type: string;
  transactionSource: string;
  sourceId?: string;
  productCategory?: string;
  transactionType?: string;
  product?: string;
  notes: string;
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
  deleteAt?: string | null;
  referenceId?: string | null;
  referenceTransactionSourceId?: string | null;
  reversedBySourceId?: string | null;
  reversalSourceId?: string | null;
  reversalSourceLabel?: string | null;
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
  deleteddAt: null | string;
  // jika 4 field dibawah ini null, berarti transaksi ini bukan reversalnya dan bukan yang di reversalnya
  referenceId: null | string; // id transaction yang direferensikan (transaksi yang di reversal) | akan bernilai jika transaksi ini adalah reversalnya
  referenceSourceId: null | string; // sourceId catatan(inventaris, non inventaris, comodity sales, pengajuan invnetaris) transaction yang direferensikan | akan bernilai jika transaksi ini adalah reversalnya
  transactionReversalId: null | string; // id transaction yang membatalkan transaksi ini (transaksi reversalnya) | akan bernilai jika transaksi ini adalah yang di reversalnya
  transactionReversalNoteId: null | string; // id transaction yang membatalkan transaksi ini | akan bernilai jika transaksi ini adalah transaksi yang di reversal
  isReversed: boolean;
};

export type ResponseFinanceBySourceId = {
  success: boolean;
  message: string;
  data: FinanceBySourceId;
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
};

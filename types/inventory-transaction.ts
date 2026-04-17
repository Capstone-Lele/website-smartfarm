export interface RequestInventoryTransaction {
  image?: string;
  inventoryId?: string;
  notes?: string;
  pricePerItem?: string;
  quantity?: number;
  reportDate?: string;
  totalPrice?: string;
  transactionImage?: string;
  transactionNotes?: string;
  transactionType?: string;
}

export type InventoryInOut = {
  id: string;
  userId: string;
  inventoryId: string;
  quantity: number;
  status: string;
  transaction_type?: string | null;
  notes: string;
  feedback?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

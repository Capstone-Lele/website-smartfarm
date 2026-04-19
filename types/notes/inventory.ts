export type INVENTORY_NOTES = {
  id: string;
  userId: string;
  inventoryId: string;
  reportDate: string;
  quantity: string;
  type: string;
  transactionType: string;
  image: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
};

export type InventoryResponseById = {
  success: boolean;
  message: string;
  data: INVENTORY_NOTES[];
};

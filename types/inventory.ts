export type Inventory = {
  productId: string;
  product: string;
  categoryId: string;
  category: string;
  unitId: string;
  unit: string;
  totalQuantity: string;
  minQuantity: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};


export type InventoryResponse = {
  success: boolean;
  message: string;
  data: Inventory[];
};

export type InventoryDetail = {
  id: string;
  notes: string;
  category: string;
  from: string;
  unit: string;
  quantity: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};
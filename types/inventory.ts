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
  type: string;
  category: string;
  unit: string;
  quantity: string;
  transactionType: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type InventorySubmissionResponse = {
  success: boolean;
  message: string;
  data: InventorySubmission[];
};

export type InventorySubmissionDetailResponse = {
  success: boolean;
  message: string;
  data: InventorySubmission;
};

export type InventorySubmission = {
  id: string;
  userId: string;
  user: string;
  inventoryId: string;
  product: string;
  category: string;
  quantity: number;
  unit: string;
  status: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

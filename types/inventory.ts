export type Inventory = {
  productId: string;
  id: string;
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

export type InventoryCreateRequest = {
  productId: string;
  minQuantity: number;
};

export type InventoryDetail = {
  id: string;
  notes: string;
  type: string;
  category: string;
  unit: string;
  quantity: string;
  transactionType: string;
  source?: string;
  pricePerItem: string | null;
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
  data: InventorySubmission[];
};

export type InventorySubmission = {
  id: string;
  userId: string;
  user: string;
  inventoryId: string;
  product: string;
  category: string;
  quantity: number;
  transaction_type: string | null;
  unit: string;
  status: string;
  feedback: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type InventoryDetailByParam = {
  id: string;
  productId: string;
  product: string;
  unitId: string;
  unit: string;
  totalQuantity: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type InventoryDetailWithParamResponse = {
  success: boolean;
  message: string;
  data: InventoryDetailByParam[];
};

/* 3diff response by param */

export type InventoryResponseParamNote = {
  id: string;
  inventoryId: string;
  userId: string;
  notes: string;
  quantity: string;
  reportDate: string;
  pricePerItem?: string | null;
  transactionType: string | null;
  type: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type InventoryResponseParamNoteData = {
  success: boolean;
  message: string;
  data: InventoryResponseParamNote[];
};

export type InventoryResponseParamSubmission = {
  id: string;
  inventoryId: string;
  userId: string;
  notes: string;
  quantity: string;
  pricePerItem?: string | null;
  status: string;
  transactionType: string | null;
  type: "in";
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type InventoryResponseParamSubmissionData = {
  success: boolean;
  message: string;
  data: InventoryResponseParamSubmission[];
};

export type InventoryResponseParamConsumption = {
  id: string;
  inventoryId: string;
  cycleId?: string | null;
  userId: string;
  quantity: string;
  reportDate: string;
  type: "out";
  image?: string | null;
  pricePerItem?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type InventoryResponseParamConsumptionData = {
  success: boolean;
  message: string;
  data: InventoryResponseParamConsumption[];
};

/* Example response */
/* export type InventoryResponseParamNotes = {
  createdAt: "2026-04-10T15:15:09.262Z";
  deletedAt: null;
  id: "e79d5021-efbb-47ae-b5d0-d52946a5aea9";
  image: "inventory-note-2.jpg";
  inventoryId: "ee877825-985a-47da-8967-3d440874f019";
  notes: "This is a note for inventory ee877825-985a-47da-8967-3d440874f019";
  quantity: "90.00";
  reportDate: "2026-04-10T15:15:09.262Z";
  transaction_type: null;
  type: "out";
  updatedAt: "2026-04-10T15:15:09.262Z";
  userId: "9c4a298c-24fc-47c3-a51e-c5fd3066d2ce";
};

export type InventoryResponseParamSubmission = {
  createdAt: "2026-04-10T15:15:09.262Z";
  deletedAt: null;
  id: "e79d5021-efbb-47ae-b5d0-d52946a5aea9";
  inventoryId: "ee877825-985a-47da-8967-3d440874f019";
  notes: "This is a note for inventory ee877825-985a-47da-8967-3d440874f019";
  quantity: "90.00";
  transaction_type: null;
  status: "pending";
  updatedAt: "2026-04-10T15:15:09.262Z";
  userId: "9c4a298c-24fc-47c3-a51e-c5fd3066d2ce";
};

export type InventoryResponseParamConsumption = {
  createdAt: "2026-04-10T15:15:09.272Z";
  cycleId: "8619a7df-95dc-421e-881a-f4f17a31934a";
  deletedAt: null;
  id: "b5f25744-3b73-428d-ba3d-3dd826a29fb1";
  image: "https://example.com/feed.jpg";
  inventoryId: "ee877825-985a-47da-8967-3d440874f019";
  quantity: "94.00";
  reportDate: "2026-04-10T15:15:09.272Z";
  type: "food";
  updatedAt: "2026-04-10T15:15:09.272Z";
  userId: "79511ba0-13a5-4e72-a3fd-e7965c50df4f";
}; */

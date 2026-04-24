export type DETAIL_NON_INVENTORY = {
  id: string;
  productId: string;
  quantity: string;
  transactionType: string;
};

export type ResponseDetailNonInventory = {
  success: boolean;
  message: string;
  data: DETAIL_NON_INVENTORY[];
};
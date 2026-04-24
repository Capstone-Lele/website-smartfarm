import { string } from "zod";

export type Commodity = {
  id: string;
  date: string;
  type: string;
  quantity: number | string;
  soldQuantity?: number | null;
  category: string;
  cycleStartDate?: string | null;
  poolName?: string | null;
  buyerName?: string | null;
};

export type CommodityResponse = {
  success: boolean;
  message: string;
  data: Commodity[];
};

/* Form */
type CommodityRequestItem = {
  harvestNoteId: string;
  quantity: number;
  quantityKg: number;
  priceKg: number;
  subTotal: number;
  notes: string;
};

export type CommodityRequest = {
  buyer: string;
  image: string;
  items: CommodityRequestItem[];
  notes: string;
  orderDate: string;
  totalPrice: number;
};

/* Commodity By ID and Source Type  IN*/
export type CommodityByIdAndSourceIdItems = {
  id: string;
  quantity: string;
  quantityKg: string;
  priceKg: number;
  notes: string;
  subTotal: number;
  totalPrice: string;
  harvestId: string;
  harvestDate: string;
  cycleId: string;
  poolName: string;
};

type CommodityByIdAndSourceId = {
  buyerId: string;
  orderItems: CommodityByIdAndSourceIdItems[];
};

export type CommodityByIdAndSourceIdResponse = {
  success: boolean;
  message: string;
  data: CommodityByIdAndSourceId[];
};

/* Commodity By ID and Type  OUT */

export type CommodityByIdAndTypeItemsOUT = {
  id: string;
  buyer: string;
  orderDate: string;
  totalPrice: string;
  quantity: string;
  quantityKg: string;
};

export type CommodityByIdAndTypeOUT = {
  success: boolean;
  message: string;
  data: CommodityByIdAndTypeItemsOUT[];
};

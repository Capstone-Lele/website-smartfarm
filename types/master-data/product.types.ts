export type Product = {
  id: string;
  name: string;
  category: string;
  consumptionType?: string | null;
  unit: string;
  type: string;
  deletedAt: string | null;
};

export type ProductRequest = {
  name: string;
  category: string;
  consumptionType?: string;
  unit: string;
  type: string;
};

export type ProductResponse = {
  success: boolean;
  message: string;
  data: Product[];
};


export interface ProductUsage {
    category: string;
    id: string;
    name: string;
    type: string;
    unit: string;
    consumptionType: string | null;
}

export interface Response {
    data: ProductUsage[];
    message: string;
    success: boolean;
}


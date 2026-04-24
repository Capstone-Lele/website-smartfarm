export type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
  type: string;
  deletedAt: string | null;
};

export type ProductRequest = {
  name: string;
  category: string;
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
}

export interface Response {
    data: ProductUsage[];
    message: string;
    success: boolean;
}


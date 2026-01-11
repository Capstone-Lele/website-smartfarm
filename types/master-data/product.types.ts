export type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
  type: string;
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

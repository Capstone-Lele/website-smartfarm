export type Buyer = {
  id: string;
  name: string;
  type: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type BuyerResponse = {
  success: boolean;
  message: string;
  data: Buyer[];
};

export type BuyerFormInput = {
  name?: string;
  type?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
};

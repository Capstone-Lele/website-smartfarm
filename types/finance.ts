export type Finance = {
  id: string;
  date: string;
  type: string;
  category: string;
  notes: string;
  image: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
  deleteAt?: string | null;
};
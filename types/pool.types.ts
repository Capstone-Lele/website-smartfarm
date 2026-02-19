export type Pool = {
  id: string;
  name: string;
  category: string;
  diameter?: string | null;
  height?: string | null;
  length?: string | null;
  width?: string | null;
};

export type PoolRequest = {
  name: string;
  category: string;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  diameter?: number | null;
};

export type PoolResponse = {
  success: boolean;
  message: string;
  data: Pool[];
};

export type ByIdPoolResponse = {
  success: boolean;
  message: string;
  data: Pool;
};

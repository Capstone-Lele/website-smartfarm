export type Kolam = {
  id: string;
  name: string;
  kategori: string;
  ukuran: string;
  kondisi: string;
  siklus: string;
  ikan: number;
  kematian: number;
  umur: string;
  status_air: string;
};

export type KolamRequest = {
  name: string;
  kategori: string;
  ukuran: string;
  kondisi: string;
  siklus: string;
  ikan: number;
  kematian: number;
  umur: string;
  status_air: string;
};

export type KolamResponse = {
  success: boolean;
  message: string;
  data: Kolam[];
};

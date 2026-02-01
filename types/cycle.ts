export type Cycle = {
  id: string;
  mulai: string;
  selesai: string;
  kondisi: string;
  jumlah_tebar: number;
  jumlah_terkini: number;
  kematian: number;
  umur: string;
  pindah_kolam: number;
};

export type CycleRequest = {
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

export type CycleResponse = {
  success: boolean;
  message: string;
  data: Cycle[];
};

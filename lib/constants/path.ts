
const dataPath = [
  {
    path: "/dashboard",
    name: "Beranda",
  },
  {
    path: "/dashboard/profile-setting",
    name: "Pengaturan Profil",
  },
  {
    path: "/dashboard/pools",
    name: "Daftar Kolam",
    sub_paths: [
      {
        path: "/dashboard/pools/cycle",
        name: "Siklus Kolam",
      },
    ],
  },
  {
    path: "/dashboard/master-data",
    name: "Master Data",
    sub_paths: [
      {
        path: "/dashboard/master-data/categories",
        name: "Kategori",
      },
      {
        path: "/dashboard/master-data/products",
        name: "Produk",
      },
      {
        path: "/dashboard/master-data/units",
        name: "Satuan",
      },
      {
        path: "/dashboard/master-data/buyers",
        name: "Pembeli",
      }
    ],
  },
  {
    path: "/dashboard/users",
    name: "Pengguna",
  },
  {
    path: "/dashboard/reports",
    name: "Laporan",
    sub_paths: [
      {
        path: "/dashboard/reports/daily",
        name: "Laporan Harian",
      },
      {
        path: "/dashboard/reports/feeding",
        name: "Laporan Pemberian Pakan",
      },
      {
        path: "/dashboard/reports/vitamin",
        name: "Laporan Vitamin",
      },
      {
        path: "/dashboard/reports/sick",
        name: "Laporan Sakit",
      },
      {
        path: "/dashboard/reports/sampling",
        name: "Laporan Sampling",
      },
      {
        path: "/dashboard/reports/cleaning",
        name: "Laporan Pembersihan Kolam",
      }
    ],
  },
  {
    path: "/dashboard/commodity",
    name: "Komoditas",
  },
  {
    path: "/dashboard/finance",
    name: "Keuangan",
  },
];

export default dataPath;

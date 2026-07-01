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

      {
        path: "/dashboard/pools/[poolId]",
        name: "List Siklus",
        isDynamic: true,
        dynamicName: (params: any, meta?: Record<string, string>) => {
          return meta?.["pool"] ?? `Detail`;
        },
      },
      {
        path: "/dashboard/pools/[poolId]/[cycleId]",
        name: "Detail Siklus",
        isDynamic: true,
        dynamicName: (params: any, meta?: Record<string, string>) => {
          return meta?.["cycle"] ?? `Detail`;
        },
      },
    ],
  },
  {
    path: "/dashboard/pools/quarantine",
    name: "Karantina",
    // isDynamic: true,
    // dynamicName: (params: any, meta?: Record<string, string>) => {
    //   return meta?.["quarantine"] ?? `Karantina #${params.poolId}`;
    // },
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
        name: "Unit",
      },
      {
        path: "/dashboard/master-data/buyers",
        name: "Pembeli",
      },
    ],
  },
  {
    path: "/dashboard/users",
    name: "Pengguna",
  },
  {
    path: "/dashboard/inventory",
    name: "Inventaris",
    sub_paths: [
      {
        path: "/dashboard/inventory/[id]",
        name: "Detail Inventaris",
        isDynamic: true,
        dynamicName: (params: any, meta?: Record<string, string>) => {
          return meta?.["inventory"] ?? `Detail`;
        },
      },
      {
        path: "/dashboard/inventory/[id]/detail",
        name: "Detail Inventaris",
        isDynamic: true,
        dynamicName: (params: any, meta?: Record<string, string>) => {
          return meta?.["inventory-notes"] ?? `Detail`;
        },
      },
    ],
  },
  {
    path: "/dashboard/non-inventory",
    name: "Non-Inventaris",
    sub_paths: [
      {
        path: "/dashboard/non-inventory/[id]",
        name: "Detail Non-Inventaris",
        isDynamic: true,
        dynamicName: (params: any, meta?: Record<string, string>) => {
          return meta?.["nonInventory"] ?? `Detail`;
        },
      },
    ],
  },
  {
    path: "/dashboard/inventory-submission",
    name: "Pengajuan Inventaris",
    sub_paths: [
      {
        path: "/dashboard/inventory-submission/[id]",
        name: "Detail Pengajuan",
        isDynamic: true,
        dynamicName: (params: any, meta?: Record<string, string>) => {
          return meta?.["submission"] ?? `Detail`;
        },
      },
    ],
  },
  {
    path: "/dashboard/reports",
    name: "Laporan Pemberian Pakan",
    sub_paths: [
      // {
      //   path: "/dashboard/reports/daily",
      //   name: "Laporan Harian",
      // },
      {
        path: "/dashboard/reports",
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
      },
      {
        path: "/dashboard/reports/move",
        name: "Laporan Pindah Kolam",
      },
      {
        path: "/dashboard/reports/mortality",
        name: "Laporan Kematian",
      },
      {
        path: "/dashboard/reports/seeding",
        name: "Laporan Tebar Benih",
      },
      {
        path: "/dashboard/reports/harvest",
        name: "Laporan Panen",
      },
      {
        path: "/dashboard/reports/iot",
        name: "Laporan IoT",
      },
    ],
  },
  {
    path: "/dashboard/commodity",
    name: "Komoditas",
    sub_paths: [
      {
        path: "/dashboard/commodity/[id]",
        name: "Detail Komoditas",
        isDynamic: true,
        dynamicName: (params: any, meta?: Record<string, string>) => {
          return meta?.["commodity"] ?? `Detail`;
        },
      },
    ],
  },
  {
    path: "/dashboard/finance",
    name: "Keuangan",
    sub_paths: [
      {
        path: "/dashboard/finance/[id]",
        name: "Detail Transaksi",
        isDynamic: true,
        dynamicName: (params: any, meta?: Record<string, string>) => {
          return meta?.["finance"] ?? `Detail`;
        },
      },
    ],
  },
];

export default dataPath;

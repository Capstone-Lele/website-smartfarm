import path from "path";

const dataPath = [
    {
        path: '/dashboard',
        name: 'Beranda',
    },
    {
        path: '/dashboard/pools',
        name: 'Daftar Kolam',
    },
    {
    },
    {
        path: '/dashboard/master-data',
        name: 'Master Data',
        sub_paths: [
            {
                path: '/dashboard/master-data/categories',
                name: 'Kategori',
            },
            {
                path: '/dashboard/master-data/products',
                name: 'Produk',
            },
            {
                path: '/dashboard/master-data/units',
                name: 'Satuan',
            }
        ],
    },
    {
        path: '/dashboard/users',
        name: 'Pengguna',
    },
    {
        path: '/dashboard/reports',
        name: 'Laporan',
        sub_paths: [
            {
                path: '/dashboard/reports/daily',
                name: 'Harian',
            },
            {
                path: '/dashboard/reports/feeding',
                name: 'Pemberian Pakan',
            },
            {
                path: '/dashboard/reports/vitamin',
                name: 'Vitamin',
            },
            {
                path: '/dashboard/reports/sick',
                name: 'Sakit',
            },
        ],
    },
]

export default dataPath;
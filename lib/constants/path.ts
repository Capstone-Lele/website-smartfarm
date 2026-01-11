import path from "path";

const dataPath = [
    {
        path: '/dashboard',
        name: 'Beranda',
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
        path: '/reports',
        name: 'Reports',
    },
]

export default dataPath;
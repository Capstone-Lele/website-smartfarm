export const API_ENDPOINTS = {
    AUTH:{
        LOGIN: '/auth/login',
        LOGOUT: '/logout',
        INFO: '/app/user-info',
    },
    MASTER_DATA: {
        KATEGORI: {
            GET_ALL: '/master-data/categories',
        },
        UNIT: {
            GET_ALL: '/master-data/units',
            DELETE: (id: string) => `/master-data/units/${id}`,
            CREATE: '/master-data/units',
            UPDATE: (id: string) => `/master-data/units/${id}`,
        },
        PRODUCT: {
            GET_ALL: '/master-data/products',
            CREATE: '/master-data/products',
            DELETE: (id: string) => `/master-data/product/${id}`,
            UPDATE: (id: string) => `/master-data/product/${id}`,
        },
    },
    USERS:{
        GET_ALL: '/users',
        CREATE: '/users',
        DELETE: (id: string) => `/users/${id}`,
        UPDATE: (id: string) => `/users/${id}`,
    }
} as const;
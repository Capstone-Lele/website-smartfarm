export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/logout",
    INFO: "/app/user-info",
  },
  MASTER_DATA: {
    KATEGORI: {
      GET_ALL: "/master-data/categories",
    },
    UNIT: {
      GET_ALL: "/master-data/units",
      DELETE: (id: string) => `/master-data/units/${id}`,
      CREATE: "/master-data/units",
      UPDATE: (id: string) => `/master-data/units/${id}`,
    },
    PRODUCT: {
      GET_ALL: "/master-data/products",
      CREATE: "/master-data/products",
      DELETE: (id: string) => `/master-data/product/${id}`,
      UPDATE: (id: string) => `/master-data/product/${id}`,
    },
  },
  USERS: {
    GET_ALL: "/user",
    GET_BY_ID: (id: string) => `/user/${id}`,
    CREATE: "/user",
    DELETE: (id: string) => `/user/${id}`,
    UPDATE: (id: string) => `/user/${id}`,
  },
  POOLS: {
    GET_ALL: "/pool",
    GET_BY_ID: (id: string) => `/pool/${id}`,
    CREATE: "/pool",
    DELETE: (id: string) => `/pool/${id}`,
    UPDATE: (id: string) => `/pool/${id}`,
  },
} as const;

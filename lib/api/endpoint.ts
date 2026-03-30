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
      GET_ALL: "/master-data/unit",
      DELETE: (id: string) => `/master-data/unit/${id}`,
      CREATE: "/master-data/unit",
      UPDATE: (id: string) => `/master-data/unit/${id}`,
    },
    PRODUCT: {
      GET_ALL: "/master-data/product",
      CREATE: "/master-data/product",
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
  CYCLES: {
    GET_ALL_BY_ID: (id: string) => `/cycle/${id}`,
    GET_DETAIL_BY_ID: (id: string) => `/cycle/detail/${id}`,
  },
  FEED_NOTES: {
    GET_ALL: "/note/feed",
    GET_BY_ID: (id: string) => `/note/feed/${id}`,
  },
  SICK_NOTES: {
    GET_ALL: "/note/sick",
    GET_BY_ID: (id: string) => `/note/sick/${id}`,
  },
  VITAMIN_NOTES: {
    GET_ALL: "/note/vitamin",
    GET_BY_ID: (id: string) => `/note/vitamin/${id}`,
  },
  SAMPLING_NOTES: {
    GET_ALL: "/note/samplings",
    GET_ALL_WITH_PARAMS: (params: Record<string, string>) => {
      const query = new URLSearchParams(params).toString();
      return `/note/samplings?${query}`;
    },
    GET_BY_ID: (id: string) => `/note/sampling/${id}`,
  },
  PROFILE: {
    GET_PROFILE: "/app/user",
    UPDATE: "/app/user",
  },
  BUYER: {
    GET_ALL: "/master-data/buyer",
    GET_BY_ID: (id: string) => `/master-data/buyer/${id}`,
    CREATE: "/master-data/buyer",
    DELETE: (id: string) => `/master-data/buyer/${id}`,
    UPDATE: (id: string) => `/master-data/buyer/${id}`,
  },
  CLEANING_NOTES: {
    GET_ALL: "/note/cleanings",
    GET_BY_ID: (id: string) => `/note/cleaning/${id}`,
  },
  MOVE_NOTES: {
    GET_ALL: "/note/move-pool",
    GET_BY_ID: (id: string) => `/note/move-pool/${id}`,
  },
  INVENTORY: {
    GET_ALL: "/inventory",
    CREATE: "/inventory",
    DELETE: (id: string) => `/inventory/${id}`,
    STOCK_IN_OUT: (id: string) => `/inventory/${id}/stock`,
  },
  INVENTORY_SUBMISSION: {
    GET_ALL: "/inventory/submissions",
    GET_BY_ID: (id: string) => `/inventory/submission/${id}`,
  },
} as const;


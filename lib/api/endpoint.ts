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
      DELETE: (id: string) => `/master-data/unit/${id}`,
      CREATE: "/master-data/unit",
      UPDATE: (id: string) => `/master-data/unit/${id}`,
    },
    PRODUCT: {
      GET_PRODUCT_USAGE: "/master-data/product/usage",
      GET_ALL: "/master-data/products",
      GET_BY_ID: (id: string) => `/master-data/product/${id}`,
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
    GET_ALL_WITH_PARAMS: (params: Record<string, string>) => {
      const query = new URLSearchParams(params).toString();
      return `/note/feed?${query}`;
    },
    GET_BY_ID: (id: string) => `/note/feed/${id}`,
  },
  SICK_NOTES: {
    GET_ALL: "/note/sick",
    GET_BY_ID: (id: string) => `/note/sick/${id}`,
    GET_ALL_WITH_PARAMS: (params: Record<string, string>) => {
      const query = new URLSearchParams(params).toString();
      return `/note/sick?${query}`;
    }
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
    GET_ALL: "/master-data/buyers",
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
    GET_ALL_WITH_PARAMS: (params: Record<string, string>) => {
      const query = new URLSearchParams(params).toString();
      return `/note/move-pool?${query}`;
    }
  },
  MORTALITY_NOTES: {
    GET_ALL: "/note/mortality",
    GET_BY_ID: (id: string) => `/note/mortality/${id}`,
    GET_ALL_WITH_PARAMS: (params: Record<string, string>) => {
      const query = new URLSearchParams(params).toString();
      return `/note/mortality?${query}`;
    }
  },
  HARVEST_NOTES: {
    GET_ALL: "/note/harvest",
    GET_BY_ID: (id: string) => `/note/harvest/${id}`,
  },
  SEED_NOTES: {
    GET_ALL: "/note/seed",
    GET_BY_ID: (id: string) => `/note/seed/${id}`,
  },
  INVENTORY: {
    GET_ALL: "/inventory",
    GET_BY_ID: (id: string) => `/note/inventory/${id}`,
    GET_BY_ID_WITH_PARAMS: (id: string, params: Record<string, string>) => {
      const query = new URLSearchParams(params).toString();
      return `/inventory/${id}?${query}`;
    },
    CREATE: "/inventory",
    UPDATE: (id: string) => `/inventory/${id}`,
    DELETE: (id: string) => `/inventory/${id}`,
    POST_TRANSACTION: "/inventory/transaction",
  },
  INVENTORY_SUBMISSION: {
    GET_ALL: "/inventory/submissions",
    GET_BY_ID: (id: string) => `/inventory/submission/${id}`,
    UPDATE: (id: string) => `/inventory/submission/status/${id}`,
  },
  NON_INVENTORY: {
    GET_BY_ID: (id: string) => `/inventory/non-inventory/${id}`,
  },
  COMMODITY:{
    GET_COMMODITY_BY_ID_AND_TYPE: (sourceId: string, sourceType: string) => `/commodity/${sourceId}?type=${sourceType}`,
    GET_ALL: "/commodity",
    GET_BY_ID: (id: string) => `/commodity/${id}`,
    CREATE: "/commodity",
  },
  FINANCES: {
    GET_FINANCE_BY_SOURCE_ID: (sourceId: string) => `/finance/${sourceId}`,
    GET_INVENTORY: "/finance?sourceType=inventory_notes",
    GET_NON_INVENTORY: "/finance?sourceType=manual",
    GET_INVENTORY_SUBMISSION: "/finance?sourceType=inventory_submissions",
    GET_COMMODITY: "/finance?sourceType=commodity_sales",
    CREATE: "/finance", 
  },
  DASHBOARD:{
    GET: "/app/dashboard",
  },
  IOT: {
    GET_ALL: "/iot/data", // historical data untuk semua kolam
    GET_BY_NODE: (nodeId: string) => `/iot/data/${nodeId}`, // historical data untuk node tertentu
    GET_ALL_LIVE: "/iot/pool/data", // data real-time untuk semua kolam
    GET_LIVE_BY_NODE: (nodeId: string) => `/iot/pool/${nodeId}`, // data real-time untuk node tertentu
  },
  GUEST: {
    GENERAL_INFO: "/app/general-info",
    // PUBLIC FINANCE
    GET_PUBLIC_FINANCE_INVENTORY:`/app/finance?sourceType=inventory_notes`,
    GET_PUBLIC_FINANCE_NON_INVENTORY:`/app/finance?sourceType=manual`,
    GET_PUBLIC_FINANCE_INVENTORY_SUBMISSION:`/app/finance?sourceType=inventory_submissions`,
    GET_PUBLIC_FINANCE_COMMODITY:`/app/finance?sourceType=commodity_sales`,
  },
  CLEAR_REDIS_CACHE: "/app/clear-cache",
} as const;


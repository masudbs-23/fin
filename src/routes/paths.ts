// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/',
  PROFILE: '/profile',
  CATALOG: '/catalog',
  PRODUCTS: '/products',
  CUSTOMERS: '/customers',
  RECIPIENTS: '/recipients',
  TRANSACTIONS: '/transactions',
  COMMISSIONS: '/commissions',
  BRANDS: '/brands',
  TRANSFERS: '/transfers',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
    verifyOtp: `${ROOTS.AUTH}/verify-otp`,
    deviceBinding: `${ROOTS.AUTH}/device-binding`,
    newPassword: (token: string) => `${ROOTS.AUTH}/reset-password/${token}`,
  },
  // PROFILE
  profile: {
    root: `${ROOTS.PROFILE}`,
    details: `${ROOTS.PROFILE}/details`,
    changePassword: `${ROOTS.PROFILE}/change-password`,
  },
  // ERROR
  error: {
    forbidden: `${ROOTS.DASHBOARD}403`,
    notFound: `${ROOTS.AUTH}/404`,
    serverError: `${ROOTS.AUTH}/500`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
  products: {
    root: ROOTS.PRODUCTS,
    productCreate: `${ROOTS.PRODUCTS}/create`,
    productView: (id: string) => `${ROOTS.PRODUCTS}/${id}/view`,
    productEdit: (id: string) => `${ROOTS.PRODUCTS}/${id}/edit`,
  },
  customers: {
    root: ROOTS.CUSTOMERS,
  },
  commissions: {
    root: ROOTS.COMMISSIONS,
    commissionCreate: `${ROOTS.COMMISSIONS}/create`,
    commissionView: (id: string) => `${ROOTS.COMMISSIONS}/${id}/view`,
    commissionEdit: (id: string) => `${ROOTS.COMMISSIONS}/${id}/edit`,
  },
  // BRANDS
  brands: {
    root: ROOTS.BRANDS,
    brandCreate: `${ROOTS.BRANDS}/create`,
    brandView: (id: string) => `${ROOTS.BRANDS}/${id}/view`,
    brandEdit: (id: string) => `${ROOTS.BRANDS}/${id}/edit`,
  },
  transactions: {
    root: ROOTS.TRANSACTIONS,
    transactionCreate: `${ROOTS.TRANSACTIONS}/create`,
    transactionView: (id: string) => `${ROOTS.TRANSACTIONS}/${id}/view`,
    transactionEdit: (id: string) => `${ROOTS.TRANSACTIONS}/${id}/edit`,
  },
  recipients: {
    root: ROOTS.RECIPIENTS,
    recipientCreate: `${ROOTS.RECIPIENTS}/create`,
    recipientView: (id: string) => `${ROOTS.RECIPIENTS}/${id}/view`,
    recipientEdit: (id: string) => `${ROOTS.RECIPIENTS}/${id}/edit`,
  },
  transfers: {
    root: ROOTS.TRANSFERS,
    transferDetails: (id: string) => `${ROOTS.TRANSFERS}/${id}`,
  },
  // Legacy aliases kept for compatibility
  tags: {
    root: ROOTS.COMMISSIONS,
    tagCreate: `${ROOTS.COMMISSIONS}/create`,
    tagView: (id: string) => `${ROOTS.COMMISSIONS}/${id}/view`,
    tagEdit: (id: string) => `${ROOTS.COMMISSIONS}/${id}/edit`,
  },
  categories: {
    root: ROOTS.TRANSACTIONS,
    categoryCreate: `${ROOTS.TRANSACTIONS}/create`,
    categoryView: (id: string) => `${ROOTS.TRANSACTIONS}/${id}/view`,
    categoryEdit: (id: string) => `${ROOTS.TRANSACTIONS}/${id}/edit`,
  },
  manufacturers: {
    root: ROOTS.RECIPIENTS,
    manufacturerCreate: `${ROOTS.RECIPIENTS}/create`,
    manufacturerView: (id: string) => `${ROOTS.RECIPIENTS}/${id}/view`,
    manufacturerEdit: (id: string) => `${ROOTS.RECIPIENTS}/${id}/edit`,
  },
  orders: {
    root: ROOTS.TRANSFERS,
    orderDetails: (id: string) => `${ROOTS.TRANSFERS}/${id}`,
  },
};

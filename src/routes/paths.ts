// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/',
  PROFILE: '/profile',
  CUSTOMERS: '/customers',
  RECIPIENTS: '/recipients',
  TRANSACTIONS: '/transactions',
  COMMISSIONS: '/commissions',
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
  customers: {
    root: ROOTS.CUSTOMERS,
  },
  commissions: {
    root: ROOTS.COMMISSIONS,
  },
  transactions: {
    root: ROOTS.TRANSACTIONS,
  },
  recipients: {
    root: ROOTS.RECIPIENTS,
  },
  transfers: {
    root: ROOTS.TRANSFERS,
  },
};

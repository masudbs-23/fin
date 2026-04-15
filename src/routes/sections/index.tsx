import { Navigate, useRoutes } from 'react-router-dom';

import { PATH_AFTER_LOGIN } from 'src/config-global';

import { authRoutes } from 'src/routes/sections/auth';
import { dashboardRoutes } from 'src/routes/sections/dashboard';
import { mainRoutes } from 'src/routes/sections/main';
import { profileRoutes } from 'src/routes/sections/profile';
import { productsRoutes } from './products';
import { transfersRoutes } from './transfers';
import { recipientsRoutes } from './recipients';
import { transactionsRoutes } from './transactions';
import { commissionsRoutes } from './commissions';
import { brandsRoutes } from './brands';
import { customersRoutes } from './customers';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },
    // Auth routes
    ...authRoutes,

    // Profile routes
    ...profileRoutes,

    // Dashboard routes
    ...dashboardRoutes,
    ...customersRoutes,

    // Catalog routes
    // ...catalogRoutes,
    // Product routes
    ...productsRoutes,
    // Recipient routes
    ...recipientsRoutes,
    // Transaction routes
    ...transactionsRoutes,
    // Commission routes
    ...commissionsRoutes,
    // brans routes
    ...brandsRoutes,
    // Transfer routes
    ...transfersRoutes,

    // Main routes
    ...mainRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

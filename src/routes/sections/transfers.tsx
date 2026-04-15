import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

const TransfersListPage = lazy(() => import('src/pages/orders/orders-list-page'));
const TransferDetailsPage = lazy(() => import('src/pages/orders/order-details-page'));

export const transfersRoutes = [
  {
    path: '/transfers',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <TransfersListPage />, index: true },
      { element: <TransferDetailsPage />, path: ':orderId' },
    ],
  },
];

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/auth/guard';
import { LoadingScreen } from 'src/components/loading-screen';
import DashboardLayout from 'src/layouts/dashboard';

const CustomersListPage = lazy(() => import('src/pages/customers/customers-list-page'));

export const customersRoutes = [
  {
    path: '/customers',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [{ element: <CustomersListPage />, index: true }],
  },
];

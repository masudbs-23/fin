import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

const CommissionsListPage = lazy(() => import('src/pages/catalog/tags/tags-list-page'));
const CommissionCreatePage = lazy(() => import('src/pages/catalog/tags/tag-create-page'));
const CommissionViewPage = lazy(() => import('src/pages/catalog/tags/tag-view-page'));
const CommissionEditPage = lazy(() => import('src/pages/catalog/tags/tag-edit-page'));

export const commissionsRoutes = [
  {
    path: '/commissions',
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
      { element: <CommissionsListPage />, index: true },
      { element: <CommissionCreatePage />, path: 'create' },
      { element: <CommissionViewPage />, path: ':commissionId/view' },
      { element: <CommissionEditPage />, path: ':commissionId/edit' },
    ],
  },
];

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

const RecipientsListPage = lazy(() => import('src/pages/catalog/manufacturers/manufacturers-list-page'));
const RecipientCreatePage = lazy(() => import('src/pages/catalog/manufacturers/manufacturer-create-page'));
const RecipientViewPage = lazy(() => import('src/pages/catalog/manufacturers/manufacturer-view-page'));
const RecipientEditPage = lazy(() => import('src/pages/catalog/manufacturers/manufacturer-edit-page'));

export const recipientsRoutes = [
  {
    path: '/recipients',
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
      { element: <RecipientsListPage />, index: true },
      { element: <RecipientCreatePage />, path: 'create' },
      { element: <RecipientViewPage />, path: ':recipientId/view' },
      { element: <RecipientEditPage />, path: ':recipientId/edit' },
    ],
  },
];

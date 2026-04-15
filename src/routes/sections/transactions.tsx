import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

const TransactionsListPage = lazy(() => import('src/pages/catalog/categories/categories-list-page'));
const TransactionCreatePage = lazy(() => import('src/pages/catalog/categories/category-create-page'));
const TransactionViewPage = lazy(() => import('src/pages/catalog/categories/category-view-page'));
const TransactionEditPage = lazy(() => import('src/pages/catalog/categories/category-edit-page'));

export const transactionsRoutes = [
  {
    path: '/transactions',
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
      { element: <TransactionsListPage />, index: true },
      { element: <TransactionCreatePage />, path: 'create' },
      { element: <TransactionViewPage />, path: ':transactionId/view' },
      { element: <TransactionEditPage />, path: ':transactionId/edit' },
    ],
  },
];

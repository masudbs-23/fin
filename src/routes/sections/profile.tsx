import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
// ----------------------------------------------------------------------

const ChangePasswordPage = lazy(() => import('src/pages/profile/change-password-page'));
const ProfileDetailsPage = lazy(() => import('src/pages/profile/profile-details-page'));

// ----------------------------------------------------------------------

export const profileRoutes = [
  {
    path: '/profile',
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
      { element: <ProfileDetailsPage />, path: 'details' },
      { element: <ChangePasswordPage />, path: 'change-password' },
    ],
  },
];

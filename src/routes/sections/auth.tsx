import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { GuestGuard } from 'src/auth/guard';
import AuthClassicLayout from 'src/layouts/auth/classic';
import CompactLayout from 'src/layouts/compact';

import { SplashScreen } from 'src/components/loading-screen';

const LoginPage = lazy(() => import('src/pages/auth/login'));
const ForgotPasswordPage = lazy(() => import('src/pages/auth/forgot-password'));
const VerifyOtpPage = lazy(() => import('src/pages/auth/verify-otp'));
const DeviceBindingPage = lazy(() => import('src/pages/auth/device-binding'));
const NewPasswordPage = lazy(() => import('src/pages/auth/new-password'));

const auth = {
  path: 'auth',
  element: (
    <Suspense fallback={<SplashScreen />}>
      <Outlet />
    </Suspense>
  ),
  children: [
    {
      path: 'login',
      element: (
        <GuestGuard>
          <AuthClassicLayout>
            <LoginPage />
          </AuthClassicLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'forgot-password',
      element: (
        <GuestGuard>
          <AuthClassicLayout>
            <ForgotPasswordPage />
          </AuthClassicLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'verify-otp',
      element: (
        <GuestGuard>
          <AuthClassicLayout>
            <VerifyOtpPage />
          </AuthClassicLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'device-binding',
      element: (
        <GuestGuard>
          <AuthClassicLayout>
            <DeviceBindingPage />
          </AuthClassicLayout>
        </GuestGuard>
      ),
    },
    {
      element: (
        <CompactLayout>
          <Outlet />
        </CompactLayout>
      ),
      children: [
        {
          path: 'new-password',
          children: [
            {
              path: ':token',
              element: <NewPasswordPage />,
            },
          ],
        },
      ],
    },
  ],
};

export const authRoutes = [auth];

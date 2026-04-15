import { useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();
  const AUTH_ACCOUNT_STATUS_KEY = 'authAccountStatus';
  const LOGIN_AFTER_DEVICE_BINDING_KEY = 'isLoginAFterDeviceBinding';

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo') || paths.dashboard.root;

  const { authenticated, user } = useAuthContext();

  const check = useCallback(() => {
    if (authenticated) {
      const accountStatusFromUser = user?.accountStatus;
      const accountStatusFromStorage = Number(sessionStorage.getItem(AUTH_ACCOUNT_STATUS_KEY));
      let resolvedAccountStatus: number | null = null;
      if (typeof accountStatusFromUser === 'number') {
        resolvedAccountStatus = accountStatusFromUser;
      } else if (!Number.isNaN(accountStatusFromStorage)) {
        resolvedAccountStatus = accountStatusFromStorage;
      }
      const needsDeviceBinding = resolvedAccountStatus === 11;
      const isDeviceBindingRoute = window.location.pathname === paths.auth.deviceBinding;
      const isDeviceBound = sessionStorage.getItem('deviceBindingVerified') === 'true';
      const isLoginAfterDeviceBinding = localStorage.getItem(LOGIN_AFTER_DEVICE_BINDING_KEY) === 'true';

      if (needsDeviceBinding && !isDeviceBound && !isLoginAfterDeviceBinding) {
        if (!isDeviceBindingRoute) {
          router.replace(paths.auth.deviceBinding);
        }
        return;
      }
      router.replace(returnTo);
    }
  }, [authenticated, returnTo, router, user, AUTH_ACCOUNT_STATUS_KEY, LOGIN_AFTER_DEVICE_BINDING_KEY]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}

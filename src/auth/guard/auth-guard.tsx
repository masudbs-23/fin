/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

const loginPaths: Record<string, string> = {
  jwt: paths.auth.login,
};
const DEVICE_BINDING_VERIFIED_KEY = 'deviceBindingVerified';
const AUTH_ACCOUNT_STATUS_KEY = 'authAccountStatus';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { loading, retryLoading } = useAuthContext();

  return <>{loading || retryLoading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();

  const { authenticated, method, retryLoading, user } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    // Don't redirect during retry loading state
    if (retryLoading) {
      return;
    }

    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = loginPaths[method];

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      const accountStatusFromUser = user?.accountStatus;
      const accountStatusFromStorage = Number(sessionStorage.getItem(AUTH_ACCOUNT_STATUS_KEY));
      let resolvedAccountStatus: number | null = null;
      if (typeof accountStatusFromUser === 'number') {
        resolvedAccountStatus = accountStatusFromUser;
      } else if (!Number.isNaN(accountStatusFromStorage)) {
        resolvedAccountStatus = accountStatusFromStorage;
      }
      const needsDeviceBinding = resolvedAccountStatus === 11;
      const isDeviceBound = sessionStorage.getItem(DEVICE_BINDING_VERIFIED_KEY) === 'true';

      if (needsDeviceBinding && !isDeviceBound) {
        router.replace(paths.auth.deviceBinding);
        return;
      }

      setChecked(true);
    }
  }, [authenticated, method, router, retryLoading, user]);

  useEffect(() => {
    check();
  }, [authenticated, retryLoading]);

  if (!checked || retryLoading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

import { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { clearAuthClientStateWithOptions } from 'src/auth/utils/clear-auth-client-state';
import { PROJECT_NAME } from 'src/config-global';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { VerifyOtpView } from 'src/sections/auth/verify-otp';

export default function DeviceBindingPage() {
  const router = useRouter();

  const isReloadNavigation = () => {
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navEntries.length > 0) {
      return navEntries[0].type === 'reload';
    }
    // fallback for older browser implementations
    return (performance as any).navigation?.type === 1;
  };

  const goToLoginWithClear = useCallback(() => {
    clearAuthClientStateWithOptions({ clearAllStorage: true });
    router.replace(paths.auth.login);
  }, [router]);

  useEffect(() => {
    const handlePopState = () => {
      goToLoginWithClear();
    };

    if (isReloadNavigation()) {
      goToLoginWithClear();
    } else {
      // Push one history state so browser back from device-binding can be intercepted
      // and redirected to login after clearing auth/session data.
      window.history.pushState({ fromDeviceBinding: true }, '', window.location.href);
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [goToLoginWithClear]);

  return (
    <>
      <Helmet>
        <title>{PROJECT_NAME}: Device Binding</title>
      </Helmet>

      <VerifyOtpView mode="device-binding" onExitToLogin={goToLoginWithClear} />
    </>
  );
}

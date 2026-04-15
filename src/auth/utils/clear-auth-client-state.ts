import { setSession } from 'src/auth/context/jwt/utils';

const AUTH_ACCOUNT_STATUS_KEY = 'authAccountStatus';
const DEVICE_BINDING_VERIFIED_KEY = 'deviceBindingVerified';
const OTP_FLOW_CONTEXT_KEY = 'otpFlowContext';
const LOGIN_AFTER_DEVICE_BINDING_KEY = 'isLoginAFterDeviceBinding';

export const clearAuthClientState = () => {
  clearAuthClientStateWithOptions();
};

type ClearAuthOptions = {
  clearAllStorage?: boolean;
};

export const clearAuthClientStateWithOptions = ({ clearAllStorage = false }: ClearAuthOptions = {}) => {
  // Clear axios auth header + access token
  setSession(null);

  if (clearAllStorage) {
    localStorage.clear();
    sessionStorage.clear();
  } else {
    // Clear route-guard/session flow flags
    sessionStorage.removeItem(AUTH_ACCOUNT_STATUS_KEY);
    sessionStorage.removeItem(DEVICE_BINDING_VERIFIED_KEY);
    sessionStorage.removeItem(OTP_FLOW_CONTEXT_KEY);
    localStorage.removeItem(LOGIN_AFTER_DEVICE_BINDING_KEY);
  }

  // Notify auth provider to drop in-memory user state immediately.
  window.postMessage({ messageType: 'logout' }, window.location.origin);
};

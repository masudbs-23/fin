export interface LoginDeviceInfo {
  platformType: number;
  platformInfo: string;
  platformVersion: string;
  deviceIdentifier: string;
  appLanguage: string;
  appVersionNo: number;
  deviceIp: string;
  deviceModel: string;
  deviceName: string;
  deviceOS: string;
  deviceOsVersion: string;
  pushToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  userType: number;
  deviceInfo: LoginDeviceInfo;
  ipAddress: string;
}

export interface LoginResponseData {
  token: string;
  userIdentity: string;
  userFullName: string;
  lastLoginDate: string | null;
  passwordExpiryDate: string;
  accountStatus: number;
  ekycStatus: number;
  riskStatus: number;
  email: string;
  countryCodeOfResidence: string;
  customerShortName: string;
  sessionKey: string;
  mobileNumber: string;
  isDeviceBindingNeeded: boolean;
}

export interface LoginResponse {
  responseCode: string;
  responseMessage: string;
  data: LoginResponseData;
}

export interface TfaTypeResponse {
  responseCode: string;
  responseMessage: string;
  success: boolean;
  data: {
    tfaTypeCode: string;
    configType: string;
  };
}

export interface GenerateOtpPayload {
  globalFeatureCode: string;
  identifierValue: string;
  notificationOptionCode: string;
  tfaTypeCode: string;
  userType: number;
}

export interface GenerateOtpResponse {
  responseCode: string;
  responseMessage: string;
  success: boolean;
  data: {
    tokenSessionId: string;
    otpValidityInMinute: number;
  };
}

export interface VerifyOtpPayload {
  globalFeatureCode: string;
  identifierValue: string;
  passcode: string;
  sessionId: string;
  tfaTypeCode: string;
  userType: number;
}

export interface VerifyOtpResponse {
  responseCode: string;
  responseMessage: string;
  success: boolean;
  data: {
    verified: boolean;
    blocked: boolean;
  };
}

export interface DeviceBindingRequest {
  appLanguage: string;
  appVersion: string;
  deviceIp: string;
  deviceModel: string;
  deviceName: string;
  deviceOS: string;
  deviceOsVersion: string;
  platformType: number;
  platformInfo: string;
  platformVersion: string;
  deviceIdentifier: string;
  pushToken: string;
}

export interface DeviceBindingPayload {
  deviceRequest: DeviceBindingRequest;
  globalFeatureCode: 'DEVICE_BINDING';
  identifierValue: string;
  sessionId: string;
}

export interface DeviceBindingResponse {
  responseCode: string;
  responseMessage: string;
  success: boolean;
  data?: Record<string, unknown>;
}

export type OtpFlowType = 'FORGOT_PASSWORD' | 'DEVICE_BINDING';

export interface OtpFlowContext {
  flowType: OtpFlowType;
  email?: string;
  globalFeatureCode: 'GF_RESET_PASSWORD' | 'DEVICE_BINDING';
  identifierValue: string;
  notificationOptionCode: string;
  tfaTypeCode?: string;
  sessionId?: string;
  otpValidityInMinute?: number;
  userType: number;
  authToken?: string;
}

export const OTP_FLOW_CONTEXT_KEY = 'otpFlowContext';

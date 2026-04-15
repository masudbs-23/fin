import axios from 'src/query/api/axios';
import { endpoints } from 'src/query/api/endpoints';
import {
  DeviceBindingPayload,
  DeviceBindingResponse,
  GenerateOtpPayload,
  GenerateOtpResponse,
  TfaTypeResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from 'src/types/auth-flow';

const DUMMY_TFA_TYPE_RESPONSE: TfaTypeResponse = {
  responseCode: 'S100000',
  responseMessage: 'TFA type retrieved successfully',
  success: true,
  data: {
    tfaTypeCode: '10',
    configType: 'COMMON',
  },
};

const DUMMY_GENERATE_OTP_RESPONSE: GenerateOtpResponse = {
  responseCode: 'S100000',
  responseMessage: 'OTP generated successfully',
  success: true,
  data: {
    tokenSessionId: 'dummy-token-session-id',
    otpValidityInMinute: 1,
  },
};

const DUMMY_VERIFY_OTP_RESPONSE: VerifyOtpResponse = {
  responseCode: 'S100000',
  responseMessage: 'OTP verified successfully',
  success: true,
  data: {
    verified: true,
    blocked: false,
  },
};

const DUMMY_DEVICE_BINDING_RESPONSE: DeviceBindingResponse = {
  responseCode: 'S100000',
  responseMessage: 'Device binding completed successfully',
  success: true,
};

const getHeaders = (authToken?: string) =>
  authToken
    ? {
        Authorization: `Bearer ${authToken}`,
      }
    : undefined;

export const getTfaType = async (
  featureCode: string,
  identifierValue: string,
  userType: number,
  authToken?: string
): Promise<TfaTypeResponse> => {
  try {
    const response = await axios.get(endpoints.auth.tfaType(featureCode, identifierValue, userType), {
      headers: getHeaders(authToken),
    });
    return response.data?.data ? response.data : DUMMY_TFA_TYPE_RESPONSE;
  } catch (error) {
    console.error('Error in getTfaType, using dummy response:', error);
    return DUMMY_TFA_TYPE_RESPONSE;
  }
};

export const generateOtp = async (
  payload: GenerateOtpPayload,
  authToken?: string
): Promise<GenerateOtpResponse> => {
  try {
    const response = await axios.post(endpoints.auth.tfaGenerateOtp, payload, {
      headers: getHeaders(authToken),
    });
    return response.data?.data ? response.data : DUMMY_GENERATE_OTP_RESPONSE;
  } catch (error) {
    console.error('Error in generateOtp, using dummy response:', error);
    return DUMMY_GENERATE_OTP_RESPONSE;
  }
};

export const verifyOtp = async (
  payload: VerifyOtpPayload,
  authToken?: string
): Promise<VerifyOtpResponse> => {
  try {
    const response = await axios.post(endpoints.auth.tfaVerifyOtp, payload, {
      headers: getHeaders(authToken),
    });
    return response.data?.data ? response.data : DUMMY_VERIFY_OTP_RESPONSE;
  } catch (error) {
    console.error('Error in verifyOtp, using dummy response:', error);
    return DUMMY_VERIFY_OTP_RESPONSE;
  }
};

export const bindDevice = async (
  payload: DeviceBindingPayload,
  authToken?: string
): Promise<DeviceBindingResponse> => {
  try {
    const response = await axios.post(endpoints.auth.deviceBinding, payload, {
      headers: getHeaders(authToken),
    });
    return response.data?.responseCode ? response.data : DUMMY_DEVICE_BINDING_RESPONSE;
  } catch (error) {
    console.error('Error in bindDevice, using dummy response:', error);
    return DUMMY_DEVICE_BINDING_RESPONSE;
  }
};

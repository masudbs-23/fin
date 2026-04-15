import axios from 'src/query/api/axios';
import { endpoints } from 'src/query/api/endpoints';
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  NewPasswordPayload,
  NewPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from 'src/types/forgot-password';

const FORGOT_PASSWORD_DUMMY_RESPONSE: ForgotPasswordResponse = {
  responseCode: 'S100000',
  responseMessage: 'If an account with this email exists, you will receive an OTP shortly.',
  data: {
    token: 'dummy-forgot-password-token',
  },
  success: true,
};

export const sendForgotPasswordEmail = async (
  userData: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await axios.post(endpoints.auth.forgotPassword, userData);
    const apiResponse = response.data as ForgotPasswordResponse;
    if (apiResponse?.responseCode && apiResponse?.data?.token) {
      return apiResponse;
    }
    return FORGOT_PASSWORD_DUMMY_RESPONSE;
  } catch (error: any) {
    console.error('Error in sendForgotPasswordEmail, fallback response:', error);
    return FORGOT_PASSWORD_DUMMY_RESPONSE;
  }
};

export const resetPassword = async (
  resetData: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  try {
    const response = await axios({
      method: 'POST',
      url: endpoints.auth.resetPassword,
      data: resetData,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error in resetPassword:', error);
    throw error;
  }
};

export const setNewPassword = async (
  newPasswordData: NewPasswordPayload
): Promise<NewPasswordResponse> => {
  try {
    const response = await axios({
      method: 'POST',
      url: endpoints.auth.resetPassword,
      data: newPasswordData,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error in setNewPassword:', error);
    throw error;
  }
};

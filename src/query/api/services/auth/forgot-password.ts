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
  responseMessage: 'OTP generated successfully',
  data: {
    tokenSessionId: '1776072295326255d724e23034e7aa2f435df18cfea01',
    otpValidityInMinute: 1,
  },
  success: true,
};

export const sendForgotPasswordEmail = async (
  userData: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await axios({
      method: 'POST',
      url: endpoints.auth.forgotPassword,
      data: userData,
    });

    return response.data?.data || response.data;
  } catch (error: any) {
    console.error('Error in sendForgotPasswordEmail, using dummy response:', error);
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

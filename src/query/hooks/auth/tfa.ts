import { useMutation } from '@tanstack/react-query';
import { generateOtp, getTfaType, verifyOtp } from 'src/query/api/services/auth/tfa';
import { GenerateOtpPayload, VerifyOtpPayload } from 'src/types/auth-flow';

export const useGetTfaType = () =>
  useMutation({
    mutationFn: ({
      featureCode,
      identifierValue,
      userType,
      authToken,
    }: {
      featureCode: string;
      identifierValue: string;
      userType: number;
      authToken?: string;
    }) => getTfaType(featureCode, identifierValue, userType, authToken),
  });

export const useGenerateOtp = () =>
  useMutation({
    mutationFn: ({ payload, authToken }: { payload: GenerateOtpPayload; authToken?: string }) =>
      generateOtp(payload, authToken),
  });

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: ({ payload, authToken }: { payload: VerifyOtpPayload; authToken?: string }) =>
      verifyOtp(payload, authToken),
  });

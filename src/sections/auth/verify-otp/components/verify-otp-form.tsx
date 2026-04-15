import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { CustomInput } from 'src/components/custom-input';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSetNewPassword } from 'src/query/hooks/auth/forgot-password';
import { useBindDevice, useGenerateOtp, useGetTfaType, useVerifyOtp } from 'src/query/hooks/auth/tfa';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { OtpFlowContext, OTP_FLOW_CONTEXT_KEY } from 'src/types/auth-flow';
import { formatErrorMessage } from 'src/utils/format-error-message';

type Props = {
  mode?: 'verify-otp' | 'device-binding';
  onSetPasswordStepChange?: (isSetPasswordStep: boolean) => void;
};
const DEVICE_BINDING_VERIFIED_KEY = 'deviceBindingVerified';
const LOGIN_AFTER_DEVICE_BINDING_KEY = 'isLoginAFterDeviceBinding';

const readOtpContext = (): OtpFlowContext | null => {
  const raw = sessionStorage.getItem(OTP_FLOW_CONTEXT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OtpFlowContext;
  } catch {
    return null;
  }
};

const writeOtpContext = (ctx: OtpFlowContext) => {
  sessionStorage.setItem(OTP_FLOW_CONTEXT_KEY, JSON.stringify(ctx));
};

const getAccessToken = () => localStorage.getItem('accessToken') || '';

const normalizePlatformInfo = (platform: string) => {
  if (/^win/i.test(platform)) return 'Windows';
  if (/^mac/i.test(platform)) return 'MacOS';
  if (/linux/i.test(platform)) return 'Linux';
  return platform || 'Unknown';
};

const getOrCreateDeviceIdentifier = () => {
  const existingIdentifier = localStorage.getItem('deviceIdentifier');
  if (existingIdentifier) return existingIdentifier;
  const generatedIdentifier = `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`.slice(0, 32);
  localStorage.setItem('deviceIdentifier', generatedIdentifier);
  return generatedIdentifier;
};

const buildDeviceRequestPayload = () => {
  const language = navigator.language || 'en-US';
  const platform = navigator.platform || 'Windows';
  const normalizedPlatform = normalizePlatformInfo(platform);
  const userAgent = navigator.userAgent || '';
  const isWindows = /Win/i.test(userAgent);
  const os = isWindows ? 'Windows' : 'Unknown';
  const osVersion = /Windows NT (\d+(?:\.\d+)?)/i.exec(userAgent)?.[1] || '10';
  const browserName = /Chrome/i.test(userAgent) ? 'Chrome' : 'Browser';
  const deviceIdentifier = getOrCreateDeviceIdentifier();
  const deviceIp = localStorage.getItem('deviceIp') || '182.48.79.227';
  const pushToken = `pushToken_${deviceIdentifier.slice(0, 12)}_${Date.now().toString(36).slice(-8)}`;

  return {
    appLanguage: language,
    appVersion: 'appVersion_1',
    deviceIp,
    deviceModel: 'Unknown',
    deviceName: `${browserName} on ${os}`,
    deviceOS: os,
    deviceOsVersion: osVersion,
    platformType: 2,
    platformInfo: normalizedPlatform,
    platformVersion: osVersion,
    deviceIdentifier,
    pushToken,
  };
};

export default function VerifyOtpForm({
  mode = 'verify-otp',
  onSetPasswordStepChange,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const newPassword = useBoolean();
  const confirmPassword = useBoolean();

  const [errorMsg, setErrorMsg] = useState<any>('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpContext, setOtpContext] = useState<OtpFlowContext | null>(readOtpContext());
  const [showSetPasswordForm, setShowSetPasswordForm] = useState(false);
  const hasInitializedDeviceBindingRef = useRef(false);
  const hasInitializedForgotPasswordRef = useRef(false);
  const lastAutoSubmittedRef = useRef('');

  const passwordMethods = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit: handlePasswordSubmit, control: passwordControl } = passwordMethods;

  const getTfaTypeMutation = useGetTfaType();
  const generateOtpMutation = useGenerateOtp();
  const verifyOtpMutation = useVerifyOtp();
  const bindDeviceMutation = useBindDevice();
  const setNewPasswordMutation = useSetNewPassword();
  const getTfaType = getTfaTypeMutation.mutateAsync;
  const generateOtp = generateOtpMutation.mutateAsync;

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    onSetPasswordStepChange?.(showSetPasswordForm);
  }, [onSetPasswordStepChange, showSetPasswordForm]);

  useEffect(() => {
    if (mode !== 'device-binding') return;
    if (hasInitializedDeviceBindingRef.current) return;

    const initDeviceBinding = async () => {
      try {
        hasInitializedDeviceBindingRef.current = true;
        const identifierValue = 'DEFAULT101';
        const accessToken = getAccessToken();
        const authToken = accessToken || otpContext?.authToken;

        const tfaTypeRes = await getTfaType({
          featureCode: 'DEVICE_BINDING',
          identifierValue,
          userType: 1,
          authToken,
        });

        const generateOtpRes = await generateOtp({
          payload: {
            globalFeatureCode: 'DEVICE_BINDING',
            identifierValue,
            notificationOptionCode: 'EMAIL-101',
            tfaTypeCode: tfaTypeRes.data.tfaTypeCode,
            userType: 1,
          },
          authToken,
        });

        const ctx: OtpFlowContext = {
          flowType: 'DEVICE_BINDING',
          globalFeatureCode: 'DEVICE_BINDING',
          identifierValue,
          notificationOptionCode: 'EMAIL-101',
          tfaTypeCode: tfaTypeRes.data.tfaTypeCode,
          sessionId: generateOtpRes.data.tokenSessionId,
          otpValidityInMinute: generateOtpRes.data.otpValidityInMinute,
          userType: 1,
          authToken,
        };
        writeOtpContext(ctx);
        setOtpContext(ctx);
      } catch (error: any) {
        hasInitializedDeviceBindingRef.current = false;
        setErrorMsg(formatErrorMessage(error));
      }
    };

    initDeviceBinding();
  }, [mode, otpContext?.authToken, getTfaType, generateOtp]);

  useEffect(() => {
    if (mode !== 'verify-otp') return;
    if (hasInitializedForgotPasswordRef.current) return;
    if (!otpContext || otpContext.flowType !== 'FORGOT_PASSWORD') return;
    if (otpContext.sessionId && otpContext.tfaTypeCode) return;

    const initForgotPasswordTfa = async () => {
      try {
        hasInitializedForgotPasswordRef.current = true;
        const tfaTypeRes = await getTfaType({
          featureCode: 'GF_RESET_PASSWORD',
          identifierValue: otpContext.identifierValue,
          userType: otpContext.userType,
          authToken: otpContext.authToken,
        });

        const generateOtpRes = await generateOtp({
          payload: {
            globalFeatureCode: 'GF_RESET_PASSWORD',
            identifierValue: otpContext.identifierValue,
            notificationOptionCode: otpContext.notificationOptionCode,
            tfaTypeCode: tfaTypeRes.data.tfaTypeCode,
            userType: otpContext.userType,
          },
          authToken: otpContext.authToken,
        });

        const nextContext: OtpFlowContext = {
          ...otpContext,
          tfaTypeCode: tfaTypeRes.data.tfaTypeCode,
          sessionId: generateOtpRes.data.tokenSessionId,
          otpValidityInMinute: generateOtpRes.data.otpValidityInMinute,
        };
        setOtpContext(nextContext);
        writeOtpContext(nextContext);
      } catch (error: any) {
        hasInitializedForgotPasswordRef.current = false;
        setErrorMsg(formatErrorMessage(error));
      }
    };

    initForgotPasswordTfa();
  }, [mode, otpContext, otpContext?.authToken, otpContext?.flowType, otpContext?.sessionId, otpContext?.tfaTypeCode, getTfaType, generateOtp]);

  const handleInputChange = (index: number, value: string) => {
    const numValue = value.replace(/[^0-9]/g, '');
    const newOtpValues = [...otpValues];
    newOtpValues[index] = numValue.slice(-1);
    setOtpValues(newOtpValues);
    if (numValue && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    const newOtpValues = [...otpValues];
    for (let i = 0; i < 6; i += 1) {
      newOtpValues[i] = pastedData[i] || '';
    }
    setOtpValues(newOtpValues);
    const nextEmptyIndex = newOtpValues.findIndex((val) => val === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs[focusIndex].current?.focus();
  };

  const verifyOtpCode = useCallback(
    async (otp: string) => {
      setErrorMsg('');
      if (otp.length !== 6) return;
      if (!otpContext) {
        setErrorMsg('OTP session not found. Please start the flow again.');
        return;
      }
      if (!otpContext.sessionId || !otpContext.tfaTypeCode) {
        setErrorMsg('OTP session is still preparing. Please try again in a moment.');
        return;
      }

      try {
        const verifyRes = await verifyOtpMutation.mutateAsync({
          payload: {
            globalFeatureCode: otpContext.globalFeatureCode,
            identifierValue: otpContext.identifierValue,
            passcode: otp,
            sessionId: otpContext.sessionId,
            tfaTypeCode: otpContext.tfaTypeCode,
            userType: otpContext.userType,
          },
          authToken: otpContext.authToken,
        });

        if (verifyRes.data.verified) {
          enqueueSnackbar(verifyRes.responseMessage, { variant: 'success' });
          if (otpContext.flowType === 'DEVICE_BINDING') {
            const bindResponse = await bindDeviceMutation.mutateAsync({
              payload: {
                deviceRequest: buildDeviceRequestPayload(),
                globalFeatureCode: 'DEVICE_BINDING',
                identifierValue: otpContext.identifierValue,
                sessionId: otpContext.sessionId,
              },
              authToken: otpContext.authToken || getAccessToken(),
            });

            const isBindingSuccess =
              bindResponse.responseCode === 'S100000' || bindResponse.success === true;
            if (!isBindingSuccess) {
              setErrorMsg(bindResponse.responseMessage || 'Device binding failed');
              return;
            }

            enqueueSnackbar(bindResponse.responseMessage, { variant: 'success' });
            sessionStorage.setItem(DEVICE_BINDING_VERIFIED_KEY, 'true');
            localStorage.setItem(LOGIN_AFTER_DEVICE_BINDING_KEY, 'true');
            sessionStorage.removeItem(OTP_FLOW_CONTEXT_KEY);
            router.push(paths.dashboard.root);
            return;
          }
          setShowSetPasswordForm(true);
          return;
        }

        setErrorMsg(verifyRes.responseMessage || 'OTP verification failed');
      } catch (error: any) {
        setErrorMsg(formatErrorMessage(error));
      }
    },
    [bindDeviceMutation, enqueueSnackbar, otpContext, router, verifyOtpMutation]
  );

  useEffect(() => {
    if (showSetPasswordForm) return;
    const otp = otpValues.join('');
    if (otp.length < 6) {
      lastAutoSubmittedRef.current = '';
      return;
    }
    if (verifyOtpMutation.isPending || bindDeviceMutation.isPending) return;
    const sessionKey = otpContext?.sessionId || 'no-session';
    const submitKey = `${sessionKey}:${otp}`;
    if (lastAutoSubmittedRef.current === submitKey) return;

    lastAutoSubmittedRef.current = submitKey;
    verifyOtpCode(otp);
  }, [
    bindDeviceMutation.isPending,
    otpValues,
    otpContext?.sessionId,
    showSetPasswordForm,
    verifyOtpCode,
    verifyOtpMutation.isPending,
  ]);

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg('');
    const otp = otpValues.join('');
    if (otp.length !== 6) {
      setErrorMsg('OTP must be 6 digits');
      return;
    }
    await verifyOtpCode(otp);
  };

  const handleResendCode = async () => {
    if (!otpContext) return;
    if (!otpContext.tfaTypeCode) {
      setErrorMsg('TFA is not ready yet. Please wait.');
      return;
    }
    try {
      const generateOtpRes = await generateOtpMutation.mutateAsync({
        payload: {
          globalFeatureCode: otpContext.globalFeatureCode,
          identifierValue: otpContext.identifierValue,
          notificationOptionCode: otpContext.notificationOptionCode,
          tfaTypeCode: otpContext.tfaTypeCode,
          userType: otpContext.userType,
        },
        authToken: otpContext.authToken,
      });
      const nextContext: OtpFlowContext = {
        ...otpContext,
        sessionId: generateOtpRes.data.tokenSessionId,
        otpValidityInMinute: generateOtpRes.data.otpValidityInMinute,
      };
      setOtpContext(nextContext);
      writeOtpContext(nextContext);
      enqueueSnackbar(generateOtpRes.responseMessage, { variant: 'success' });
    } catch (error: any) {
      setErrorMsg(formatErrorMessage(error));
    }
  };

  const handleSetPasswordSubmit = async (data: { newPassword: string; confirmPassword: string }) => {
    setErrorMsg('');
    if (!data.newPassword || !data.confirmPassword) {
      setErrorMsg('Both password fields are required');
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      setErrorMsg('Password and Confirm Password must match');
      return;
    }
    if (!otpContext?.sessionId) {
      setErrorMsg('Session token not found. Please verify OTP again.');
      return;
    }

    try {
      const response = await setNewPasswordMutation.mutateAsync({
        token: otpContext.sessionId,
        password: data.newPassword,
      });
      enqueueSnackbar(response.message || 'Password updated successfully', { variant: 'success' });
      sessionStorage.removeItem(OTP_FLOW_CONTEXT_KEY);
      router.push(paths.auth.login);
    } catch (error: any) {
      setErrorMsg(formatErrorMessage(error));
    }
  };

  return (
    <>
      {!!errorMsg && typeof errorMsg !== 'object' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {!showSetPasswordForm ? (
        <form onSubmit={handleVerifyOtp}>
          <Stack spacing={2.5} sx={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', mb: 2 }}>
              {otpValues.map((value, index) => (
                <TextField
                  key={index}
                  inputRef={inputRefs[index]}
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  variant="outlined"
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '18px',
                      fontWeight: 600,
                    },
                  }}
                  sx={{
                    width: '48px',
                    height: '48px',
                    '& .MuiOutlinedInput-root': {
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      border: '1px solid #B8BBBE',
                      boxSizing: 'border-box',
                      animation: verifyOtpMutation.isPending ? 'otp-pulse 0.9s ease-in-out infinite' : 'none',
                      '@keyframes otp-pulse': {
                        '0%': { borderColor: '#B8BBBE', boxShadow: '0 0 0 0 rgba(3, 188, 0, 0.24)' },
                        '50%': { borderColor: '#03BC00', boxShadow: '0 0 0 4px rgba(3, 188, 0, 0.12)' },
                        '100%': { borderColor: '#B8BBBE', boxShadow: '0 0 0 0 rgba(3, 188, 0, 0)' },
                      },
                      '& fieldset': { border: 'none' },
                      '&:hover': { border: '1px solid #B8BBBE' },
                      '&.Mui-focused': { border: '1px solid #03BC00' },
                    },
                    '& .MuiInputBase-input': {
                      width: '48px',
                      height: '48px',
                      padding: '0',
                      boxSizing: 'border-box',
                    },
                  }}
                />
              ))}
            </Box>

            {(verifyOtpMutation.isPending || bindDeviceMutation.isPending) && (
              <Typography sx={{ fontSize: '13px', color: '#667085', mt: -1.25 }}>
                {bindDeviceMutation.isPending ? 'Binding device...' : 'Verifying OTP...'}
              </Typography>
            )}

            <Box sx={{ textAlign: 'left', mt: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '16px',
                  color: '#191B1E',
                  fontWeight: 500,
                  display: 'inline',
                }}
              >
                Didn&apos;t get the code?{' '}
              </Typography>
              <Link
                component="button"
                variant="body2"
                onClick={handleResendCode}
                sx={{
                  fontSize: '14px',
                  color: '#03BC00',
                  fontWeight: 500,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#03A000',
                    textDecoration: 'none',
                  },
                }}
              >
                Resend code
              </Link>
            </Box>

          </Stack>
        </form>
      ) : (
        <FormProvider methods={passwordMethods} onSubmit={handlePasswordSubmit(handleSetPasswordSubmit)}>
          <Stack spacing={2.5} sx={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#191B1E',
                lineHeight: 1.2,
              }}
            >
              Set Password
            </Typography>

            <Box
              sx={{
                border: '1px solid #EAECF0',
                borderRadius: '12px',
                p: 2.2,
              }}
            >
              <Stack spacing={1.5}>
                <CustomInput
                  name="newPassword"
                  control={passwordControl}
                  label="New Password"
                  placeholder="Enter your new password"
                  type={newPassword.value ? 'text' : 'password'}
                  endIcon={newPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  onEndIconClick={newPassword.onToggle}
                />

                <CustomInput
                  name="confirmPassword"
                  control={passwordControl}
                  label="Confirm Password"
                  placeholder="Enter your password"
                  type={confirmPassword.value ? 'text' : 'password'}
                  endIcon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  onEndIconClick={confirmPassword.onToggle}
                />

                <Box
                  sx={{
                    borderRadius: '8px',
                    border: '1px solid #BFDBFE',
                    bgcolor: '#EFF6FF',
                    p: 1.3,
                  }}
                >
                  <Typography sx={{ fontSize: 11, color: '#1570EF', fontWeight: 700, mb: 0.3 }}>
                    Password Requirements:
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: '#1570EF', lineHeight: 1.5 }}>
                    At least 8 characters long
                    <br />
                    Different from your old password
                    <br />
                    Combine letters, numbers, and special characters
                    <br />
                    for better security
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={setNewPasswordMutation.isPending}
              sx={{
                width: '100%',
                height: 48,
                borderRadius: '12px',
                backgroundColor: '#03BC00',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#03A000' },
              }}
            >
              Submit
            </LoadingButton>
          </Stack>
        </FormProvider>
      )}
    </>
  );
}

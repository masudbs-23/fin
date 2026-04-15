import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CustomInput } from 'src/components/custom-input';
import FormProvider from 'src/components/hook-form';
import { useSendForgotPasswordEmail } from 'src/query/hooks/auth/forgot-password';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { OtpFlowContext, OTP_FLOW_CONTEXT_KEY } from 'src/types/auth-flow';
import { formatErrorMessage } from 'src/utils/format-error-message';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const forgotPasswordMutation = useSendForgotPasswordEmail();
  const [errorMsg, setErrorMsg] = useState<any>('');
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const forgotPasswordRes = await forgotPasswordMutation.mutateAsync({
        email: data.email,
      });

      if (forgotPasswordRes.responseCode === 'S100000') {
        const otpContext: OtpFlowContext = {
          flowType: 'FORGOT_PASSWORD',
          email: data.email,
          globalFeatureCode: 'GF_RESET_PASSWORD',
          identifierValue: 'DEFAULT101',
          notificationOptionCode: 'EMAIL-101',
          userType: 1,
          authToken: forgotPasswordRes.data.token,
        };
        sessionStorage.setItem(OTP_FLOW_CONTEXT_KEY, JSON.stringify(otpContext));
        setDialogMessage(forgotPasswordRes.responseMessage);
        setIsSuccessDialogOpen(true);
        return;
      }

      setErrorMsg(forgotPasswordRes.responseMessage);
    } catch (error: any) {
      setErrorMsg(formatErrorMessage(error));
    }
  });

  const handleDialogClose = () => {
    setIsSuccessDialogOpen(false);
    router.push(paths.auth.verifyOtp);
  };

  const renderForm = (
    <Stack spacing={3.5} sx={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
      <CustomInput
        name="email"
        control={methods.control}
        label="Email Address"
        placeholder="Test@gmail.com"
        icon="solar:letter-bold"
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || forgotPasswordMutation.isPending}
        disabled={isSubmitting || forgotPasswordMutation.isPending}
        sx={{
          width: '100%',
          height: 48,
          borderRadius: '12px',
          backgroundColor: '#03BC00',
          color: 'white',
          fontSize: '16px',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#03A000',
          },
          '&:disabled': {
            backgroundColor: '#E5E7EB',
            color: '#9CA3AF',
          },
        }}
      >
        Continue
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {!!errorMsg && typeof errorMsg !== 'object' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>{renderForm}</Box>
      </FormProvider>

      <Dialog
        open={isSuccessDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="forgot-password-success-title"
        sx={{
          '& .MuiDialog-paper': {
            width: '408px',
            maxWidth: '408px',
            minHeight: '152px',
            borderRadius: '16px',
          },
        }}
      >
        <DialogContent
          sx={{
            px: 3,
            pt: 3.5,
            pb: 1.5,
          }}
        >
          <Typography
            id="forgot-password-success-title"
            sx={{
              textAlign: 'center',
              color: '#191B1E',
              fontSize: '18px',
              lineHeight: 1.4,
              fontWeight: 600,
            }}
          >
            {dialogMessage || 'Temporary Password has been sent to the email address'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', px: 3, pb: 3, pt: 0 }}>
          <LoadingButton
            onClick={handleDialogClose}
            variant="contained"
            type="button"
            sx={{
              width: '170px',
              height: '48px',
              borderRadius: '12px',
              border: '1px solid #03BC00',
              backgroundColor: '#03BC00',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#03A000',
              },
            }}
          >
            Ok
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

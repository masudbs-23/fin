import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AlertMessage from 'src/components/alert-message';
import FormProvider from 'src/components/hook-form';
import { CustomInput } from 'src/components/custom-input';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { useChangePassword } from 'src/query/hooks/profile/profile';
import {
  ChangePasswordSchema,
  getChangePasswordDefaultValues,
  type ChangePasswordFormValues,
} from 'src/sections/profile/change-password/schema/index';
import { formatErrorMessage } from 'src/utils/format-error-message';

export default function ChangePasswordForm() {
  const { enqueueSnackbar } = useSnackbar();

  const [errorMsg, setErrorMsg] = useState<string | string[] | null>(null);

  const changePasswordMutation = useChangePassword();

  const currentPassword = useBoolean();
  const newPassword = useBoolean();
  const confirmPassword = useBoolean();

  const defaultValues = getChangePasswordDefaultValues();

  const methods = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      setErrorMsg(null);

      const response = await changePasswordMutation.mutateAsync({
        old_password: data.old_password,
        new_password: data.new_password,
      });

      enqueueSnackbar(response.message);
      reset();
    } catch (error: any) {
      const errorMessage = formatErrorMessage(error?.message);
      setErrorMsg(errorMessage);
      console.error('Error in change password submission:', error);
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <Box sx={{
      width: { xs: '100%', sm: '90%', md: '370px' },
      maxWidth: '370px',
    }}>
      <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#191B1E', mb: 2 }}>Change Password</Typography>

      <Box sx={{
        borderRadius: '16px',
        p: 3,
        bgcolor: '#FFFFFF',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E5E7EB'
      }}>
        {!!errorMsg && <AlertMessage severity="error" message={errorMsg} />}

        <FormProvider methods={methods} onSubmit={handleFormSubmit}>
          <Stack spacing={2.5} alignItems="stretch" sx={{ width: '100%' }}>
          <CustomInput
            name="old_password"
            control={methods.control}
            label="Old Password"
            placeholder="Enter your old password"
            type={currentPassword.value ? 'text' : 'password'}
            endIcon={currentPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
            onEndIconClick={currentPassword.onToggle}
          />

          <CustomInput
            name="new_password"
            control={methods.control}
            label="New Password"
            placeholder="Enter your new password"
            type={newPassword.value ? 'text' : 'password'}
            endIcon={newPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
            onEndIconClick={newPassword.onToggle}
          />

          <CustomInput
            name="confirmPassword"
            control={methods.control}
            label="Confirm Password"
            placeholder="Confirm your new password"
            type={confirmPassword.value ? 'text' : 'password'}
            endIcon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
            onEndIconClick={confirmPassword.onToggle}
          />

          <Box
            sx={{
              width: '320px',
              height: '116px',
              borderRadius: '14px',
              border: '0.74px solid #BFDBFE',
              bgcolor: '#BFDBFE',
              p: 2,
            }}
          >
            <Typography sx={{ color: '#F0F9FF', fontWeight: 600, mb: 1, fontSize: '14px' }}>Password Requirements:</Typography>
            <Typography sx={{ color: '#F0F9FF', fontWeight: 400, fontSize: '12px', mb: 0.5 }}>• At least 8 characters long</Typography>
            <Typography sx={{ color: '#F0F9FF', fontWeight: 400, fontSize: '12px', mb: 0.5 }}>• Different from your old password</Typography>
            <Typography sx={{ color: '#F0F9FF', fontWeight: 400, fontSize: '12px' }}>
              • Combine letters, numbers, and special characters
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <LoadingButton
              size="large"
              type="button"
              variant="contained"
              onClick={() => reset()}
              sx={{
                width: '152px',
                height: '48px',
                borderRadius: '12px',
                bgcolor: '#A3EBB1',
                border: '1px solid #A3EBB1',
                color: '#010002',
                fontWeight: 500,
                '&:hover': { bgcolor: '#8FDAA2' },
              }}
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting || changePasswordMutation.isPending}
              disabled={isSubmitting || changePasswordMutation.isPending}
              sx={{
                width: '152px',
                height: '48px',
                borderRadius: '12px',
                bgcolor: '#03BC00',
                color: 'white',
                fontWeight: 500,
                '&:hover': { bgcolor: '#03A000' },
              }}
            >
              Update Password
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
      </Box>
    </Box>
  );
}

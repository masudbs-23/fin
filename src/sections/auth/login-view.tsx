import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

// import { paths } from 'src/routes/paths';
// import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN, PROJECT_NAME } from 'src/config-global';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import AuthLogoSvg from 'src/assets/auth/Auth_Logo.svg';
import { CustomInput } from 'src/components/custom-input';
// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState<any>('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      sessionStorage.removeItem('deviceBindingVerified');
      const loginSubmitRes: any = await login?.(data.email, data.password);
      const accountStatus = Number(loginSubmitRes?.data?.accountStatus);

      if (loginSubmitRes?.responseCode?.startsWith('S') && accountStatus === 11) {
        router.push(paths.auth.deviceBinding);
        return;
      }

      if (loginSubmitRes?.responseCode?.startsWith('S') && accountStatus === 1) {
        router.push(returnTo || PATH_AFTER_LOGIN);
        return;
      }

      setErrorMsg(
        loginSubmitRes?.responseMessage || 'Your account is not eligible to access dashboard right now.'
      );
    } catch (error) {
      if (typeof error.message === 'object') {
        const errorKeys = Object.keys(error?.message!) as any;
        errorKeys.forEach((key: any) => {
          setError(key, { message: error?.message![key] });
        });
      } else {
        setErrorMsg(error?.message!);
      }
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5, width: '100%', minWidth: 0 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
          fontWeight: 700,
          color: '#191B1E',
          lineHeight: 1.2,
          wordBreak: 'break-word',
        }}
      >
        Welcome to Monifly
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          fontSize: '14px',
          fontWeight: 400,
          color: '#737A86'
        }}
      >
        Hello there, sign in to continue
      </Typography>
    </Stack>
  );

  const renderLogo = (
    <Box
      component="img"
      alt="auth logo"
      src={AuthLogoSvg}
      sx={{
        width: '100%',
        maxWidth: { xs: 280, sm: 324 },
        height: 'auto',
        aspectRatio: '324 / 80',
        mb: 4,
      }}
    />
  );

  const renderForm = (
    <Stack spacing={3.5} sx={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
      <CustomInput
        name="email"
        control={methods.control}
        label="Email Address"
        placeholder="Test@gmail.com"
        icon="solar:letter-bold"
      />

      <CustomInput
        name="password"
        control={methods.control}
        label="Password"
        placeholder="Enter your password"
        type={password.value ? 'text' : 'password'}
        icon="solar:lock-password-bold"
        endIcon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
        onEndIconClick={password.onToggle}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
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
        Sign in
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.forgotPassword}
        underline="none"
        sx={{
          alignSelf: 'center',
          mt: 0.5,
          color: '#03BC00',
          fontSize: '16px',
          fontWeight: 'medium',
          textDecoration: 'none',
          border: 'none',
          '&:hover': {
            color: '#03A000',
            textDecoration: 'none',
            backgroundColor: 'transparent',
          },
        }}
      >
        Forgot password?
      </Link>
    </Stack>
  );

  return (
    <>
      {renderLogo}

      {renderHead}

      {/* <Alert severity="info" sx={{ mb: 3 }}>
        Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
      </Alert> */}

      {!!errorMsg && typeof errorMsg !== 'object' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>{renderForm}</Box>
      </FormProvider>
    </>
  );
}

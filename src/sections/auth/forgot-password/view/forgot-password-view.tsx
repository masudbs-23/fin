import Stack from '@mui/material/Stack';
import {
  ForgotPasswordForm,
  ForgotPasswordHeader,
} from 'src/sections/auth/forgot-password/components';

export default function ForgotPasswordView() {
  return (
    <>
      <ForgotPasswordHeader />

      <ForgotPasswordForm />
    </>
  );
}

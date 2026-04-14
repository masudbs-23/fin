import Box from '@mui/material/Box';
import { ChangePasswordForm } from 'src/sections/profile/change-password/components';

export default function ChangePasswordView() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', px: { xs: 1.5, md: 2.5 }, py: { xs: 1.5, md: 2 } }}>
      <ChangePasswordForm />
    </Box>
  );
}

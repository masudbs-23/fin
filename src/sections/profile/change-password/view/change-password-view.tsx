import Box from '@mui/material/Box';
import { ChangePasswordForm } from 'src/sections/profile/change-password/components';

export default function ChangePasswordView() {
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: { xs: 2, md: 6.5 } }}>
      <Box sx={{ width: '100%', maxWidth: 1177, display: 'flex', justifyContent: 'center', px: { xs: 1, md: 0 } }}>
        <ChangePasswordForm />
      </Box>
    </Box>
  );
}

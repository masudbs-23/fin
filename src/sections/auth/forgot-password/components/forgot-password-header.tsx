import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AuthLogoSvg from 'src/assets/auth/Auth_Logo.svg';

export default function ForgotPasswordHeader() {
  return (
    <>
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

      <Stack spacing={1.5} sx={{ mb: 5, width: '100%', minWidth: 0 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontSize: '36px',
            fontWeight: 700,
            color: '#191B1E',
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}
        >
          Forgot Password
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '14px',
            fontWeight: 400,
            color: '#737A86'
          }}
        >
          Enter your email address to get temporary password
        </Typography>
      </Stack>
    </>
  );
}

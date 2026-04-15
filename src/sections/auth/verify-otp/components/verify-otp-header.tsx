import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AuthLogoSvg from 'src/assets/auth/Auth_Logo.svg';
import PhoneSvg from 'src/assets/auth/Phone.svg';

type Props = {
  mode?: 'verify-otp' | 'device-binding';
  onLogoClick?: () => void;
};

export default function VerifyOtpHeader({ mode = 'verify-otp', onLogoClick }: Props) {
  const title = 'Enter Code'
  const subtitle =
    mode === 'device-binding'
      ? 'Enter the OTP sent to your registered email to bind this device'
      : 'An OTP is sent to this email test***@gmail.com';

  return (
    <>
      <Box
        component="img"
        alt="auth logo"
        src={AuthLogoSvg}
        onClick={onLogoClick}
        sx={{
          width: '100%',
          maxWidth: { xs: 280, sm: 324 },
          height: 'auto',
          aspectRatio: '324 / 80',
          mb: 4,
          cursor: onLogoClick ? 'pointer' : 'default',
        }}
      />

      <Stack spacing={1.5} sx={{ mb: 5, width: '100%', minWidth: 0, alignItems: 'flex-start' }}>
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
          {title}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '14px',
            fontWeight: 400,
            color: '#737A86'
          }}
        >
          {subtitle}
        </Typography>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box
          component="img"
          alt="phone"
          src={PhoneSvg}
          sx={{
            width: '100px',
            height: '100px',
          }}
        />
      </Box>
    </>
  );
}

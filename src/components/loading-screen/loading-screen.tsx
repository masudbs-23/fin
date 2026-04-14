import Box, { BoxProps } from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import AuthLogoSvg from 'src/assets/auth/Auth_Logo.svg';

// ----------------------------------------------------------------------

export default function LoadingScreen({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={{
        px: 5,
        width: 1,
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ width: 1, maxWidth: 360 }}>
        <Box
          component="img"
          src={AuthLogoSvg}
          alt="Monifly logo"
          sx={{
            width: '100%',
            maxWidth: 211,
            height: 52,
            objectFit: 'contain',
            display: 'block',
            mx: 'auto',
            mb: 2,
          }}
        />
        <LinearProgress
          color="inherit"
          sx={{
            width: 1,
            height: 6,
            borderRadius: 999,
            backgroundColor: '#D9F7DE',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#03BC00',
            },
          }}
        />
      </Box>
    </Box>
  );
}

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import Logo from 'src/components/logo';
import AUthSvg from 'src/assets/auth/AUth.svg';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack
      width={{ xs: '100%', md: '50%' }}
      height="100vh"
      alignItems="center"
      justifyContent="center"
      spacing={3.5}
      sx={{
        px: { xs: 2, md: 14 },
        py: { xs: 4, md: 8 },
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          width: { xs: '91.666667%', md: '100%' },
          maxWidth: { md: 390 },
          minWidth: 0,
          mx: 'auto',
        }}
      >
        {children}
      </Box>
    </Stack>
  );

  const renderSection = (
    <Stack
      width="50%"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        component="img"
        src={AUthSvg}
        alt="auth"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {renderLogo}

      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}

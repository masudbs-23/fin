import Box, { BoxProps } from '@mui/material/Box';

import { useResponsive } from 'src/hooks/use-responsive';

import { HEADER, NAV } from '../config-layout';

// ----------------------------------------------------------------------

export default function Main({ children, sx, ...other }: BoxProps) {
  const lgUp = useResponsive('up', 'lg');

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: `calc(100vh - ${HEADER.H_DESKTOP}px)`,
        display: 'flex',
        flexDirection: 'column',
        px: { xs: 1.5, md: 2.5 },
        py: { xs: 1.5, md: 2 },
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL}px)`,
        }),
        backgroundColor: '#FFFFFF',
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';

import { usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { NavSectionVertical } from 'src/components/nav-section';
import Scrollbar from 'src/components/scrollbar';

import { HEADER, NAV } from '../config-layout';
import { useNavData } from './config-navigation';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 2,
        },
        '& .simplebar-mask': {
          zIndex: 'inherit',
          overflow: 'auto !important',
        },
        '& .simplebar-content-wrapper': {
          height: '100%',
          overflow: 'auto !important',
        },
      }}
    >
      <NavSectionVertical
        data={navData}
        slotProps={{
          gap: 6,
          rootItem: {
            minHeight: 44,
            borderRadius: '10px',
            color: '#E9FFF3',
            '& .icon': {
              color: '#E9FFF3',
            },
            '& .label': {
              color: '#E9FFF3',
              fontWeight: 500,
              textTransform: 'none',
            },
            '&.active, &.Mui-selected': {
              backgroundColor: '#024B2E',
              color: '#FFFFFF',
              '& .icon': {
                color: '#FFFFFF',
              },
              '& .label': {
                color: '#FFFFFF',
                fontWeight: 600,
              },
            },
            '&:hover': {
              backgroundColor: '#024B2E',
            },
          },
          subheader: {
            display: 'none',
          },
        }}
      />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      {lgUp ? (
        <Stack
          sx={{
            top: HEADER.H_DESKTOP,
            height: `calc(100vh - ${HEADER.H_DESKTOP}px)`,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: 'none',
            boxShadow: 'none',
            backgroundColor: '#00311E',
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
              backgroundColor: '#00311E',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

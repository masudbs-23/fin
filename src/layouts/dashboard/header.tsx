import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { alpha, useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import SvgColor from 'src/components/svg-color';
import Iconify from 'src/components/iconify';
import AuthLogoSvg from 'src/assets/auth/Auth_Logo.svg';
import { HEADER } from 'src/layouts/config-layout';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      <Box
        component="img"
        src={AuthLogoSvg}
        alt="Monifly logo"
        sx={{
          width: '211px',
          height: '52px',
          objectFit: 'contain',
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={2.5}>
        <Button
          variant="contained"
          sx={{
            width: 182,
            height: 44,
            px: 2,
            borderRadius: '12px',
            backgroundColor: '#A3EBB1',
            color: '#101828',
            fontSize: 16,
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              backgroundColor: '#94E4A4',
            },
          }}
        >
          Create Transfer
        </Button>

        <Button
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={14} />}
          sx={{
            width: 135,
            height: 44,
            pl: 1.5,
            pr: 1,
            minWidth: 0,
            borderRadius: '12px',
            border: '0.74px solid #BBF7D0',
            backgroundColor: '#F0FDF4',
            color: '#166534',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#ECFDF3',
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: '#16A34A',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="solar:user-bold" width={14} />
            </Box>
            <Box component="span" sx={{ fontSize: 12.8, fontWeight: 600, lineHeight: '19.2px' }}>
              Joh Doe
            </Box>
          </Stack>
        </Button>

        <IconButton
          sx={{
            width: 24,
            height: 24,
            p: 0,
            borderRadius: 0,
          }}
        >
          <Badge color="error" variant="dot">
            <Iconify icon="solar:bell-linear" width={24} />
          </Badge>
        </IconButton>
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        background: '#FFFFFF',
        boxShadow: `0 1px 0 ${alpha('#0B1A2B', 0.08)}`,
        ...(lgUp && {
          width: 1,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { xs: 2, md: 3, lg: 5.5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

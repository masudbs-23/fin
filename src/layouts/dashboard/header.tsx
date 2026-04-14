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
import AccountPopover from 'src/layouts/common/account-popover';
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

      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Button
          variant="contained"
          sx={{
            height: 40,
            px: 2.5,
            borderRadius: '10px',
            backgroundColor: '#9DEFA6',
            color: '#0E1E2A',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              backgroundColor: '#8BE897',
            },
          }}
        >
          Create Transfer
        </Button>

        <AccountPopover />

        <IconButton
          sx={{
            width: 40,
            height: 40,
            border: '1px solid #E6EEF8',
            borderRadius: '10px',
          }}
        >
          <Badge color="error" variant="dot">
            <Iconify icon="solar:bell-linear" width={20} />
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
          px: { xs: 2, md: 3, lg: 3.5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

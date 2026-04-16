import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { useState, MouseEvent } from 'react';
import Popover from '@mui/material/Popover';
import { useNavigate } from 'react-router-dom';

import { useResponsive } from 'src/hooks/use-responsive';

import SvgColor from 'src/components/svg-color';
import Iconify from 'src/components/iconify';
import AuthLogoSvg from 'src/assets/auth/Auth_Logo.svg';
import NotificationIcon from 'src/assets/dashbaord/Notifications.svg';
import { HEADER } from 'src/layouts/config-layout';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();

  const lgUp = useResponsive('up', 'lg');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleProfileMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileDetailsClick = () => {
    navigate('/profile/details');
    handleProfileMenuClose();
  };

  const isMenuOpen = Boolean(anchorEl);

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
            width: '182px',
            height: '44px',
            padding: '15px 20px',
            borderRadius: '12px',
            backgroundColor: '#A3EBB1',
            color: '#010002',
            fontSize: '16px',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: 'none',
            gap: '10px',
            whiteSpace: 'nowrap',
            '&:hover': {
              boxShadow: 'none',
              backgroundColor: '#94E4A4',
            },
          }}
        >
          Create Transfer
        </Button>

        <Button
          onClick={handleProfileMenuOpen}
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

        <Popover
          open={isMenuOpen}
          anchorEl={anchorEl}
          onClose={handleProfileMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              width: 200,
              borderRadius: '12px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
              border: '1px solid #E5E7EB',
              mt: 1,
            },
          }}
        >
          <Box sx={{ py: 1 }}>
            {/* User Name Section */}
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#010002' }}>
                John Doe
              </Typography>
            </Box>
            
            {/* Divider */}
            <Box sx={{ px: 2, my: 0.5 }}>
              <Box sx={{ height: '1px', bgcolor: '#E5E7EB' }} />
            </Box>
            
            {/* Menu Items */}
            <MenuItem
              onClick={handleProfileDetailsClick}
              sx={{
                px: 2,
                py: 1.5,
                fontSize: 14,
                color: '#010002',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Iconify icon="solar:user-bold" width={18} sx={{ color: '#6B7280' }} />
                <Box>Profile Details</Box>
              </Stack>
            </MenuItem>
            
            <MenuItem
              onClick={handleProfileMenuClose}
              sx={{
                px: 2,
                py: 1.5,
                fontSize: 14,
                color: '#010002',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Iconify icon="solar:lock-keyhole-bold" width={18} sx={{ color: '#6B7280' }} />
                <Box>Change Password</Box>
              </Stack>
            </MenuItem>
            
            <MenuItem
              onClick={handleProfileMenuClose}
              sx={{
                px: 2,
                py: 1.5,
                fontSize: 14,
                color: '#010002',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Iconify icon="solar:logout-2-bold" width={18} sx={{ color: '#6B7280' }} />
                <Box>Logout</Box>
              </Stack>
            </MenuItem>
          </Box>
        </Popover>

        <IconButton
          sx={{
            width: 24,
            height: 24,
            p: 0,
            borderRadius: 0,
          }}
        >
          <Badge color="error" >
            <Box
              component="img"
              src={NotificationIcon}
              sx={{
                width: 24,
                height: 24,
              }}
            />
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

import { m } from 'framer-motion';

import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function AccountPopover() {
  const router = useRouter();
  const { user } = useAuthContext();

  const queryClient = useQueryClient();

  // For display purposes: use profile set in AuthProvider (initialize -> /me)
  const firstName = (user?.firstName || '').trim();
  const lastName = (user?.lastName || '').trim();
  const displayName = (user?.displayName || '').trim();

  const userFullName =
    [firstName, lastName].filter(Boolean).join(' ').trim() ||
    displayName ||
    (user && user.name ? `${user.name}` : 'John Dee');

  const userEmail = (user?.email as string) || (user && (user.email as string)) || '';

  const { logout } = useAuthContext();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.clear(); // Invalidate all React Query caches after logout
      popover.onClose();
      router.push(paths.auth.login);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMenuNavigate = (path: string) => {
    popover.onClose();
    router.push(path);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

        <ButtonBase
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.02)}
          onClick={popover.onOpen}
          sx={{ 
            borderRadius: '12px', 
            px: 0.5,
            width: '135px',
            height: '44px',
            border: '0.74px solid #BBF7D0',
            backgroundColor: '#BBF7D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#191B1E' }}>{userFullName}</Typography>
          <KeyboardArrowDownRoundedIcon sx={{ color: '#98A2B3' }} />
        </ButtonBase>
      </Box>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 280, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle1" noWrap fontWeight="bold">
            {userFullName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userEmail}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />

        
        <MenuItem
          onClick={() => handleMenuNavigate(paths.profile.details)}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: '#010002' }}
        >
          <ListItemIcon>
            <PersonOutlineRoundedIcon fontSize="small" sx={{ color: '#010002' }} />
          </ListItemIcon>
          Profile Details
        </MenuItem>

        <MenuItem
          onClick={() => handleMenuNavigate(paths.profile.changePassword)}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: '#010002' }}
        >
          <ListItemIcon>
            <LockOutlinedIcon fontSize="small" sx={{ color: '#010002' }} />
          </ListItemIcon>
          Change Password
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" color="error" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
}

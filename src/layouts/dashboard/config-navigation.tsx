import { useMemo } from 'react';
import { paths } from 'src/routes/paths';

import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';

const ICONS = {
  dashboard: <DashboardIcon />,
  customer: <GroupOutlinedIcon />,
  createTransfer: <SendOutlinedIcon />,
  recipient: <PersonOutlineOutlinedIcon />,
  transactions: <SyncAltOutlinedIcon />,
  commission: <PaidOutlinedIcon />,
};

export function useNavData() {
  const data = useMemo(() => {
    const navItems = [];

    navItems.push({
      subheader: '',
      icon: ICONS.dashboard,
      serial: 1,
      items: [
        {
          title: 'Dashboard',
          path: paths.dashboard.root,
          icon: ICONS.dashboard,
          serial: 1,
        },
        {
          title: 'Customer',
          path: paths.customers.root,
          icon: ICONS.customer,
          serial: 2,
        },
        {
          title: 'Create Transfer',
          path: paths.transfers.root,
          icon: ICONS.createTransfer,
          serial: 3,
        },
        {
          title: 'Recipient',
          path: paths.recipients.root,
          icon: ICONS.recipient,
          serial: 4,
        },
        {
          title: 'Transactions',
          path: paths.transactions.root,
          icon: ICONS.transactions,
          serial: 5,
        },
        {
          title: 'Commission',
          path: paths.commissions.root,
          icon: ICONS.commission,
          serial: 6,
        },
      ],
    });

    return navItems;
  }, []);

  return data;
}

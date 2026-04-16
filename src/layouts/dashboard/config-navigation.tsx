import { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import Box from '@mui/material/Box';

import DashboardIcon from 'src/assets/sidebar/Dashboard.svg';
import CustomerIcon from 'src/assets/sidebar/Customer.svg';
import CreateTransferIcon from 'src/assets/sidebar/Create_Transfer.svg';
import TransactionsIcon from 'src/assets/sidebar/Transactions.svg';
import CommissionIcon from 'src/assets/sidebar/Commissions.svg';
import RecipientIcon from 'src/assets/sidebar/Recipient.svg';

const ICONS = {
  dashboard: <Box component="img" src={DashboardIcon} sx={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }} />,
  customer: <Box component="img" src={CustomerIcon} sx={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }} />,
  createTransfer: <Box component="img" src={CreateTransferIcon} sx={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }} />,
  recipient: <Box component="img" src={RecipientIcon} sx={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }} />,
  transactions: <Box component="img" src={TransactionsIcon} sx={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }} />,
  commission: <Box component="img" src={CommissionIcon} sx={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }} />,
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

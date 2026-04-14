import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import {
  Box,
  Chip,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useGetCreateTransferList } from 'src/query/hooks/create-transfer';

const PAYOUT_TYPES = ['Bank', 'Cash Pickup', 'Wallet'];

const getKycColor = (status: string) =>
  status === 'Verified'
    ? { bg: '#B9E8C9', text: '#137A3A' }
    : { bg: '#F5E9B5', text: '#9D7A00' };

export default function CreateTransferListView() {
  const [filters, setFilters] = useState({
    customerMobileNumber: '',
    recipientMobileNumber: '',
    payoutType: '',
  });

  const { data } = useGetCreateTransferList(filters);

  const rows = useMemo(() => {
    const list = data?.data?.list || [];
    return list.filter((row) => {
      const customerMobileMatch = filters.customerMobileNumber
        ? row.mobileNumber.toLowerCase().includes(filters.customerMobileNumber.toLowerCase())
        : true;
      const recipientMobileMatch = filters.recipientMobileNumber
        ? row.mobileNumber.toLowerCase().includes(filters.recipientMobileNumber.toLowerCase())
        : true;
      return customerMobileMatch && recipientMobileMatch;
    });
  }, [data?.data?.list, filters.customerMobileNumber, filters.recipientMobileNumber]);

  return (
    <Container maxWidth="xl">
      <Stack spacing={2.5}>
        <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#191B1E' }}>Create New Transfer</Typography>

        <Grid container spacing={1.5} alignItems="end">
          <Grid item xs={12} md={3}>
            <Typography sx={{ mb: 0.75, fontSize: 14, color: '#6B7280' }}>Customer Mobile Number</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter mobile number"
              value={filters.customerMobileNumber}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  customerMobileNumber: event.target.value,
                }))
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography sx={{ mb: 0.75, fontSize: 14, color: '#6B7280' }}>Recipient Mobile Number</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter NID number"
              value={filters.recipientMobileNumber}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  recipientMobileNumber: event.target.value,
                }))
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography sx={{ mb: 0.75, fontSize: 14, color: '#6B7280' }}>Payout Type</Typography>
            <TextField
              fullWidth
              select
              size="small"
              value={filters.payoutType}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  payoutType: event.target.value,
                }))
              }
            >
              <MenuItem value="">Choose</MenuItem>
              {PAYOUT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Typography sx={{ mt: 0.5, fontSize: 30, fontWeight: 700, color: '#191B1E' }}>Customer List</Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer Code</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Mobile Number</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>KYC Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const kycColor = getKycColor(row.kycStatus);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Chip label={row.customerCode} sx={{ bgcolor: '#E4F5E8', color: '#166534', fontWeight: 700 }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.customerName}</TableCell>
                    <TableCell>{row.mobileNumber}</TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>
                      <Chip label={row.kycStatus} sx={{ bgcolor: kycColor.bg, color: kycColor.text, fontWeight: 700 }} />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: '#9BE6A8',
                          color: '#14532D',
                          borderRadius: '10px',
                          '&:hover': { bgcolor: '#8AD596' },
                        }}
                      >
                        <SendOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Stack>
    </Container>
  );
}

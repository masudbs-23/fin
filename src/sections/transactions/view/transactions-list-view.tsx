import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { useGetTransactionDetails, useGetTransactionList } from 'src/query/hooks/transaction';

const STATUS_OPTIONS = ['All Status', 'Success', 'Pending', 'Failed'];
const PAYOUT_TYPES = ['All Types', 'Bank Transfer', 'Cash Pickup', 'Wallet'];

const getStatusColor = (status: string) => {
  if (status === 'Success') return { bg: '#B9E8C9', text: '#137A3A' };
  if (status === 'Pending') return { bg: '#F5E9B5', text: '#9D7A00' };
  return { bg: '#F9D8DA', text: '#D92D20' };
};

export default function TransactionsListView() {
  const [filters, setFilters] = useState({
    date: '',
    status: 'All Status',
    payoutType: 'All Types',
    customerMobileNumber: '',
    recipientMobileNumber: '',
  });
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: transactionListResponse } = useGetTransactionList(filters);
  const { data: transactionDetails } = useGetTransactionDetails(selectedTransactionId || undefined, isDialogOpen);

  const rows = useMemo(() => {
    const list = transactionListResponse?.data?.list || [];
    return list.filter((row) => {
      const customerMatch = filters.customerMobileNumber
        ? row.customerMobile.toLowerCase().includes(filters.customerMobileNumber.toLowerCase())
        : true;
      const recipientMatch = filters.recipientMobileNumber
        ? row.recipientMobile.toLowerCase().includes(filters.recipientMobileNumber.toLowerCase())
        : true;
      const statusMatch = filters.status === 'All Status' ? true : row.status === filters.status;
      const payoutMatch = filters.payoutType === 'All Types' ? true : row.payoutMethod === filters.payoutType;
      return customerMatch && recipientMatch && statusMatch && payoutMatch;
    });
  }, [filters, transactionListResponse?.data?.list]);

  return (
    <Container maxWidth="xl">
      <Stack spacing={2.5}>
        <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#191B1E' }}>Transactions</Typography>

        <Grid container spacing={1.5} alignItems="end">
          <Grid item xs={12} md={3}>
            <Typography sx={{ mb: 0.75, fontSize: 14, color: '#6B7280' }}>Date</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="dd/mm/yyyy"
              value={filters.date}
              onChange={(event) => setFilters((prev) => ({ ...prev, date: event.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography sx={{ mb: 0.75, fontSize: 14, color: '#6B7280' }}>Status</Typography>
            <TextField
              fullWidth
              select
              size="small"
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography sx={{ mb: 0.75, fontSize: 14, color: '#6B7280' }}>Payout Type</Typography>
            <TextField
              fullWidth
              select
              size="small"
              value={filters.payoutType}
              onChange={(event) => setFilters((prev) => ({ ...prev, payoutType: event.target.value }))}
            >
              {PAYOUT_TYPES.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ bgcolor: '#03BC00', color: '#fff', '&:hover': { bgcolor: '#02A900' } }}>
                <SearchIcon />
              </IconButton>
              <IconButton sx={{ bgcolor: '#03BC00', color: '#fff', '&:hover': { bgcolor: '#02A900' } }}>
                <DownloadIcon />
              </IconButton>
            </Stack>
          </Grid>
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
        </Grid>

        <Typography sx={{ mt: 0.5, fontSize: 30, fontWeight: 700, color: '#191B1E' }}>Transaction List</Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Customer Mobile</TableCell>
                <TableCell>Recipient Mobile</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Exchange Rate</TableCell>
                <TableCell>Payout Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const statusColor = getStatusColor(row.status);
                return (
                  <TableRow key={row.id}>
                    <TableCell sx={{ color: '#14532D', fontWeight: 700 }}>{row.transactionId}</TableCell>
                    <TableCell>{row.dateTime}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.customerMobile}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.recipientMobile}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.amount}</TableCell>
                    <TableCell>{row.exchangeRate}</TableCell>
                    <TableCell>{row.payoutMethod}</TableCell>
                    <TableCell>
                      <Chip label={row.status} sx={{ bgcolor: statusColor.bg, color: statusColor.text, fontWeight: 700 }} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                        onClick={() => {
                          setSelectedTransactionId(row.transactionId);
                          setIsDialogOpen(true);
                        }}
                        sx={{
                          bgcolor: '#9BE6A8',
                          color: '#14532D',
                          borderRadius: '10px',
                          px: 1.5,
                          '&:hover': { bgcolor: '#8AD596' },
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Stack>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontSize: 36, fontWeight: 700 }}>Transaction Details</DialogTitle>
        <DialogContent>
          <Stack spacing={2.25}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={6}>
                <Stack>
                  <Typography sx={{ color: '#6B7280' }}>Date & Time</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{transactionDetails?.dateTime || '-'}</Typography>
                </Stack>
                <Stack>
                  <Typography sx={{ color: '#6B7280' }}>Transaction ID</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#03BC00' }}>
                    {transactionDetails?.transactionId || '-'}
                  </Typography>
                </Stack>
              </Stack>
              {transactionDetails?.status && (
                <Chip
                  label={transactionDetails.status}
                  sx={{
                    bgcolor: getStatusColor(transactionDetails.status).bg,
                    color: getStatusColor(transactionDetails.status).text,
                    fontWeight: 700,
                  }}
                />
              )}
            </Stack>

            <Grid container spacing={2} sx={{ bgcolor: '#EAF4EE', borderRadius: 2, p: 2 }}>
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: '#6B7280' }}>Customer Name & Mobile</Typography>
                <Typography sx={{ fontWeight: 700 }}>{transactionDetails?.customerName || '-'}</Typography>
                <Typography sx={{ color: '#6B7280' }}>{transactionDetails?.customerMobile || '-'}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: '#6B7280' }}>Recipient Name & Mobile</Typography>
                <Typography sx={{ fontWeight: 700 }}>{transactionDetails?.recipientName || '-'}</Typography>
                <Typography sx={{ color: '#6B7280' }}>{transactionDetails?.recipientMobile || '-'}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: '#6B7280' }}>Transaction Amount</Typography>
                <Typography sx={{ fontWeight: 700 }}>{transactionDetails?.transactionAmount || '-'}</Typography>
              </Grid>
            </Grid>

            <Stack>
              <Typography sx={{ color: '#6B7280' }}>Payout Method</Typography>
              <Chip
                label={transactionDetails?.payoutMethod || '-'}
                sx={{ bgcolor: '#B9E8C9', color: '#137A3A', fontWeight: 700, width: 'fit-content' }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setIsDialogOpen(false)}
            sx={{ height: 46, px: 7, borderRadius: '12px', bgcolor: '#9BE6A8', color: '#14532D' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

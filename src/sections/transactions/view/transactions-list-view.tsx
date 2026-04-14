import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
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

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      height: 44,
      borderRadius: '8px',
      bgcolor: '#FFFFFF',
      '& fieldset': { borderColor: '#D0D5DD' },
      '&:hover fieldset': { borderColor: '#D0D5DD' },
      '&.Mui-focused fieldset': { borderColor: '#03BC00' },
    },
    '& .MuiInputBase-input': {
      fontSize: 14,
      color: '#667085',
    },
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 1, md: 2 }, pt: 0.5 }}>
      <Stack spacing={2.5}>
        <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#191B1E', lineHeight: 1.2 }}>
          Transactions
        </Typography>

        <Stack spacing={2.5}>
          <Grid container spacing={2} alignItems="end">
            <Grid item xs={12} md={3}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>Date</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="dd/mm/yyyy"
                value={filters.date}
                onChange={(event) => setFilters((prev) => ({ ...prev, date: event.target.value }))}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>Status</Typography>
              <TextField
                fullWidth
                select
                size="small"
                value={filters.status}
                onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
                SelectProps={{ IconComponent: KeyboardArrowDownRoundedIcon }}
                sx={inputSx}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>Payout Type</Typography>
              <TextField
                fullWidth
                select
                size="small"
                value={filters.payoutType}
                onChange={(event) => setFilters((prev) => ({ ...prev, payoutType: event.target.value }))}
                SelectProps={{ IconComponent: KeyboardArrowDownRoundedIcon }}
                sx={inputSx}
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
                <IconButton
                  sx={{
                    width: 44,
                    height: 40,
                    borderRadius: '12px',
                    bgcolor: '#03BC00',
                    color: '#FFFFFF',
                    '&:hover': { bgcolor: '#02A900' },
                  }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
                <IconButton
                  sx={{
                    width: 48,
                    height: 40,
                    borderRadius: '12px',
                    bgcolor: '#03BC00',
                    color: '#FFFFFF',
                    '&:hover': { bgcolor: '#02A900' },
                  }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>
                Customer Mobile Number
              </Typography>
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
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>
                Recipient Mobile Number
              </Typography>
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
                sx={inputSx}
              />
            </Grid>
          </Grid>
        </Stack>

        <Box
          sx={{
            height: 38,
            display: 'flex',
            alignItems: 'center',
            px: 0.75,
            borderRadius: '10px',
            bgcolor: '#FFFFFF',
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#191B1E' }}>Transaction List</Typography>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 1120 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Transaction ID</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Date & Time</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Customer Mobile</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Recipient Mobile</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Amount</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Exchange Rate</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Payout Method</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Status</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const statusColor = getStatusColor(row.status);
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      '& td': {
                        borderBottom: '0.74px solid #EAECF0',
                        py: 1.6,
                        fontSize: 14,
                        color: '#344054',
                      },
                    }}
                  >
                    <TableCell sx={{ color: '#14532D !important', fontWeight: 600 }}>
                      {row.transactionId}
                    </TableCell>
                    <TableCell>{row.dateTime}</TableCell>
                    <TableCell sx={{ color: '#101828 !important' }}>{row.customerMobile}</TableCell>
                    <TableCell sx={{ color: '#101828 !important' }}>{row.recipientMobile}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.exchangeRate}</TableCell>
                    <TableCell>{row.payoutMethod}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        sx={{
                          bgcolor: statusColor.bg,
                          color: statusColor.text,
                          fontWeight: 500,
                          borderRadius: '999px',
                        }}
                      />
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
                          height: 34,
                          px: 1.6,
                          bgcolor: '#9BE6A8',
                          color: '#14532D',
                          borderRadius: '10px',
                          fontWeight: 500,
                          textTransform: 'none',
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

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: 711,
            maxWidth: 'calc(100% - 32px)',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ px: 2.5, pt: 2.25, pb: 0.5, fontSize: 18, fontWeight: 500, color: '#101828' }}>
          Transaction Details
        </DialogTitle>
        <DialogContent sx={{ px: 2.5, py: 2 }}>
          <Stack spacing={2.25}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={6}>
                <Stack spacing={0.3}>
                  <Typography sx={{ color: '#667085', fontSize: 12 }}>Date & Time</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#101828' }}>
                    {transactionDetails?.dateTime || '-'}
                  </Typography>
                </Stack>
                <Stack spacing={0.3}>
                  <Typography sx={{ color: '#667085', fontSize: 12 }}>Transaction ID</Typography>
                  <Typography sx={{ fontSize: 19, fontWeight: 500, color: '#03BC00' }}>
                    {transactionDetails?.transactionId || '-'}
                  </Typography>
                </Stack>
              </Stack>
              {transactionDetails?.status && (
                <Chip
                  label={transactionDetails.status}
                  sx={{
                    height: 37,
                    px: 1.1,
                    bgcolor: getStatusColor(transactionDetails.status).bg,
                    color: getStatusColor(transactionDetails.status).text,
                    borderRadius: '999px',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                />
              )}
            </Stack>

            <Grid container spacing={2} sx={{ bgcolor: '#ECFDF3', borderRadius: '14px', p: 2 }}>
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: '#667085', fontSize: 12 }}>Customer Name & Mobile</Typography>
                <Typography sx={{ mt: 0.5, fontSize: 16, fontWeight: 500, color: '#101828' }}>
                  {transactionDetails?.customerName || '-'}
                </Typography>
                <Typography sx={{ mt: 0.4, color: '#667085', fontSize: 14 }}>
                  {transactionDetails?.customerMobile || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: '#667085', fontSize: 12 }}>Recipient Name & Mobile</Typography>
                <Typography sx={{ mt: 0.5, fontSize: 16, fontWeight: 500, color: '#101828' }}>
                  {transactionDetails?.recipientName || '-'}
                </Typography>
                <Typography sx={{ mt: 0.4, color: '#667085', fontSize: 14 }}>
                  {transactionDetails?.recipientMobile || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: '#667085', fontSize: 12 }}>Transaction Amount</Typography>
                <Typography sx={{ mt: 0.6, fontSize: 18, fontWeight: 500, color: '#101828' }}>
                  {transactionDetails?.transactionAmount || '-'}
                </Typography>
              </Grid>
            </Grid>

            <Stack spacing={0.75}>
              <Typography sx={{ color: '#667085', fontSize: 12 }}>Payout Method</Typography>
              <Chip
                label={transactionDetails?.payoutMethod || '-'}
                sx={{
                  width: 'fit-content',
                  px: 1.2,
                  height: 33,
                  bgcolor: '#DCFCE7',
                  color: '#166534',
                  borderRadius: '10px',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2.5 }}>
          <Button
            onClick={() => setIsDialogOpen(false)}
            sx={{
              width: 152,
              height: 48,
              borderRadius: '12px',
              bgcolor: '#A3EBB1',
              color: '#101828',
              fontSize: 16,
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#94E4A4' },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

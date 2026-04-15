import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import {
  Box,
  Button,
  Chip,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
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
    width: { xs: '100%', sm: '200px', md: '288px', lg: '288px', xl: '288px' },
    '& .MuiOutlinedInput-root': {
      height: 40,
      borderRadius: '8px',
      bgcolor: '#FFFFFF',
      '& fieldset': { 
        borderColor: '#D5D7DA',
        borderWidth: '1px'
      },
      '&:hover fieldset': { 
        borderColor: '#D5D7DA',
        borderWidth: '1px'
      },
      '&.Mui-focused fieldset': { 
        borderColor: '#03BC00',
        borderWidth: '1px'
      },
    },
    '& .MuiInputBase-input': {
      fontSize: 14,
      color: '#010002',
      height: 40,
      py: 0,
      paddingLeft: '14px',
      boxSizing: 'border-box',
      textAlign: 'left',
    },
    '& .MuiSelect-select': {
      textAlign: 'left',
      paddingLeft: '14px !important',
      display: 'flex',
      alignItems: 'center',
    },
  };

  return (
    <>
      <Stack spacing={2.5}>
        <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#191B1E', lineHeight: 1.2 }}>
          Transactions
        </Typography>

        <Box sx={{ width: { xs: '100%', md: '1097px' }, height: '167px', overflowX: 'auto' }}>
          <Stack spacing="20px" sx={{ height: '100%' }}>
            {/* First Row: Date, Status, Payout Type, Search/Download */}
            <Box sx={{ display: 'flex', gap: '20px', alignItems: 'end' }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ mb: { xs: 0.5, sm: 0.75 }, fontSize: { xs: 14, sm: 16 }, color: '#667085' }}>Date</Typography>
                <DatePicker
                  value={filters.date ? dayjs(filters.date) : null}
                  onChange={(date) =>
                    setFilters((prev) => ({
                      ...prev,
                      date: date && dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : '',
                    }))
                  }
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      placeholder: 'dd/mm/yyyy',
                      sx: inputSx,
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ mb: { xs: 0.5, sm: 0.75 }, fontSize: { xs: 14, sm: 16 }, color: '#667085' }}>Status</Typography>
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
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ mb: { xs: 0.5, sm: 0.75 }, fontSize: { xs: 14, sm: 16 }, color: '#667085' }}>Payout Type</Typography>
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
              </Box>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'flex-start', sm: 'flex-start' } }}>
                  <IconButton
                    sx={{
                      width: { xs: 40, sm: 44 },
                      height: { xs: 36, sm: 40 },
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
                      width: { xs: 40, sm: 44 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: '12px',
                      bgcolor: '#03BC00',
                      color: '#FFFFFF',
                      '&:hover': { bgcolor: '#02A900' },
                    }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Box>

            {/* Second Row: Customer Mobile Number, Recipient Mobile Number */}
            <Box sx={{ display: 'flex', gap: '20px', alignItems: 'end', justifyContent: 'flex-start' }}>
              <Box sx={{ width: '288px' }}>
                <Typography sx={{ mb: { xs: 0.5, sm: 0.75 }, fontSize: { xs: 14, sm: 16 }, color: '#667085' }}>
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
              </Box>
              <Box sx={{ width: '288px' }}>
                <Typography sx={{ mb: { xs: 0.5, sm: 0.75 }, fontSize: { xs: 14, sm: 16 }, color: '#667085' }}>
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
              </Box>
            </Box>
          </Stack>
        </Box>

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
          <Typography sx={{ fontSize: '16px !important', fontWeight: 500, color: '#010002' }}>Transaction List</Typography>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: { xs: 700, sm: 900, md: 1120, lg: 1120, xl: 1120 } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 11, sm: 12, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Transaction ID</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 11, sm: 12, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Date & Time</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 11, sm: 12, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Customer Mobile</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 11, sm: 12, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Recipient Mobile</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 11, sm: 12, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Amount</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 11, sm: 12, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Exchange Rate</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 11, sm: 12, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Payout Method</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 11, sm: 12, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Status</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 11, sm: 12, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Action</TableCell>
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
                    <TableCell
                      sx={{
                        color: '#00311E !important',
                        fontWeight: 600,
                        fontSize: { xs: '10px', sm: '11px', md: '12.48px' },
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.transactionId}
                    </TableCell>
                    <TableCell sx={{ color: '#374151', fontSize: { xs: 10, sm: 11, md: 13.6 }, fontWeight: 400, whiteSpace: 'nowrap' }}>{row.dateTime}</TableCell>
                    <TableCell sx={{ color: '#010002 !important', fontSize: { xs: 10, sm: 11, md: 13.6 }, fontWeight: 400, whiteSpace: 'nowrap' }}>{row.customerMobile}</TableCell>
                    <TableCell sx={{ color: '#010002 !important', fontSize: { xs: 10, sm: 11, md: 13.6 }, fontWeight: 400, whiteSpace: 'nowrap' }}>{row.recipientMobile}</TableCell>
                    <TableCell sx={{ color: '#374151', fontSize: { xs: 10, sm: 11, md: 13.6 }, fontWeight: 400, whiteSpace: 'nowrap' }}>{row.amount}</TableCell>
                    <TableCell sx={{ color: '#374151', fontSize: { xs: 10, sm: 11, md: 13.6 }, fontWeight: 400, whiteSpace: 'nowrap' }}>{row.exchangeRate}</TableCell>
                    <TableCell sx={{ color: '#374151', fontSize: { xs: 10, sm: 11, md: 13.6 }, fontWeight: 400, whiteSpace: 'nowrap' }}>{row.payoutMethod}</TableCell>
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
                          height: { xs: 28, sm: 32, md: 34 },
                          px: { xs: 1, sm: 1.3, md: 1.6 },
                          bgcolor: '#9BE6A8',
                          color: '#14532D',
                          borderRadius: '10px',
                          fontWeight: 500,
                          fontSize: { xs: 11, sm: 12, md: 14 },
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
    </>
  );
}

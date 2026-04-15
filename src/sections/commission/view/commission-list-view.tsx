import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import {
  Box,
  Container,
  Grid,
  IconButton,
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
import { useGetCommissionList } from 'src/query/hooks/commission';
import { CommissionListItem } from 'src/types/commission';

const MOCK_COMMISSION_ROWS: CommissionListItem[] = [
  {
    id: '1',
    transactionId: 'TXN-10421',
    dateTime: '1985-06-20',
    amount: '1,000',
    customerName: 'Ahmed Hassan',
    customerMobile: '+201012345678',
    totalCommission: '76.00',
  },
  {
    id: '2',
    transactionId: 'TXN-10421',
    dateTime: '1985-06-20',
    amount: '40,000',
    customerName: 'Ahmed Hassan',
    customerMobile: '+201012345678',
    totalCommission: '67.00',
  },
  {
    id: '3',
    transactionId: 'TXN-10421',
    dateTime: '1985-06-20',
    amount: '40,000',
    customerName: 'Ahmed Hassan',
    customerMobile: '+201012345678',
    totalCommission: '6.50',
  },
  {
    id: '4',
    transactionId: 'TXN-10421',
    dateTime: '1985-06-20',
    amount: '40,000',
    customerName: 'Ahmed Hassan',
    customerMobile: '+201012345678',
    totalCommission: '99.00',
  },
  {
    id: '5',
    transactionId: 'TXN-10421',
    dateTime: '1985-06-20',
    amount: '37,000',
    customerName: 'Ahmed Hassan',
    customerMobile: '+201012345678',
    totalCommission: '54.99',
  },
  {
    id: '6',
    transactionId: 'TXN-10421',
    dateTime: '1985-06-20',
    amount: '2,000',
    customerName: 'Ahmed Hassan',
    customerMobile: '+201012345678',
    totalCommission: '11.45',
  },
];

export default function CommissionListView() {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    customerMobileNumber: '',
  });

  // Keep hook ready for API integration; UI currently renders mock rows by design.
  const { data: commissionListResponse } = useGetCommissionList(filters, false);

  const inputSx = {
    width: '288px',
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
  };

  const rows = useMemo(() => {
    const apiRows = commissionListResponse?.data?.list || [];
    const list = MOCK_COMMISSION_ROWS.length ? MOCK_COMMISSION_ROWS : apiRows;
    return list.filter((row) =>
      filters.customerMobileNumber
        ? row.customerMobile.toLowerCase().includes(filters.customerMobileNumber.toLowerCase())
        : true
    );
  }, [commissionListResponse?.data?.list, filters.customerMobileNumber]);

  return (
    <>
      <Stack spacing={2.5}>
        <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#191B1E', lineHeight: 1.2 }}>
          Commission
        </Typography>

        <Grid container spacing={2} alignItems="end">
          <Grid item xs={12} md={3}>
            <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>From Date</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="dd/mm/yyyy"
              value={filters.fromDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, fromDate: event.target.value }))}
              sx={inputSx}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>To Date</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="dd/mm/yyyy"
              value={filters.toDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, toDate: event.target.value }))}
              sx={inputSx}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>Customer Mobile Number</Typography>
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
                <SearchIcon />
              </IconButton>
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
                <DownloadIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

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
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#191B1E' }}>Commission List</Typography>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell sx={{ color: '#191B1E', fontSize: 14, fontWeight: 400 }}>Transaction ID</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: 14, fontWeight: 400 }}>Date & Time</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: 14, fontWeight: 400 }}>Amount</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: 14, fontWeight: 400 }}>Customer Name</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: 14, fontWeight: 400 }}>Customer Mobile</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: 14, fontWeight: 400 }}>Total Commission</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
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
                  <TableCell sx={{ color: '#14532D !important', fontWeight: 600 }}>{row.transactionId}</TableCell>
                  <TableCell>{row.dateTime}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell sx={{ color: '#101828 !important', fontWeight: 500 }}>{row.customerName}</TableCell>
                  <TableCell sx={{ color: '#101828 !important' }}>{row.customerMobile}</TableCell>
                  <TableCell>{row.totalCommission}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Stack>
    </>
  );
}

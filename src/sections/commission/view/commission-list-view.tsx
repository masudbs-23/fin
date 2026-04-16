import SearchIcon from 'src/assets/table/Search.svg';
import ArrowIcon from 'src/assets/table/Arrow.svg';
import {
  Box,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
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

  const { data: commissionListResponse } = useGetCommissionList(filters);

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
      '&:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px #FFFFFF inset',
        WebkitTextFillColor: '#010002',
        backgroundColor: '#FFFFFF !important',
        color: '#010002 !important',
      },
      '&:-webkit-autofill:hover': {
        WebkitBoxShadow: '0 0 0 1000px #FFFFFF inset',
        WebkitTextFillColor: '#010002',
        backgroundColor: '#FFFFFF !important',
        color: '#010002 !important',
      },
      '&:-webkit-autofill:focus': {
        WebkitBoxShadow: '0 0 0 1000px #FFFFFF inset',
        WebkitTextFillColor: '#010002',
        backgroundColor: '#FFFFFF !important',
        color: '#010002 !important',
      },
      '&:-webkit-autofill:active': {
        WebkitBoxShadow: '0 0 0 1000px #FFFFFF inset',
        WebkitTextFillColor: '#010002',
        backgroundColor: '#FFFFFF !important',
        color: '#010002 !important',
      },
    },
  };

  const rows = useMemo(() => {
    const apiRows = commissionListResponse?.data?.list || [];
    const list = apiRows.length ? apiRows : MOCK_COMMISSION_ROWS;
    return list.filter((row) =>
      filters.customerMobileNumber
        ? row.customerMobile.toLowerCase().includes(filters.customerMobileNumber.toLowerCase())
        : true
    );
  }, [commissionListResponse?.data?.list, filters.customerMobileNumber]);

  return (
    <>
      <Stack spacing={2.5}>
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#191B1E', lineHeight: 1.2 }}>
          Commission
        </Typography>

        <Box sx={{ width: { xs: '100%', md: '1097px' }, height: '68px', overflowX: 'auto' }}>
          <Box sx={{ display: 'flex', gap: '20px', alignItems: 'end', height: '100%' }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ mb: { xs: 0.5, sm: 0.75 }, fontSize: 16, fontWeight: 400, color: '#667085' }}>From Date</Typography>
              <DatePicker
                value={filters.fromDate ? dayjs(filters.fromDate) : null}
                onChange={(date) =>
                  setFilters((prev) => ({
                    ...prev,
                    fromDate: date && dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : '',
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
              <Typography sx={{ mb: { xs: 0.5, sm: 0.75 }, fontSize: 16, fontWeight: 400, color: '#667085' }}>To Date</Typography>
              <DatePicker
                value={filters.toDate ? dayjs(filters.toDate) : null}
                onChange={(date) =>
                  setFilters((prev) => ({
                    ...prev,
                    toDate: date && dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : '',
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
              <Typography sx={{ mb: { xs: 0.5, sm: 0.75 }, fontSize: 16, fontWeight: 400, color: '#667085' }}>Customer Mobile Number</Typography>
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
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'flex-start', sm: 'flex-start' } }}>
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
                  <Box
                    component="img"
                    src={SearchIcon}
                    sx={{
                      width: 22,
                      height: 22,
                    }}
                  />
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
                  <Box
                    component="img"
                    src={ArrowIcon}
                    sx={{
                      width: 20,
                      height: 20,
                    }}
                  />
                </IconButton>
              </Stack>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            height: 38,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
            bgcolor: '#FFFFFF',
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#010002' }}>Commission List</Typography>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: { xs: 600, sm: 800, md: 980, lg: 980, xl: 980 } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 12, sm: 13, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Transaction ID</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 12, sm: 13, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Date & Time</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 12, sm: 13, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Amount</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 12, sm: 13, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Customer Name</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 12, sm: 13, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Customer Mobile</TableCell>
                <TableCell sx={{ color: '#191B1E', fontSize: { xs: 12, sm: 13, md: 14 }, fontWeight: 400, whiteSpace: 'nowrap' }}>Total Commission</TableCell>
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
                  <TableCell
                    sx={{
                      color: '#00311E !important',
                      fontWeight: 600,
                      fontSize: { xs: '11px', sm: '11.5px', md: '12.48px' },
                      whiteSpace: 'nowrap',
                    }}
                  >
                      {row.transactionId}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: 11, sm: 12, md: 13.6 }, whiteSpace: 'nowrap' }}>{row.dateTime}</TableCell>
                    <TableCell sx={{ fontSize: { xs: 11, sm: 12, md: 13.6 }, whiteSpace: 'nowrap' }}>{row.amount}</TableCell>
                    <TableCell sx={{ color: '#101828 !important', fontWeight: 500, fontSize: { xs: 11, sm: 12, md: 13.6 }, whiteSpace: 'nowrap' }}>{row.customerName}</TableCell>
                    <TableCell sx={{ color: '#101828 !important', fontSize: { xs: 11, sm: 12, md: 13.6 }, whiteSpace: 'nowrap' }}>{row.customerMobile}</TableCell>
                    <TableCell sx={{ fontSize: { xs: 11, sm: 12, md: 13.6 }, whiteSpace: 'nowrap' }}>{row.totalCommission}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Stack>
    </>
  );
}

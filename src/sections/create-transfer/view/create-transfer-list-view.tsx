import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SearchIcon from 'src/assets/table/Search.svg';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import {
  Box,
  Chip,
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
import { useSearchParams } from 'react-router-dom';
import { useGetCreateTransferList } from 'src/query/hooks/create-transfer';
import { CreateTransferListItem } from 'src/types/create-transfer';

const PAYOUT_TYPES = ['Bank Transfer', 'Mobile Money', 'Cash Pickup'];

const getKycColor = (status: string) =>
  status === 'Verified'
    ? { bg: '#B9E8C9', text: '#137A3A' }
    : { bg: '#F5E9B5', text: '#9D7A00' };

const MOCK_TRANSFER_ROWS: CreateTransferListItem[] = [
  {
    id: '1',
    customerCode: 'C-10421',
    customerName: 'Ahmed Hassan',
    mobileNumber: '+201012345678',
    country: 'Bangladesh',
    kycStatus: 'Verified',
  },
  {
    id: '2',
    customerCode: 'C-10420',
    customerName: 'Fatima Al-Said',
    mobileNumber: '+639171234567',
    country: 'South Africa',
    kycStatus: 'Verified',
  },
  {
    id: '3',
    customerCode: 'C-10419',
    customerName: 'Mohammed Khalid',
    mobileNumber: '(252) 555-0126',
    country: 'Curacao',
    kycStatus: 'Pending',
  },
  {
    id: '4',
    customerCode: 'C-10418',
    customerName: 'Sara Abdullah',
    mobileNumber: '(229) 555-0109',
    country: 'Aland Islands',
    kycStatus: 'Verified',
  },
  {
    id: '5',
    customerCode: 'C-10417',
    customerName: 'Omar Yusuf',
    mobileNumber: '(808) 555-0111',
    country: 'Iceland',
    kycStatus: 'Verified',
  },
  {
    id: '6',
    customerCode: 'C-10416',
    customerName: 'Layla Ibrahim',
    mobileNumber: '(308) 555-0121',
    country: 'Iran',
    kycStatus: 'Verified',
  },
];

export default function CreateTransferListView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilters = {
    customerMobileNumber: searchParams.get('customerMobileNumber') || '',
    recipientMobileNumber: searchParams.get('recipientMobileNumber') || '',
    payoutType: searchParams.get('payoutType') || '',
  };
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  // Keep hook ready for API integration; UI currently renders mock rows by design.
  const { data } = useGetCreateTransferList(appliedFilters, false);

  const rows = useMemo(() => {
    const apiRows = data?.data?.list || [];
    const list = MOCK_TRANSFER_ROWS.length ? MOCK_TRANSFER_ROWS : apiRows;
    return list.filter((row) => {
      const customerMobileMatch = appliedFilters.customerMobileNumber
        ? row.mobileNumber.toLowerCase().includes(appliedFilters.customerMobileNumber.toLowerCase())
        : true;
      const recipientMobileMatch = appliedFilters.recipientMobileNumber
        ? row.mobileNumber.toLowerCase().includes(appliedFilters.recipientMobileNumber.toLowerCase())
        : true;
      return customerMobileMatch && recipientMobileMatch;
    });
  }, [data?.data?.list, appliedFilters.customerMobileNumber, appliedFilters.recipientMobileNumber]);

  const handleSearch = () => {
    setAppliedFilters({ ...filters });

    const params = new URLSearchParams();
    if (filters.customerMobileNumber) params.set('customerMobileNumber', filters.customerMobileNumber);
    if (filters.recipientMobileNumber) params.set('recipientMobileNumber', filters.recipientMobileNumber);
    if (filters.payoutType) params.set('payoutType', filters.payoutType);
    setSearchParams(params, { replace: true });
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      height: 40,
      borderRadius: '8px',
      bgcolor: '#FFFFFF',
      '& fieldset': { borderColor: '#D0D5DD' },
      '&:hover fieldset': { borderColor: '#D0D5DD' },
      '&.Mui-focused fieldset': { borderColor: '#03BC00' },
    },
    '& .MuiInputBase-input': {
      fontSize: 14,
      color: '#010002',
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

  return (
    <>
      <Stack spacing={2.5}>
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#191B1E' }}>Create New Transfer</Typography>

        <Grid container spacing={1} alignItems="end">
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
            <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>Recipient Mobile Number</Typography>
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
          <Grid item xs={12} md={3}>
            <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>Payout Type</Typography>
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
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
                displayEmpty: true,
                renderValue: (selected) =>
                  typeof selected === 'string' && selected ? selected : 'Choose',
              }}
              sx={inputSx}
            >
              <MenuItem value="">Choose</MenuItem>
              {PAYOUT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <IconButton
              onClick={handleSearch}
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
          </Grid>
        </Grid>

        <Box
          sx={{
            height: 16,
            display: 'flex',
            alignItems: 'center',
    
            borderRadius: '10px',
            bgcolor: '#FFFFFF',
            mt: 1,
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#191B1E' }}>Customer List</Typography>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Customer Code</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Customer Name</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Mobile Number</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Country</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>KYC Status</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const kycColor = getKycColor(row.kycStatus);
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
                    <TableCell>
                      <Chip
                        label={row.customerCode}
                        sx={{
                          bgcolor: '#ECFDF3',
                          color: '#166534',
                          fontWeight: 600,
                          borderRadius: '10px',
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#101828 !important', fontWeight: 500 }}>{row.customerName}</TableCell>
                    <TableCell>{row.mobileNumber}</TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.kycStatus}
                        sx={{
                          bgcolor: kycColor.bg,
                          color: kycColor.text,
                          fontWeight: 500,
                          borderRadius: '999px',
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: '#9BE6A8',
                          color: '#14532D',
                          borderRadius: '10px',
                          width: 44,
                          height: 30,
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
    </>
  );
}

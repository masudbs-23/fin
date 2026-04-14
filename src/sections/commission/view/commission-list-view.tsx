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

export default function CommissionListView() {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    customerMobileNumber: '',
  });

  const { data: commissionListResponse } = useGetCommissionList(filters);

  const rows = useMemo(() => {
    const list = commissionListResponse?.data?.list || [];
    return list.filter((row) =>
      filters.customerMobileNumber
        ? row.customerMobile.toLowerCase().includes(filters.customerMobileNumber.toLowerCase())
        : true
    );
  }, [commissionListResponse?.data?.list, filters.customerMobileNumber]);

  return (
    <Container maxWidth="xl">
      <Stack spacing={2.5}>
        <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#191B1E' }}>Commission</Typography>

        <Grid container spacing={1.5} alignItems="end">
          <Grid item xs={12} md={3}>
            <Typography sx={{ mb: 0.75, fontSize: 14, color: '#6B7280' }}>From Date</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="dd/mm/yyyy"
              value={filters.fromDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, fromDate: event.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography sx={{ mb: 0.75, fontSize: 14, color: '#6B7280' }}>To Date</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="dd/mm/yyyy"
              value={filters.toDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, toDate: event.target.value }))}
            />
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
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ bgcolor: '#03BC00', color: '#fff', '&:hover': { bgcolor: '#02A900' } }}>
                <SearchIcon />
              </IconButton>
              <IconButton sx={{ bgcolor: '#03BC00', color: '#fff', '&:hover': { bgcolor: '#02A900' } }}>
                <DownloadIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

        <Typography sx={{ mt: 0.5, fontSize: 30, fontWeight: 700, color: '#191B1E' }}>Commission List</Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Customer Mobile</TableCell>
                <TableCell>Total Commission</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ color: '#14532D', fontWeight: 700 }}>{row.transactionId}</TableCell>
                  <TableCell>{row.dateTime}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{row.customerName}</TableCell>
                  <TableCell>{row.customerMobile}</TableCell>
                  <TableCell>{row.totalCommission}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Stack>
    </Container>
  );
}

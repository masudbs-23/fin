import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
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
import { useEffect, useMemo, useState } from 'react';
import { useGetRecipientList, useUpdateRecipient } from 'src/query/hooks/recipient';
import { RecipientItem, RecipientStatus, UpdateRecipientPayload } from 'src/types/recipient';

const PAYOUT_TYPES = ['Cash Pickup', 'Bank', 'Wallet'];

const getStatusColor = (status: string) =>
  status === 'Active'
    ? { bg: '#B9E8C9', text: '#137A3A' }
    : { bg: '#F5E9B5', text: '#9D7A00' };

export default function RecipientListView() {
  const [filters, setFilters] = useState({
    customerMobileNumber: '',
    recipientMobileNumber: '',
    payoutType: '',
  });
  const [rows, setRows] = useState<RecipientItem[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateRecipientPayload>({
    recipientName: '',
    recipientMobile: '',
    payoutMethod: '',
    country: '',
    status: 'Active',
  });

  const { data } = useGetRecipientList(filters);
  const updateRecipientMutation = useUpdateRecipient();

  useEffect(() => {
    if (data?.data?.list) {
      setRows(data.data.list);
    }
  }, [data]);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const customerMatch = filters.customerMobileNumber
          ? row.customerMobile.toLowerCase().includes(filters.customerMobileNumber.toLowerCase())
          : true;
        const recipientMatch = filters.recipientMobileNumber
          ? row.recipientMobile.toLowerCase().includes(filters.recipientMobileNumber.toLowerCase())
          : true;
        return customerMatch && recipientMatch;
      }),
    [rows, filters.customerMobileNumber, filters.recipientMobileNumber]
  );

  const handleEditClick = (row: RecipientItem) => {
    setSelectedRecipient(row);
    setEditForm({
      recipientName: row.recipientName,
      recipientMobile: row.recipientMobile,
      payoutMethod: row.payoutMethod,
      country: row.country,
      status: row.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedRecipient) return;

    await updateRecipientMutation.mutateAsync({
      recipientId: selectedRecipient.id,
      payload: editForm,
    });

    setRows((prev) =>
      prev.map((row) =>
        row.id === selectedRecipient.id
          ? {
              ...row,
              recipientName: editForm.recipientName,
              recipientMobile: editForm.recipientMobile,
              payoutMethod: editForm.payoutMethod,
              country: editForm.country,
              status: editForm.status,
            }
          : row
      )
    );
    setIsEditDialogOpen(false);
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={2.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#191B1E' }}>Recipient</Typography>
          <Button
            variant="contained"
            sx={{
              borderRadius: '12px',
              px: 4,
              height: 48,
              bgcolor: '#8BDF9A',
              color: '#113D20',
              fontWeight: 700,
              '&:hover': { bgcolor: '#7CD08B' },
            }}
          >
            Add Recipient
          </Button>
        </Stack>

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

        <Typography sx={{ mt: 0.5, fontSize: 30, fontWeight: 700, color: '#191B1E' }}>Recipient List</Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer Code</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Customer Mobile</TableCell>
                <TableCell>Recipient Name</TableCell>
                <TableCell>Recipient Mobile</TableCell>
                <TableCell>Payout Method</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => {
                const statusColor = getStatusColor(row.status);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Chip label={row.customerCode} sx={{ bgcolor: '#E4F5E8', color: '#166534', fontWeight: 700 }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.customerName}</TableCell>
                    <TableCell>{row.customerMobile}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.recipientName}</TableCell>
                    <TableCell>{row.recipientMobile}</TableCell>
                    <TableCell>{row.payoutMethod}</TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>
                      <Chip label={row.status} sx={{ bgcolor: statusColor.bg, color: statusColor.text, fontWeight: 700 }} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<EditIcon fontSize="small" />}
                        onClick={() => handleEditClick(row)}
                        sx={{
                          bgcolor: '#9BE6A8',
                          color: '#14532D',
                          borderRadius: '10px',
                          px: 1.5,
                          '&:hover': { bgcolor: '#8AD596' },
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Stack>

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: 24, fontWeight: 700 }}>Edit Recipient</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Recipient Name</Typography>
              <TextField
                fullWidth
                value={editForm.recipientName}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    recipientName: event.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Recipient Mobile</Typography>
              <TextField
                fullWidth
                value={editForm.recipientMobile}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    recipientMobile: event.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Payout Method</Typography>
              <TextField
                fullWidth
                value={editForm.payoutMethod}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    payoutMethod: event.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Country</Typography>
              <TextField
                fullWidth
                value={editForm.country}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    country: event.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Status</Typography>
              <TextField
                fullWidth
                select
                value={editForm.status}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    status: event.target.value as RecipientStatus,
                  }))
                }
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setIsEditDialogOpen(false)}
            sx={{ height: 44, px: 3, borderRadius: '10px', bgcolor: '#9BE6A8', color: '#14532D' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
            sx={{ height: 44, px: 3, borderRadius: '10px', bgcolor: '#03BC00' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

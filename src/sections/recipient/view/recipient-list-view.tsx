import SearchIcon from 'src/assets/table/Search.svg';
import ArrowIcon from 'src/assets/table/Arrow.svg';
import EditIcon from '@mui/icons-material/Edit';
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
import { useGetRecipientList, useUpdateRecipient } from 'src/query/hooks/recipient';
import { RecipientItem, RecipientStatus, UpdateRecipientPayload } from 'src/types/recipient';

const PAYOUT_TYPES = ['Cash Pickup', 'Bank', 'Wallet'];

const getStatusColor = (status: string) =>
  status === 'Active'
    ? { bg: '#B9E8C9', text: '#137A3A' }
    : { bg: '#F5E9B5', text: '#9D7A00' };

const MOCK_RECIPIENT_ROWS: RecipientItem[] = [
  {
    id: '1',
    customerCode: 'C-10421',
    customerName: 'Ahmed Hassan',
    customerMobile: '+201012345678',
    recipientName: 'Hassan Ali',
    recipientMobile: '+201012345678',
    payoutMethod: 'New Mexico',
    country: 'Bangladesh',
    status: 'Active',
  },
  {
    id: '2',
    customerCode: 'C-10420',
    customerName: 'Fatima Al-Said',
    customerMobile: '+201012345678',
    recipientName: 'Floyd Miles',
    recipientMobile: '+639171234567',
    payoutMethod: 'Brazil',
    country: 'South Africa',
    status: 'Active',
  },
  {
    id: '3',
    customerCode: 'C-10419',
    customerName: 'Mohammed Khalid',
    customerMobile: '+201012345678',
    recipientName: 'Kristin Watson',
    recipientMobile: '(252) 555-0126',
    payoutMethod: 'United States',
    country: 'Curacao',
    status: 'Inactive',
  },
  {
    id: '4',
    customerCode: 'C-10418',
    customerName: 'Sara Abdullah',
    customerMobile: '+201012345678',
    recipientName: 'Cody Fisher',
    recipientMobile: '(229) 555-0109',
    payoutMethod: 'Dhaka',
    country: 'Aland Islands',
    status: 'Active',
  },
  {
    id: '5',
    customerCode: 'C-10417',
    customerName: 'Omar Yusuf',
    customerMobile: '+201012345678',
    recipientName: 'Kathryn Murphy',
    recipientMobile: '(808) 555-0111',
    payoutMethod: 'Montana',
    country: 'Iceland',
    status: 'Active',
  },
  {
    id: '6',
    customerCode: 'C-10416',
    customerName: 'Layla Ibrahim',
    customerMobile: '+201012345678',
    recipientName: 'Jenny Wilson',
    recipientMobile: '(308) 555-0121',
    payoutMethod: 'Washington',
    country: 'Iran',
    status: 'Active',
  },
  {
    id: '7',
    customerCode: 'C-10415',
    customerName: 'Khalid Al-Rashid',
    customerMobile: '+201012345678',
    recipientName: '+9665522334455',
    recipientMobile: '(319) 555-0115',
    payoutMethod: 'New York',
    country: 'Guinea',
    status: 'Active',
  },
];

export default function RecipientListView() {
  const [filters, setFilters] = useState({
    customerMobileNumber: '',
    recipientMobileNumber: '',
    payoutType: '',
  });
  const [rows, setRows] = useState<RecipientItem[]>(MOCK_RECIPIENT_ROWS);
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateRecipientPayload>({
    recipientName: '',
    recipientMobile: '',
    payoutMethod: '',
    country: '',
    status: 'Active',
  });

  // Keep hook ready for API integration; UI currently renders mock rows by design.
  const { data } = useGetRecipientList(filters, false);
  const updateRecipientMutation = useUpdateRecipient();

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
      color: '#667085',
    },
  };

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
    <>
      <Stack spacing={2.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#191B1E' }}>Recipient</Typography>
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
              SelectProps={{ IconComponent: KeyboardArrowDownRoundedIcon }}
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
            <Stack direction="row" spacing={1}>
              <IconButton
                sx={{
                  width: 44,
                  height: 40,
                  borderRadius: '12px',
                  bgcolor: '#03BC00',
                  color: '#fff',
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
                  width: 48,
                  height: 40,
                  borderRadius: '12px',
                  bgcolor: '#03BC00',
                  color: '#fff',
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
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 1,
            height: 22,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
            bgcolor: '#FFFFFF',
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#191B1E' }}>Recipient List</Typography>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 1120 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Customer Code</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Customer Name</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Customer Mobile</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Recipient Name</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Recipient Mobile</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Payout Method</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Country</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Status</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => {
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
                    <TableCell>{row.customerMobile}</TableCell>
                    <TableCell sx={{ color: '#101828 !important', fontWeight: 500 }}>{row.recipientName}</TableCell>
                    <TableCell>{row.recipientMobile}</TableCell>
                    <TableCell>{row.payoutMethod}</TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        sx={{
                          bgcolor: statusColor.bg,
                          color: statusColor.text,
                          fontWeight: 500,
                          borderRadius: '999px',
                          height: 24,
                        }}
                      />
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
                          px: 1.4,
                          height: 34,
                          textTransform: 'none',
                          fontWeight: 500,
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
    </>
  );
}

import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
import { useCreateCustomer, useGetCustomerList, useUpdateCustomer } from 'src/query/hooks/customer';
import { CreateCustomerPayload, Customer, CustomerKycStatus, UpdateCustomerPayload } from 'src/types/customers';

const COUNTRIES = ['Bangladesh', 'United States', 'United Kingdom', 'India', 'Pakistan'];

const getStatusColor = (status: string) => (status === 'Active' ? '#B9E8C9' : '#F9D8DA');
const getStatusTextColor = (status: string) => (status === 'Active' ? '#137A3A' : '#D92D20');
const getEkycColor = (status: string) => {
  if (status === 'Completed') return { bg: '#B9E8C9', text: '#137A3A' };
  if (status === 'In Progress') return { bg: '#F5E9B5', text: '#9D7A00' };
  return { bg: '#F9D8DA', text: '#D92D20' };
};

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    customerCode: 'C-10421',
    fullName: 'Ahmed Hassan',
    phoneNumber: '+9665512345678',
    email: 'ahmed.hassan@email.com',
    dateOfBirth: '1985-06-20',
    status: 'Active',
    ekycStatus: 'Completed',
    country: 'Bangladesh',
    nidNumber: '1234567890123',
    address: 'Dhaka',
  },
  {
    id: '2',
    customerCode: 'C-10420',
    fullName: 'Fatima Al-Said',
    phoneNumber: '+9665598765432',
    email: 'fatima.alsaid@email.com',
    dateOfBirth: '1990-11-14',
    status: 'Active',
    ekycStatus: 'Completed',
    country: 'United States',
    nidNumber: '2234567890123',
    address: 'New York',
  },
  {
    id: '3',
    customerCode: 'C-10419',
    fullName: 'Mohammed Khalid',
    phoneNumber: '+9665511223344',
    email: 'm.khalid@email.com',
    dateOfBirth: '1978-02-28',
    status: 'Inactive',
    ekycStatus: 'In Progress',
    country: 'United Kingdom',
    nidNumber: '3234567890123',
    address: 'London',
  },
  {
    id: '4',
    customerCode: 'C-10418',
    fullName: 'Sara Abdullah',
    phoneNumber: '+9665577665544',
    email: 'sara.ab@email.com',
    dateOfBirth: '1995-09-05',
    status: 'Active',
    ekycStatus: 'Completed',
    country: 'India',
    nidNumber: '4234567890123',
    address: 'Mumbai',
  },
  {
    id: '5',
    customerCode: 'C-10417',
    fullName: 'Omar Yusuf',
    phoneNumber: '+9665533445566',
    email: 'omar.y@email.com',
    dateOfBirth: '1982-12-30',
    status: 'Inactive',
    ekycStatus: 'Failed',
    country: 'Pakistan',
    nidNumber: '5234567890123',
    address: 'Lahore',
  },
  {
    id: '6',
    customerCode: 'C-10416',
    fullName: 'Layla Ibrahim',
    phoneNumber: '+9665544332211',
    email: 'layla.ib@email.com',
    dateOfBirth: '1993-04-17',
    status: 'Active',
    ekycStatus: 'Completed',
    country: 'Bangladesh',
    nidNumber: '6234567890123',
    address: 'Chattogram',
  },
  {
    id: '7',
    customerCode: 'C-10415',
    fullName: 'Khalid Al-Rashid',
    phoneNumber: '+9665522334455',
    email: 'k.rashid@email.com',
    dateOfBirth: '1980-03-11',
    status: 'Active',
    ekycStatus: 'Completed',
    country: 'United States',
    nidNumber: '7234567890123',
    address: 'Chicago',
  },
];

export default function CustomersListView() {
  const [filters, setFilters] = useState({
    mobileNumber: '',
    nidNumber: '',
    country: '',
  });
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateCustomerPayload>({
    fullName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    ekycStatus: 'Completed',
    address: '',
  });
  const [createForm, setCreateForm] = useState<CreateCustomerPayload>({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
  });

  // Keep hook ready for API integration; UI currently renders mock rows by design.
  useGetCustomerList(filters, false);
  const updateCustomerMutation = useUpdateCustomer();
  const createCustomerMutation = useCreateCustomer();

  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) => {
        const mobileMatch = filters.mobileNumber
          ? customer.phoneNumber.toLowerCase().includes(filters.mobileNumber.toLowerCase())
          : true;
        const nidMatch = filters.nidNumber
          ? customer.nidNumber.toLowerCase().includes(filters.nidNumber.toLowerCase())
          : true;
        const countryMatch = filters.country ? customer.country === filters.country : true;
        return mobileMatch && nidMatch && countryMatch;
      }),
    [customers, filters]
  );

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

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      fullName: customer.fullName,
      phoneNumber: customer.phoneNumber,
      email: customer.email,
      dateOfBirth: customer.dateOfBirth,
      ekycStatus: customer.ekycStatus,
      address: customer.address,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedCustomer) return;

    await updateCustomerMutation.mutateAsync({
      customerId: selectedCustomer.id,
      payload: editForm,
    });

    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === selectedCustomer.id ? { ...customer, ...editForm, ekycStatus: editForm.ekycStatus } : customer
      )
    );
    setIsEditDialogOpen(false);
  };

  const handleCreateCustomer = async () => {
    const createdCustomer = await createCustomerMutation.mutateAsync(createForm);
    setCustomers((prev) => [createdCustomer, ...prev]);
    setIsCreateDialogOpen(false);
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 1, md: 2 }, pt: 0.5 }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#191B1E' }}>Customer</Typography>
          <Button
            variant="contained"
            onClick={() => setIsCreateDialogOpen(true)}
            sx={{
              borderRadius: '12px',
              width: 152,
              height: 48,
              bgcolor: '#A3EBB1',
              color: '#101828',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#7CD08B',
              },
            }}
          >
            Create Customer
          </Button>
        </Stack>

        <Box>
          <Grid container spacing={1} alignItems="end">
            <Grid item xs={12} md={3}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>Mobile Number</Typography>
              <TextField
                fullWidth
                placeholder="Enter mobile number"
                size="small"
                value={filters.mobileNumber}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    mobileNumber: event.target.value,
                  }))
                }
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>NID Number</Typography>
              <TextField
                fullWidth
                placeholder="Enter NID number"
                size="small"
                value={filters.nidNumber}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    nidNumber: event.target.value,
                  }))
                }
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#667085' }}>Country</Typography>
              <TextField
                fullWidth
                select
                size="small"
                value={filters.country}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    country: event.target.value,
                  }))
                }
                SelectProps={{ IconComponent: KeyboardArrowDownRoundedIcon }}
                sx={inputSx}
              >
                <MenuItem value="">Choose</MenuItem>
                {COUNTRIES.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
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
                  <SearchIcon />
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
                  <DownloadIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 2.5,
              mb: 1.5,
              height: 51,
              display: 'flex',
              alignItems: 'center',
              px: 0.75,
              borderRadius: '10px',
              bgcolor: '#FFFFFF',
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#191B1E' }}>Customer List</Typography>
          </Box>

          <Table sx={{ minWidth: 1120 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Customer Code</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Name</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Mobile Number</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Email</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Date of Birth</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Status</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>eKYC Status</TableCell>
                <TableCell sx={{ color: '#667085', fontSize: 14, fontWeight: 500 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => {
                const ekycColor = getEkycColor(customer.ekycStatus);
                return (
                  <TableRow
                    key={customer.id}
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
                        label={customer.customerCode}
                        sx={{
                          bgcolor: '#ECFDF3',
                          color: '#166534',
                          fontWeight: 600,
                          borderRadius: '10px',
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#101828 !important', fontWeight: 500 }}>{customer.fullName}</TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.dateOfBirth}</TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status}
                        sx={{
                          bgcolor: getStatusColor(customer.status),
                          color: getStatusTextColor(customer.status),
                          fontWeight: 500,
                          borderRadius: '999px',
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.ekycStatus}
                        sx={{
                          bgcolor: ekycColor.bg,
                          color: ekycColor.text,
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
                        onClick={() => handleEditClick(customer)}
                        sx={{
                          bgcolor: '#9BE6A8',
                          color: '#14532D',
                          borderRadius: '10px',
                          px: 1.4,
                          height: 34,
                          fontWeight: 500,
                          textTransform: 'none',
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

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontSize: 28, fontWeight: 700 }}>Customer</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, fontSize: 20, fontWeight: 600 }}>Edit Customer</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Full Name</Typography>
              <TextField
                fullWidth
                value={editForm.fullName}
                onChange={(event) => setEditForm((prev) => ({ ...prev, fullName: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Phone number</Typography>
              <TextField
                fullWidth
                value={editForm.phoneNumber}
                onChange={(event) => setEditForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Email Address</Typography>
              <TextField
                fullWidth
                value={editForm.email}
                onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Date of Birth</Typography>
              <TextField
                fullWidth
                value={editForm.dateOfBirth}
                onChange={(event) => setEditForm((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>eKYC Status</Typography>
              <TextField
                fullWidth
                select
                value={editForm.ekycStatus}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    ekycStatus: event.target.value as CustomerKycStatus,
                  }))
                }
              >
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Address</Typography>
              <TextField
                fullWidth
                value={editForm.address}
                onChange={(event) => setEditForm((prev) => ({ ...prev, address: event.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setIsEditDialogOpen(false)}
            sx={{ height: 48, px: 4, borderRadius: '12px', bgcolor: '#9BE6A8', color: '#14532D' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
            sx={{ height: 48, px: 4, borderRadius: '12px', bgcolor: '#03BC00' }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontSize: 28, fontWeight: 700 }}>New Customer Registration</DialogTitle>
        <DialogContent>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
            <Stack alignItems="center" spacing={0.5}>
              <CheckCircleIcon sx={{ color: '#03BC00' }} />
              <Typography sx={{ fontSize: 13 }}>Personal Info</Typography>
            </Stack>
            <Box sx={{ flex: 1, height: 2, bgcolor: '#14532D' }} />
            <Stack alignItems="center" spacing={0.5}>
              <CheckCircleIcon sx={{ color: '#14532D' }} />
              <Typography sx={{ fontSize: 13 }}>Contact Info</Typography>
            </Stack>
            <Box sx={{ flex: 1, height: 2, bgcolor: '#14532D' }} />
            <Stack alignItems="center" spacing={0.5}>
              <CheckCircleIcon sx={{ color: '#14532D' }} />
              <Typography sx={{ fontSize: 13 }}>Identification</Typography>
            </Stack>
            <Box sx={{ flex: 1, height: 2, bgcolor: '#14532D' }} />
            <Stack alignItems="center" spacing={0.5}>
              <CloudUploadIcon sx={{ color: '#14532D' }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Documents</Typography>
            </Stack>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>First Name</Typography>
              <TextField
                fullWidth
                placeholder="Enter first name"
                value={createForm.firstName}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, firstName: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Last Name</Typography>
              <TextField
                fullWidth
                placeholder="Enter last name"
                value={createForm.lastName}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, lastName: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Gender</Typography>
              <TextField
                fullWidth
                select
                value={createForm.gender}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, gender: event.target.value }))}
              >
                <MenuItem value="">Choose</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.5, color: '#6B7280' }}>Date of Birth</Typography>
              <TextField
                fullWidth
                placeholder="dd/mm/yyyy"
                value={createForm.dateOfBirth}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setIsCreateDialogOpen(false)}
            sx={{ height: 48, px: 6, borderRadius: '12px', bgcolor: '#9BE6A8', color: '#14532D' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateCustomer}
            sx={{ height: 48, px: 8, borderRadius: '12px', bgcolor: '#03BC00' }}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

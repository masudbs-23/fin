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
import { CreateCustomerPayload, Customer, UpdateCustomerPayload } from 'src/types/customers';

const COUNTRIES = ['Bangladesh', 'United States', 'United Kingdom', 'India', 'Pakistan'];
const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
type CreateStep = 1 | 2 | 3 | 4;
const CREATE_STEP_LABELS: Record<CreateStep, string> = {
  1: 'Personal Info',
  2: 'Contact Info',
  3: 'Identification',
  4: 'Documents',
};

const INITIAL_CREATE_FORM: CreateCustomerPayload = {
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  phoneNumber: '',
  email: '',
  address: '',
  city: '',
  country: '',
  nidNumber: '',
  nationality: '',
  nidDocumentName: '',
  photoDocumentName: '',
};

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
  const [createStep, setCreateStep] = useState<CreateStep>(1);
  const [editForm, setEditForm] = useState<UpdateCustomerPayload>({
    fullName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    ekycStatus: 'Completed',
    address: '',
  });
  const [createForm, setCreateForm] = useState<CreateCustomerPayload>(INITIAL_CREATE_FORM);

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

  const createDialogInputSx = {
    '& .MuiOutlinedInput-root': {
      height: 40,
      borderRadius: '10px',
      bgcolor: '#FFFFFF',
      '& fieldset': { borderColor: '#D0D5DD' },
      '&:hover fieldset': { borderColor: '#D0D5DD' },
      '&.Mui-focused fieldset': { borderColor: '#03BC00' },
    },
    '& .MuiInputBase-input': {
      fontSize: 14,
      color: '#98A2B3',
      px: 1.5,
      py: 1.2,
    },
  };

  const handleCreateFieldChange = (field: keyof CreateCustomerPayload, value: string) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      fullName: customer.fullName,
      phoneNumber: customer.phoneNumber.replace(/^\+88/, ''),
      email: customer.email,
      dateOfBirth: customer.dateOfBirth,
      ekycStatus: customer.ekycStatus,
      address: customer.address,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedCustomer) return;

    const payload: UpdateCustomerPayload = {
      ...editForm,
      phoneNumber: `+88${editForm.phoneNumber.replace(/^\+/, '')}`,
    };

    await updateCustomerMutation.mutateAsync({
      customerId: selectedCustomer.id,
      payload,
    });

    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === selectedCustomer.id ? { ...customer, ...payload, ekycStatus: payload.ekycStatus } : customer
      )
    );
    setIsEditDialogOpen(false);
  };

  const handleEditCancel = () => {
    if (selectedCustomer) {
      setEditForm({
        fullName: selectedCustomer.fullName,
        phoneNumber: selectedCustomer.phoneNumber.replace(/^\+88/, ''),
        email: selectedCustomer.email,
        dateOfBirth: selectedCustomer.dateOfBirth,
        ekycStatus: selectedCustomer.ekycStatus,
        address: selectedCustomer.address,
      });
    }
    setIsEditDialogOpen(false);
  };

  const handleCreateCancel = () => {
    setCreateStep(1);
    setCreateForm(INITIAL_CREATE_FORM);
    setIsCreateDialogOpen(false);
  };

  const handleCreateCustomer = async () => {
    const createPayload: CreateCustomerPayload = {
      ...createForm,
      phoneNumber: createForm.phoneNumber.startsWith('+88') ? createForm.phoneNumber : `+88${createForm.phoneNumber}`,
    };
    const createdResponse = await createCustomerMutation.mutateAsync(createPayload);
    setCustomers((prev) => [createdResponse.data.customer, ...prev]);
    handleCreateCancel();
  };

  const handleCreateNext = async () => {
    if (createStep < 4) {
      setCreateStep((prev) => (prev + 1) as CreateStep);
      return;
    }
    await handleCreateCustomer();
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 1, md: 2 }, pt: 0.5 }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#191B1E' }}>Customer</Typography>
          <Button
            variant="contained"
            onClick={() => {
              setCreateStep(1);
              setCreateForm(INITIAL_CREATE_FORM);
              setIsCreateDialogOpen(true);
            }}
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

      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditCancel}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 711,
            maxWidth: 'calc(100% - 24px)',
            borderRadius: '12px',
            m: 1.5,
          },
        }}
      >
        <DialogTitle sx={{ px: 3.25, pt: 3, pb: 1, fontSize: 18, lineHeight: 1.2, fontWeight: 500, color: '#191B1E' }}>
          Customer
        </DialogTitle>
        <DialogContent sx={{ px: 3.25, py: 0 }}>
          <Typography sx={{ mb: 2.5, fontSize: 16, fontWeight: 400, color: '#344054', lineHeight: 1.2 }}>
            Edit Customer
          </Typography>
          <Grid container spacing={2.25}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3', lineHeight: 1.1 }}>Full Name</Typography>
              <TextField
                fullWidth
                value={editForm.fullName}
                onChange={(event) => setEditForm((prev) => ({ ...prev, fullName: event.target.value }))}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 40,
                    borderRadius: '10px',
                    '& fieldset': { borderColor: '#D0D5DD' },
                    '&:hover fieldset': { borderColor: '#D0D5DD' },
                    '&.Mui-focused fieldset': { borderColor: '#03BC00' },
                  },
                  '& .MuiInputBase-input': { fontSize: 14, color: '#191B1E', px: 1.5 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3', lineHeight: 1.1 }}>Phone number</Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  height: 40,
                  borderRadius: '10px',
                  border: '1px solid #D0D5DD',
                  overflow: 'hidden',
                  bgcolor: '#FFFFFF',
                }}
              >
                <Box
                  sx={{
                    width: 84,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    borderRight: '1px solid #D0D5DD',
                    bgcolor: '#FFFFFF',
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: '#006A4E',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: '#F42A41',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-45%, -50%)',
                      },
                    }}
                  />
                  <Typography sx={{ fontSize: 14, color: '#191B1E', lineHeight: 1 }}>+88</Typography>
                </Box>
                <TextField
                  fullWidth
                  value={editForm.phoneNumber}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 40,
                      borderRadius: 0,
                      '& fieldset': { border: 'none' },
                    },
                    '& .MuiInputBase-input': { fontSize: 14, color: '#191B1E', px: 1.5 },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3', lineHeight: 1.1 }}>Email Address</Typography>
              <TextField
                fullWidth
                value={editForm.email}
                onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 40,
                    borderRadius: '10px',
                    '& fieldset': { borderColor: '#D0D5DD' },
                    '&:hover fieldset': { borderColor: '#D0D5DD' },
                    '&.Mui-focused fieldset': { borderColor: '#03BC00' },
                  },
                  '& .MuiInputBase-input': { fontSize: 14, color: '#191B1E', px: 1.5 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3', lineHeight: 1.1 }}>Date of Birth</Typography>
              <TextField
                fullWidth
                value={editForm.dateOfBirth}
                onChange={(event) => setEditForm((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 40,
                    borderRadius: '10px',
                    '& fieldset': { borderColor: '#D0D5DD' },
                    '&:hover fieldset': { borderColor: '#D0D5DD' },
                    '&.Mui-focused fieldset': { borderColor: '#03BC00' },
                  },
                  '& .MuiInputBase-input': { fontSize: 14, color: '#191B1E', px: 1.5 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3', lineHeight: 1.1 }}>eKYC Status</Typography>
              <TextField
                fullWidth
                value={editForm.ekycStatus}
                size="small"
                InputProps={{ readOnly: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 40,
                    borderRadius: '10px',
                    bgcolor: '#EAECF0',
                    '& fieldset': { borderColor: '#EAECF0' },
                    '&:hover fieldset': { borderColor: '#EAECF0' },
                    '&.Mui-focused fieldset': { borderColor: '#EAECF0' },
                  },
                  '& .MuiInputBase-input': { fontSize: 14, color: '#98A2B3', px: 1.5 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3', lineHeight: 1.1 }}>Address</Typography>
              <TextField
                fullWidth
                value={editForm.address}
                onChange={(event) => setEditForm((prev) => ({ ...prev, address: event.target.value }))}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 40,
                    borderRadius: '10px',
                    '& fieldset': { borderColor: '#D0D5DD' },
                    '&:hover fieldset': { borderColor: '#D0D5DD' },
                    '&.Mui-focused fieldset': { borderColor: '#03BC00' },
                  },
                  '& .MuiInputBase-input': { fontSize: 14, color: '#191B1E', px: 1.5 },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3.25, pt: 2.5, pb: 3, gap: 2 }}>
          <Button
            onClick={handleEditCancel}
            sx={{
              width: 152,
              height: 48,
              borderRadius: '12px',
              bgcolor: '#A3EBB1',
              color: '#101828',
              fontSize: 16,
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#8DDEA0' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
            sx={{
              width: 152,
              height: 48,
              borderRadius: '12px',
              bgcolor: '#03BC00',
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 500,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#02A900', boxShadow: 'none' },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isCreateDialogOpen}
        onClose={handleCreateCancel}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 711,
            maxWidth: 'calc(100% - 24px)',
            borderRadius: '12px',
            m: 1.5,
          },
        }}
      >
        <DialogTitle sx={{ px: 3.25, pt: 3, pb: 1.5, fontSize: 18, fontWeight: 500, color: '#191B1E' }}>
          New Customer Registration
        </DialogTitle>
        <DialogContent sx={{ px: 3.25, py: 0 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="center" sx={{ mb: 3.5 }}>
            {[1, 2, 3, 4].map((step, index) => {
              const isDocumentStep = step === 4;
              const isActiveStep = createStep >= step && !isDocumentStep;
              const circleColor = isActiveStep ? '#03BC00' : '#004B35';

              return (
                <Box key={step} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Stack alignItems="center" spacing={0.5} sx={{ minWidth: 80 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: circleColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isDocumentStep ? (
                        <CloudUploadIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                      ) : (
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 11.2,
                        color: '#004B35',
                        fontWeight: isDocumentStep ? 700 : 400,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {CREATE_STEP_LABELS[step as CreateStep]}
                    </Typography>
                  </Stack>
                  {index < 3 && <Box sx={{ width: 84, height: 2, bgcolor: '#004B35', mb: 3.5, mx: 2 }} />}
                </Box>
              );
            })}
          </Stack>

          {createStep === 1 && (
            <Grid container spacing={2} sx={{ minHeight: 150 }}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3' }}>First Name</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter first name"
                  value={createForm.firstName}
                  onChange={(event) => handleCreateFieldChange('firstName', event.target.value)}
                  sx={createDialogInputSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3' }}>Last Name</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter last name"
                  value={createForm.lastName}
                  onChange={(event) => handleCreateFieldChange('lastName', event.target.value)}
                  sx={createDialogInputSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3' }}>Gender</Typography>
                <TextField
                  fullWidth
                  select
                  size="small"
                  value={createForm.gender}
                  onChange={(event) => handleCreateFieldChange('gender', event.target.value)}
                  SelectProps={{ IconComponent: KeyboardArrowDownRoundedIcon }}
                  sx={createDialogInputSx}
                >
                  <MenuItem value="">Choose</MenuItem>
                  {GENDER_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3' }}>Date of Birth</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="dd/mm/yyyy"
                  value={createForm.dateOfBirth}
                  onChange={(event) => handleCreateFieldChange('dateOfBirth', event.target.value)}
                  sx={createDialogInputSx}
                />
              </Grid>
            </Grid>
          )}

          {createStep === 2 && (
            <Grid container spacing={2} sx={{ minHeight: 232 }}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3' }}>Phone Number</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter phone number"
                  value={createForm.phoneNumber}
                  onChange={(event) => handleCreateFieldChange('phoneNumber', event.target.value)}
                  sx={createDialogInputSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3' }}>Email Address</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter email"
                  value={createForm.email}
                  onChange={(event) => handleCreateFieldChange('email', event.target.value)}
                  sx={createDialogInputSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3' }}>Address</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="enter address"
                  value={createForm.address}
                  onChange={(event) => handleCreateFieldChange('address', event.target.value)}
                  sx={createDialogInputSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3' }}>City</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="City"
                  value={createForm.city}
                  onChange={(event) => handleCreateFieldChange('city', event.target.value)}
                  sx={createDialogInputSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3' }}>Country</Typography>
                <TextField
                  fullWidth
                  select
                  size="small"
                  value={createForm.country}
                  onChange={(event) => handleCreateFieldChange('country', event.target.value)}
                  SelectProps={{ IconComponent: KeyboardArrowDownRoundedIcon }}
                  sx={createDialogInputSx}
                >
                  <MenuItem value="">Choose</MenuItem>
                  {COUNTRIES.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          )}

          {createStep === 3 && (
            <Grid container spacing={2} sx={{ minHeight: 150 }}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3' }}>NID Number</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter nid number"
                  value={createForm.nidNumber}
                  onChange={(event) => handleCreateFieldChange('nidNumber', event.target.value)}
                  sx={createDialogInputSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3' }}>Nationality</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter nationality"
                  value={createForm.nationality}
                  onChange={(event) => handleCreateFieldChange('nationality', event.target.value)}
                  sx={createDialogInputSx}
                />
              </Grid>
            </Grid>
          )}

          {createStep === 4 && (
            <Grid container spacing={2} sx={{ minHeight: 164, position: 'relative' }}>
              <Grid item xs={12} md={6}>
                <Button
                  component="label"
                  sx={{
                    width: '100%',
                    height: 132,
                    borderRadius: '14px',
                    border: '1.5px dashed #59D568',
                    bgcolor: '#F2FAF4',
                    textTransform: 'none',
                    color: '#1F2937',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.2,
                  }}
                >
                  <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Upload NID Documents</Typography>
                  <CloudUploadIcon sx={{ color: '#03BC00', fontSize: 28 }} />
                  <input
                    hidden
                    type="file"
                    onChange={(event) =>
                      handleCreateFieldChange('nidDocumentName', event.target.files?.[0]?.name || '')
                    }
                  />
                </Button>
                {createForm.nidDocumentName && (
                  <Typography sx={{ mt: 0.75, fontSize: 11.5, color: '#027A48' }}>{createForm.nidDocumentName}</Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  component="label"
                  sx={{
                    width: '100%',
                    height: 132,
                    borderRadius: '14px',
                    border: '1.5px dashed #59D568',
                    bgcolor: '#F2FAF4',
                    textTransform: 'none',
                    color: '#1F2937',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.2,
                  }}
                >
                  <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Upload Your Photo</Typography>
                  <CloudUploadIcon sx={{ color: '#03BC00', fontSize: 28 }} />
                  <input
                    hidden
                    type="file"
                    onChange={(event) =>
                      handleCreateFieldChange('photoDocumentName', event.target.files?.[0]?.name || '')
                    }
                  />
                </Button>
                {createForm.photoDocumentName && (
                  <Typography sx={{ mt: 0.75, fontSize: 11.5, color: '#027A48' }}>{createForm.photoDocumentName}</Typography>
                )}
              </Grid>
              <Box
                sx={{
                  position: 'absolute',
                  top: 6,
                  right: 56,
                  width: 56,
                  height: 34,
                  borderRadius: '20px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #D0D5DD',
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 0.4,
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: '#12B76A',
                    color: '#FFFFFF',
                    fontSize: 19,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  F
                </Box>
                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#98A2B3' }} />
              </Box>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3.25, pt: 2.5, pb: 3, gap: 2 }}>
          <Button
            onClick={handleCreateCancel}
            sx={{
              width: 152,
              height: 48,
              borderRadius: '12px',
              bgcolor: '#A3EBB1',
              color: '#101828',
              fontSize: 16,
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#8DDEA0' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateNext}
            sx={{
              width: 152,
              height: 48,
              borderRadius: '12px',
              bgcolor: '#03BC00',
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 500,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#02A900', boxShadow: 'none' },
            }}
          >
            {createStep === 4 ? 'Submit' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

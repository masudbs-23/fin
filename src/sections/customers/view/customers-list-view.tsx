import SearchIcon from 'src/assets/table/Search.svg';
import ArrowIcon from 'src/assets/table/Arrow.svg';
import UploadIcon from 'src/assets/svg/Upload.svg';
import PencilIcon from 'src/assets/table/Pencil.svg';
import EyeIcon from 'src/assets/table/Eye.svg';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { useCreateCustomer, useGetCustomerDetails, useGetCustomerList, useUpdateCustomer } from 'src/query/hooks/customer';
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

const STEP_ONE_SCHEMA = yup.object({
  firstName: yup.string().trim().required('First name is required'),
  lastName: yup.string().trim().required('Last name is required'),
  gender: yup.string().trim().required('Gender is required'),
  dateOfBirth: yup.string().trim().required('Date of birth is required'),
});

const STEP_TWO_SCHEMA = yup.object({
  phoneNumber: yup.string().trim().required('Phone number is required'),
  email: yup.string().trim().email('Enter a valid email address').required('Email is required'),
  address: yup.string().trim().required('Address is required'),
  city: yup.string().trim().required('City is required'),
  country: yup.string().trim().required('Country is required'),
});

const STEP_THREE_SCHEMA = yup.object({
  nidNumber: yup.string().trim().required('NID number is required'),
  nationality: yup.string().trim().required('Nationality is required'),
});

const STEP_FOUR_SCHEMA = yup.object({
  nidDocumentName: yup.string().trim().required('NID document is required'),
  photoDocumentName: yup.string().trim().required('Photo document is required'),
});

const CREATE_STEP_SCHEMAS: Record<CreateStep, yup.ObjectSchema<any>> = {
  1: STEP_ONE_SCHEMA,
  2: STEP_TWO_SCHEMA,
  3: STEP_THREE_SCHEMA,
  4: STEP_FOUR_SCHEMA,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultFilters = {
    mobileNumber: '',
    nidNumber: '',
    country: '',
  };
  const initialFilters = {
    mobileNumber: searchParams.get('mobileNumber') || '',
    nidNumber: searchParams.get('nidNumber') || '',
    country: searchParams.get('country') || '',
  };

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
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
  const [createFormErrors, setCreateFormErrors] = useState<Partial<Record<keyof CreateCustomerPayload, string>>>({});

  const { data: customerListResponse, refetch: refetchCustomerList } = useGetCustomerList(appliedFilters);
  const { data: customerDetails } = useGetCustomerDetails(selectedCustomerId, isEditDialogOpen);
  const updateCustomerMutation = useUpdateCustomer();
  const createCustomerMutation = useCreateCustomer();

  const filteredCustomers = useMemo(() => {
    const mobile = appliedFilters.mobileNumber.trim().toLowerCase();
    const nid = appliedFilters.nidNumber.trim().toLowerCase();
    const country = appliedFilters.country.trim().toLowerCase();

    return customers.filter((customer) => {
      const mobileMatch = mobile ? customer.phoneNumber.toLowerCase().includes(mobile) : true;
      const nidMatch = nid ? customer.nidNumber.toLowerCase().includes(nid) : true;
      const countryMatch = country ? customer.country.toLowerCase() === country : true;
      return mobileMatch && nidMatch && countryMatch;
    });
  }, [customers, appliedFilters.country, appliedFilters.mobileNumber, appliedFilters.nidNumber]);

  useEffect(() => {
    const apiCustomers = customerListResponse?.data?.customers;
    if (Array.isArray(apiCustomers)) {
      setCustomers(apiCustomers);
    }
  }, [customerListResponse?.data?.customers]);

  useEffect(() => {
    if (!customerDetails || !isEditDialogOpen) return;

    setSelectedCustomer(customerDetails);
    setEditForm({
      fullName: customerDetails.fullName,
      phoneNumber: customerDetails.phoneNumber.replace(/^\+88/, ''),
      email: customerDetails.email,
      dateOfBirth: customerDetails.dateOfBirth,
      ekycStatus: customerDetails.ekycStatus,
      address: customerDetails.address,
    });
  }, [customerDetails, isEditDialogOpen]);

  const inputSx = {
    width: { xs: '100%', sm: '288px' },
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

  const createDialogInputSx = {
    width: '320px',
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
      px: 1.5,
      py: 1.2,
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

  const handleCreateFieldChange = (field: keyof CreateCustomerPayload, value: string) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
    if (createFormErrors[field]) {
      setCreateFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSearch = async () => {
    const isSameFilters =
      appliedFilters.mobileNumber === filters.mobileNumber &&
      appliedFilters.nidNumber === filters.nidNumber &&
      appliedFilters.country === filters.country;

    const params = new URLSearchParams();
    if (filters.mobileNumber) params.set('mobileNumber', filters.mobileNumber);
    if (filters.nidNumber) params.set('nidNumber', filters.nidNumber);
    if (filters.country) params.set('country', filters.country);
    setSearchParams(params, { replace: true });

    if (isSameFilters) {
      await refetchCustomerList();
      return;
    }

    setAppliedFilters({ ...filters });
  };

  const validateCreateStep = async (step: CreateStep) => {
    const schema = CREATE_STEP_SCHEMAS[step];

    try {
      await schema.validate(createForm, { abortEarly: false });
      return true;
    } catch (error) {
      if (!(error instanceof yup.ValidationError)) return false;

      const nextErrors: Partial<Record<keyof CreateCustomerPayload, string>> = {};
      error.inner.forEach((issue) => {
        if (!issue.path || nextErrors[issue.path as keyof CreateCustomerPayload]) return;
        nextErrors[issue.path as keyof CreateCustomerPayload] = issue.message;
      });
      setCreateFormErrors((prev) => ({ ...prev, ...nextErrors }));
      return false;
    }
  };

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSelectedCustomerId(customer.id);
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
    setSelectedCustomerId('');
    setIsEditDialogOpen(false);
  };

  const handleCreateCancel = () => {
    setCreateStep(1);
    setCreateForm(INITIAL_CREATE_FORM);
    setCreateFormErrors({});
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
    const isStepValid = await validateCreateStep(createStep);
    if (!isStepValid) return;

    if (createStep < 4) {
      setCreateStep((prev) => (prev + 1) as CreateStep);
      return;
    }
    await handleCreateCustomer();
  };

  return (
    <>
      <Stack spacing={2.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#191B1E' }}>Customer</Typography>
          <Button
            variant="contained"
            onClick={() => {
              setCreateStep(1);
              setCreateForm(INITIAL_CREATE_FORM);
              setCreateFormErrors({});
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
          <Grid container spacing={1} alignItems="end" sx={{ width: '100%', m: 0 }}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
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
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
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
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
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
                SelectProps={{
                  IconComponent: KeyboardArrowDownRoundedIcon,
                  displayEmpty: true,
                  renderValue: (selected) =>
                    typeof selected === 'string' && selected ? selected : 'Choose',
                }}
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
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={handleSearch}
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
              mt: 2.5,
              mb: 1.5,
              height: 51,
              display: 'flex',
              alignItems: 'center',
              borderRadius: '10px',
              bgcolor: '#FFFFFF',
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#191B1E' }}>Customer List</Typography>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
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
                          startIcon={<Box component="img" src={PencilIcon} sx={{ width: 14, height: 14 }} />}
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
        </Box>
      </Stack>

      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditCancel}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: { md: '711px', xs: 'calc(100% - 24px)' },
            borderRadius: '12px',
            m: 1.5,
          },
        }}
      >
        <DialogTitle sx={{ px: 3.25, pt: 3, pb: 1, fontSize: 18, lineHeight: 1.2, fontWeight: 500, color: '#191B1E' }}>
          Customer
        </DialogTitle>
        <DialogContent sx={{ px: 3.25, py: 0, overflow: 'visible' }}>
          <Typography sx={{ mb: 2.5, fontSize: 16, fontWeight: 400, color: '#344054', lineHeight: 1.2 }}>
            Edit Customer
          </Typography>
          <Box sx={{ width: '660px', mx: 'auto' }}>
            <Grid container spacing={2.25}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3', lineHeight: 1.1 }}>Full Name</Typography>
              <TextField
                value={editForm.fullName}
                onChange={(event) => setEditForm((prev) => ({ ...prev, fullName: event.target.value }))}
                size="small"
                sx={{
                  width: '320px',
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
                  value={editForm.phoneNumber}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                  size="small"
                  sx={{
                    width: '236px',
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
                value={editForm.email}
                onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
                size="small"
                sx={{
                  width: '320px',
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
              <DatePicker
                value={editForm.dateOfBirth ? dayjs(editForm.dateOfBirth) : null}
                onChange={(date) =>
                  setEditForm((prev) => ({
                    ...prev,
                    dateOfBirth: date && dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : '',
                  }))
                }
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: {
                      width: '320px',
                      '& .MuiOutlinedInput-root': {
                        height: 40,
                        borderRadius: '10px',
                        '& fieldset': { borderColor: '#D0D5DD' },
                        '&:hover fieldset': { borderColor: '#D0D5DD' },
                        '&.Mui-focused fieldset': { borderColor: '#03BC00' },
                      },
                      '& .MuiInputBase-input': { fontSize: 14, color: '#191B1E', px: 1.5 },
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 0.75, fontSize: 16, color: '#98A2B3', lineHeight: 1.1 }}>eKYC Status</Typography>
              <TextField
                value={editForm.ekycStatus}
                size="small"
                InputProps={{ readOnly: true }}
                sx={{
                  width: '320px',
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
                value={editForm.address}
                onChange={(event) => setEditForm((prev) => ({ ...prev, address: event.target.value }))}
                size="small"
                sx={{
                  width: '320px',
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3.25, pt: 2.5, pb: 3, gap: 1 }}>
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
            width: { md: '711px', xs: 'calc(100% - 24px)' },
            height: '455px',
            borderRadius: '12px',
            m: 1.5,
          },
        }}
      >
        <DialogTitle sx={{ px: 3.25, pt: 3, pb: 1.5, fontSize: 18, fontWeight: 500, color: '#191B1E' }}>
          New Customer Registration
        </DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <Box sx={{ width: '660px', mx: 'auto' }}>
            <Box sx={{ width: '568px', mx: 'auto', mb: 3.5 }}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            {[1, 2, 3, 4].map((step, index) => {
              const isDocumentStep = step === 4;
              const isActiveStep = createStep >= step && !isDocumentStep;
              const circleColor = isActiveStep ? '#03BC00' : '#004B35';

              return (
                <Box key={step} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: isActiveStep ? '#03BC00' : '#00311E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isDocumentStep ? (
                        <Box
                          component="img"
                          src={UploadIcon}
                          sx={{
                            width: 20,
                            height: 20,
                          }}
                        />
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
          </Box>

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
                  error={Boolean(createFormErrors.firstName)}
                  helperText={createFormErrors.firstName}
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
                  error={Boolean(createFormErrors.lastName)}
                  helperText={createFormErrors.lastName}
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
                  SelectProps={{
                    IconComponent: KeyboardArrowDownRoundedIcon,
                    displayEmpty: true,
                    renderValue: (selected) =>
                      typeof selected === 'string' && selected ? selected : 'Choose',
                  }}
                  error={Boolean(createFormErrors.gender)}
                  helperText={createFormErrors.gender}
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
              <DatePicker
                value={createForm.dateOfBirth ? dayjs(createForm.dateOfBirth) : null}
                onChange={(date) =>
                  handleCreateFieldChange(
                    'dateOfBirth',
                    date && dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : ''
                  )
                }
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: Boolean(createFormErrors.dateOfBirth),
                    helperText: createFormErrors.dateOfBirth,
                    sx: createDialogInputSx,
                  },
                }}
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
                  error={Boolean(createFormErrors.phoneNumber)}
                  helperText={createFormErrors.phoneNumber}
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
                  error={Boolean(createFormErrors.email)}
                  helperText={createFormErrors.email}
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
                  error={Boolean(createFormErrors.address)}
                  helperText={createFormErrors.address}
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
                  error={Boolean(createFormErrors.city)}
                  helperText={createFormErrors.city}
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
                  SelectProps={{
                    IconComponent: KeyboardArrowDownRoundedIcon,
                    displayEmpty: true,
                    renderValue: (selected) =>
                      typeof selected === 'string' && selected ? selected : 'Choose',
                  }}
                  error={Boolean(createFormErrors.country)}
                  helperText={createFormErrors.country}
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
                  error={Boolean(createFormErrors.nidNumber)}
                  helperText={createFormErrors.nidNumber}
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
                  error={Boolean(createFormErrors.nationality)}
                  helperText={createFormErrors.nationality}
                  sx={createDialogInputSx}
                />
              </Grid>
            </Grid>
          )}

          {createStep === 4 && (
            <Box sx={{ width: '444px', height: '173px', mx: 'auto', position: 'relative' }}>
              <Box sx={{ display: 'flex', gap: '16px', height: '100%' }}>
                <Box sx={{ width: '222px' }}>
                  <Button
                    component="label"
                    sx={{
                      width: '222px',
                      height: '137px',
                      borderRadius: '12px',
                      border: '1px dashed #59D568',
                      borderStyle: 'dashed',
                      borderWidth: 1,
                      bgcolor: '#F2FAF4',
                      textTransform: 'none',
                      color: '#1F2937',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.2,
                    }}
                  >
                    <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Upload NID Documents</Typography>
                    <Box
                    component="img"
                    src={UploadIcon}
                    sx={{
                      width: 25,
                      height: 25,
                    }}
                  />
                    <input
                      hidden
                      type="file"
                      onChange={(event) =>
                        handleCreateFieldChange('nidDocumentName', event.target.files?.[0]?.name || '')
                      }
                    />
                  </Button>
                  {createForm.nidDocumentName && (
                    <Typography sx={{ mt: 0.75, fontSize: 11.5, color: '#027A48' }}>
                      {createForm.nidDocumentName}
                    </Typography>
                  )}
                  {!createForm.nidDocumentName && createFormErrors.nidDocumentName && (
                    <Typography sx={{ mt: 0.75, fontSize: 11.5, color: '#D92D20' }}>
                      {createFormErrors.nidDocumentName}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ width: '222px' }}>
                  <Button
                    component="label"
                    sx={{
                      width: '222px',
                      height: '137px',
                      borderRadius: '12px',
                      border: '1px dashed #59D568',
                      borderStyle: 'dashed',
                      borderWidth: 1,
                      bgcolor: '#F2FAF4',
                      textTransform: 'none',
                      color: '#1F2937',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.2,
                    }}
                  >
                    <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Upload Your Photo</Typography>
                    <Box
                    component="img"
                    src={UploadIcon}
                    sx={{
                      width: 25,
                      height: 25,
                    }}
                  />
                    <input
                      hidden
                      type="file"
                      onChange={(event) =>
                        handleCreateFieldChange('photoDocumentName', event.target.files?.[0]?.name || '')
                      }
                    />
                  </Button>
                  {createForm.photoDocumentName && (
                    <Typography sx={{ mt: 0.75, fontSize: 11.5, color: '#027A48' }}>
                      {createForm.photoDocumentName}
                    </Typography>
                  )}
                  {!createForm.photoDocumentName && createFormErrors.photoDocumentName && (
                    <Typography sx={{ mt: 0.75, fontSize: 11.5, color: '#D92D20' }}>
                      {createFormErrors.photoDocumentName}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3.25, pt: 2.5, pb: 3, gap: 1 }}>
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
    </>
  );
}

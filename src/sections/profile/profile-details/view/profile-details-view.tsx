import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useGetProfileDetails } from 'src/query/hooks/profile/profile';

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.5}>
      <Typography sx={{ 
        color: '#777F89', 
        fontSize: 16, 
        fontWeight: 400,
        fontFamily: 'Roboto'
      }}>{label}</Typography>
      <Box
        sx={{
          width: '320px',
          height: '40px',
          borderRadius: '8px',
          border: '1px solid #D5D7DA',
          bgcolor: '#D5D7DA',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          color: '#777F89',
          fontWeight: 400,
        }}
      >
        {value}
      </Box>
    </Stack>
  );
}

export default function ProfileDetailsView() {
  const { data: profile } = useGetProfileDetails();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', px: { xs: 1.5, md: 2.5 }, py: { xs: 1.5, md: 2 } }}>
        <Box sx={{ 
          width: { xs: '100%', sm: '90%', md: '719px' },
          maxWidth: '719px',
          height: { xs: 'auto', sm: 'auto', md: '580px' },
          border: '0.74px solid #E5E7EB', 
          borderRadius: '16px', 
          p: 3 
        }}>
          <Typography sx={{ fontSize: 24, fontWeight: 600, color: '#191B1E', mb: 1.5 }}>Profile Details</Typography>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
            <Avatar sx={{ bgcolor: '#03BC00', width: 44, height: 44, fontSize: 24 }}>JS</Avatar>
            <Typography sx={{ fontSize: 24, fontWeight: 600, color: '#191B1E' }}>{profile?.fullName || 'John Doe'}</Typography>
          </Stack>

          <Box sx={{ borderTop: '1px solid #E5E7EB', mb: 2 }} />

          <Grid container spacing={1.5}>
            <Grid item xs={12} md={6}>
              <InfoField label="Distributor Name" value={profile?.distributorName || '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoField label="Date of Birth" value={profile?.dateOfBirth || '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoField label="Nationality" value={profile?.nationality || '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoField label="Phone Number" value={profile?.phoneNumber || '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoField label="Email" value={profile?.email || '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoField label="NID Number" value={profile?.nidNumber || '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoField label="Address" value={profile?.address || '-'} />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 2,
              mb: 1,
              border: '1px solid #BFDBFE',
              bgcolor: '#EAF3FF',
              borderRadius: '12px',
              px: 2,
              py: 1,
            }}
          >
            <Typography sx={{ color: '#3B82F6', fontWeight: 700 }}>
              Note: This information is non-editable. Please contact support if you need to update any details.
            </Typography>
          </Box>
        </Box>
    </Box>
  );
}

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ProfileDetails } from 'src/types/profile';
import { useGetProfileDetails } from 'src/query/hooks/profile/profile';

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.5}>
      <Typography sx={{ color: '#667085', fontSize: 16, fontWeight: 400 }}>{label}</Typography>
      <Box
        sx={{
          width: '100%',
          height: 40,
          borderRadius: '8px',
          border: '1px solid #D5D7DA',
          bgcolor: '#D5D7DA',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          color: '#777F89',
          fontWeight: 400,
          fontSize: 14,
        }}
      >
        {value}
      </Box>
    </Stack>
  );
}

const MOCK_PROFILE_DETAILS: ProfileDetails = {
  fullName: 'John Doe',
  distributorName: 'Ahmed Hossain',
  dateOfBirth: 'January 15, 1985',
  nationality: 'Bangladeshi',
  phoneNumber: '+880-1712345678',
  email: 'Bangladeshi',
  nidNumber: '1234567890123',
  address: 'Bangladeshi',
};

export default function ProfileDetailsView() {
  // Keep query hook ready for API integration; UI currently renders mock values by design.
  const { data: profileResponse } = useGetProfileDetails(false);
  const profile = profileResponse || MOCK_PROFILE_DETAILS;

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: { xs: 2, md: 6.5 } }}>
      <Box sx={{ width: '100%', maxWidth: 1177, display: 'flex', justifyContent: 'center', px: { xs: 1, md: 0 } }}>
        <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 719 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 500, color: '#101828' }}>Profile Details</Typography>

          <Box
            sx={{
              borderRadius: '16px',
              border: '0.74px solid #E4E7EC',
              bgcolor: '#FFFFFF',
              px: 3,
              pt: 3,
              pb: 2.5,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ pb: 1, borderBottom: '0.74px solid #E4E7EC' }}>
              <Avatar sx={{ bgcolor: '#03BC00', width: 37, height: 37, fontSize: 20, fontWeight: 500 }}>
                JS
              </Avatar>
              <Typography sx={{ fontSize: 36, fontWeight: 600, color: '#101828', lineHeight: 1 }}>
                {profile.fullName || 'John Doe'}
              </Typography>
            </Stack>

            <Grid container spacing={2.5} sx={{ mt: 0.2 }}>
              <Grid item xs={12} md={6}>
                <InfoField label="Distributor Name" value={profile.distributorName || '-'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoField label="Date of Birth" value={profile.dateOfBirth || '-'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoField label="Nationality" value={profile.nationality || '-'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoField label="Phone Number" value={profile.phoneNumber || '-'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoField label="Email" value={profile.email || '-'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoField label="NID Number" value={profile.nidNumber || '-'} />
              </Grid>
              <Grid item xs={12}>
                <InfoField label="Address" value={profile.address || '-'} />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 2,
                border: '0.74px solid #BFDBFE',
                bgcolor: '#F0F9FF',
                borderRadius: '14px',
                px: 2,
                py: 1.25,
              }}
            >
              <Typography sx={{ color: '#1570EF', fontSize: 12.8, lineHeight: '19.2px' }}>
                <Box component="span" sx={{ fontWeight: 600 }}>
                  Note:
                </Box>{' '}
                This information is non-editable. Please contact support if you need to update any
                details.
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

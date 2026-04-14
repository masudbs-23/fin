import { Helmet } from 'react-helmet-async';
import { PROJECT_NAME } from 'src/config-global';
import { VerifyOtpView } from 'src/sections/auth/verify-otp';

export default function VerifyOtpPage() {
  return (
    <>
      <Helmet>
        <title>{PROJECT_NAME}: Verify OTP</title>
      </Helmet>

      <VerifyOtpView />
    </>
  );
}

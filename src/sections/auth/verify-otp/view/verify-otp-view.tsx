import { useState } from 'react';
import {
  VerifyOtpForm,
  VerifyOtpHeader,
} from 'src/sections/auth/verify-otp/components';

type Props = {
  mode?: 'verify-otp' | 'device-binding';
  onExitToLogin?: () => void;
};

export default function VerifyOtpView({ mode = 'verify-otp', onExitToLogin }: Props) {
  const [isSetPasswordStep, setIsSetPasswordStep] = useState(false);

  return (
    <>
      {!isSetPasswordStep && <VerifyOtpHeader mode={mode} onLogoClick={onExitToLogin} />}

      <VerifyOtpForm mode={mode} onSetPasswordStepChange={setIsSetPasswordStep} />
    </>
  );
}

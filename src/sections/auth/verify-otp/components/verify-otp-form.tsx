import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function VerifyOtpForm() {
  const [errorMsg, setErrorMsg] = useState<any>('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const VerifyOtpSchema = Yup.object().shape({
    otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
  });

  const methods = useForm({
    resolver: yupResolver(VerifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = methods;

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    const numValue = value.replace(/[^0-9]/g, '');
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = numValue.slice(-1); // Take only last character
    setOtpValues(newOtpValues);

    // Move to next input if current input is filled
    if (numValue && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    
    const newOtpValues = [...otpValues];
    for (let i = 0; i < 6; i += 1) {
      newOtpValues[i] = pastedData[i] || '';
    }
    setOtpValues(newOtpValues);
    
    // Focus on the next empty input or the last one
    const nextEmptyIndex = newOtpValues.findIndex(val => val === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs[focusIndex].current?.focus();
  };

  const onSubmit = handleSubmit(async () => {
    const otp = otpValues.join('');
    try {
      // Placeholder for verifyOtp implementation
      // TODO: Implement actual verifyOtp logic
      console.log('OTP to verify:', otp);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just log success
      console.log('OTP verified successfully (placeholder)');
    } catch (error: any) {
      if (typeof error.message === 'object') {
        const errorKeys = Object.keys(error?.message!) as any;
        errorKeys.forEach((key: any) => {
          setError(key, { message: error?.message![key] });
        });
      } else {
        setErrorMsg(error?.message!);
      }
    }
  });

  const handleResendCode = () => {
    // Handle resend code logic
    console.log('Resend code clicked');
  };

  const renderForm = (
    <Stack spacing={2.5} sx={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
      {/* OTP Input Fields */}
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-start',
          mb: 2,
        }}
      >
        {otpValues.map((value, index) => (
          <TextField
            key={index}
            inputRef={inputRefs[index]}
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 600,
              },
            }}
            sx={{
              width: '48px',
              height: '48px',
              '& .MuiOutlinedInput-root': {
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                border: '1px solid #B8BBBE',
                boxSizing: 'border-box',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover': {
                  border: '1px solid #B8BBBE',
                },
                '&.Mui-focused': {
                  border: '1px solid #03BC00',
                },
                '&.Mui-error': {
                  border: '1px solid #D5D7DA',
                },
              },
              '& .MuiInputBase-input': {
                width: '48px',
                height: '48px',
                padding: '0',
                boxSizing: 'border-box',
              },
            }}
          />
        ))}
      </Box>

      {/* Resend Code Link */}
      <Box sx={{ textAlign: 'left', mt: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '16px',
            color: '#191B1E',
            fontWeight: 500,
            display: 'inline',
          }}
        >
          Didn&apos;t get the code?{' '}
        </Typography>
        <Link
          component="button"
          variant="body2"
          onClick={handleResendCode}
          sx={{
            fontSize: '14px',
            color: '#03BC00',
            fontWeight: 500,
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': {
              color: '#03A000',
              textDecoration: 'none',
            },
          }}
        >
          Resend code
        </Link>
      </Box>
    </Stack>
  );

  return (
    <>
      {!!errorMsg && typeof errorMsg !== 'object' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={onSubmit}>
        <Box sx={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>{renderForm}</Box>
      </form>
    </>
  );
}

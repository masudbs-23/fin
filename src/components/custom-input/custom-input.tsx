import FormHelperText from '@mui/material/FormHelperText';
import { InputAdornment, Stack, TextField, Typography, Box } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import Iconify from '../iconify';

interface CustomInputProps<T extends FieldValues = FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  icon?: string;
  endIcon?: string;
  onEndIconClick?: () => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  autoFillSaved?: boolean;
}

export function CustomInput<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  icon,
  endIcon,
  onEndIconClick,
  disabled = false,
  error = false,
  helperText,
  autoFillSaved = false,
}: CustomInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => (
        <Stack spacing={1}>
          {label && (
            <Typography
              variant="body2"
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#374151',
              }}
            >
              {label}
            </Typography>
          )}
          <Box sx={{ position: 'relative', width: '100%' }}>
            {icon && (
              <Box
                sx={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              >
                <Iconify icon={icon} width={20} height={20} color="#010002" />
              </Box>
            )}
            <TextField
              {...field}
              fullWidth
              variant="outlined"
              placeholder={placeholder}
              type={type}
              disabled={disabled}
              error={error || !!fieldError}
              InputProps={{
                endAdornment: endIcon && (
                  <InputAdornment position="end">
                    <Iconify 
                      icon={endIcon} 
                      width={20} 
                      height={20} 
                      sx={{ cursor: onEndIconClick ? 'pointer' : 'default' }}
                      onClick={onEndIconClick}
                    />
                  </InputAdornment>
                ),
              }}
            sx={{
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              '& .MuiOutlinedInput-root': {
                height: 44,
                minHeight: 44,
                maxHeight: 44,
                boxSizing: 'border-box',
                borderRadius: '8px',
                border: '1px solid #D5D7DA',
                backgroundColor: autoFillSaved ? 'white' : 'transparent',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover': {
                  border: '1px solid #D5D7DA',
                },
                '&.Mui-focused': {
                  border: '1px solid #D5D7DA',
                },
                '&.Mui-error': {
                  border: '1px solid #D5D7DA',
                },
              },
              '& .MuiInputBase-input': {
                height: 44,
                minHeight: 44,
                py: 0,
                boxSizing: 'border-box',
                padding: '0 14px 0 45px',
                fontSize: '14px',
                '&::placeholder': {
                  color: '#9CA3AF',
                  opacity: 1,
                },
                '&:-webkit-autofill': {
                  WebkitTextFillColor: '#000000',
                  transition: 'background-color 5000s ease-in-out 0s',
                  borderRadius: '8px',
                  border: '1px solid #D5D7DA !important',
                  caretColor: '#000000',
                },
                '&:-webkit-autofill::first-line': {
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  color: '#000000',
                },
              },
            }}
          />
            </Box>
          {(helperText || fieldError?.message) && (
            <FormHelperText error={!!fieldError || error} sx={{ m: 0, mx: 0, mt: 0.5 }}>
              {helperText || fieldError?.message}
            </FormHelperText>
          )}
        </Stack>
      )}
    />
  );
}

export default CustomInput;

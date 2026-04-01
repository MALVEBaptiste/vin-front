import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Button, Alert, Stack } from '@mui/material';
import PinInput from './PinInput';
import { useAuth } from '../../hooks/useAuth';

const schema = z.object({
  username: z.string().min(2, 'Minimum 2 caractères'),
  pin: z.string().regex(/^\d{4}$/, 'Le PIN doit contenir 4 chiffres'),
});

type LoginFormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', pin: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError('');
      await login(data);
    } catch {
      setError('Identifiants invalides');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Pseudo"
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
          autoFocus
        />
        <Controller
          name="pin"
          control={control}
          render={({ field }) => (
            <PinInput value={field.value} onChange={field.onChange} error={!!errors.pin} />
          )}
        />
        {errors.pin && (
          <Alert severity="error" sx={{ py: 0 }}>
            {errors.pin.message}
          </Alert>
        )}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          Se connecter
        </Button>
      </Stack>
    </form>
  );
}

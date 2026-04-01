import { Paper, Typography, Link as MuiLink } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { token } = useAuth();
  if (token) return <Navigate to="/lobby" replace />;

  return (
    <PageContainer maxWidth={420}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" textAlign="center" gutterBottom color="secondary.main">
          Inscription
        </Typography>
        <RegisterForm />
        <Typography variant="body2" textAlign="center" sx={{ mt: 3 }} color="text.secondary">
          Déjà un compte ?{' '}
          <MuiLink component={Link} to="/login" color="secondary">
            Se connecter
          </MuiLink>
        </Typography>
      </Paper>
    </PageContainer>
  );
}

import { Paper, Typography, Link as MuiLink } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { token } = useAuth();
  if (token) return <Navigate to="/lobby" replace />;

  return (
    <PageContainer maxWidth={420}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" textAlign="center" gutterBottom color="secondary.main">
          Connexion
        </Typography>
        <LoginForm />
        <Typography variant="body2" textAlign="center" sx={{ mt: 3 }} color="text.secondary">
          Pas encore de compte ?{' '}
          <MuiLink component={Link} to="/register" color="secondary">
            Créer un compte
          </MuiLink>
        </Typography>
      </Paper>
    </PageContainer>
  );
}

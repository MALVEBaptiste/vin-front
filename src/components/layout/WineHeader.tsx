import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import WineBarIcon from '@mui/icons-material/WineBar';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function WineHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper' }} elevation={0}>
      <Toolbar>
        <WineBarIcon sx={{ color: 'secondary.main', mr: 1 }} />
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontFamily: '"Playfair Display", serif', color: 'secondary.main' }}
        >
          Dégustation
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              color={isActive('/dashboard') ? 'secondary' : 'inherit'}
              variant={isActive('/dashboard') ? 'outlined' : 'text'}
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
            >
              Tableau de bord
            </Button>
            <Button
              size="small"
              color={isActive('/lobby') ? 'secondary' : 'inherit'}
              variant={isActive('/lobby') ? 'outlined' : 'text'}
              startIcon={<LocalBarIcon />}
              onClick={() => navigate('/lobby')}
            >
              Lobby
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {user.username}
            </Typography>
            <Button
              size="small"
              color="secondary"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Quitter
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

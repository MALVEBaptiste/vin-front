import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, useMediaQuery, useTheme } from '@mui/material';
import WineBarIcon from '@mui/icons-material/WineBar';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function WineHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  if (!user) {
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
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: 'background.paper' }} elevation={0}>
        <Toolbar>
          <WineBarIcon sx={{ color: 'secondary.main', mr: 1 }} />
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontFamily: '"Playfair Display", serif', color: 'secondary.main' }}
          >
            Dégustation
          </Typography>

          {isMobile ? (
            // Menu hamburger mobile
            <IconButton
              color="secondary"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            // Menu desktop
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

      {/* Drawer Menu Mobile */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box
          sx={{
            width: 250,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ flex: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                selected={isActive('/dashboard')}
                onClick={() => handleNavigation('/dashboard')}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Tableau de bord" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={isActive('/lobby')}
                onClick={() => handleNavigation('/lobby')}
              >
                <ListItemIcon>
                  <LocalBarIcon />
                </ListItemIcon>
                <ListItemText primary="Lobby" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {user.username}
            </Typography>
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Quitter
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

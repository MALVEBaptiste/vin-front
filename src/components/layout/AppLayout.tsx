import { Box, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import WineHeader from './WineHeader';

export default function AppLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <WineHeader />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>
      <Box component="footer" sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Dégustation — Jeu de vins français
        </Typography>
      </Box>
    </Box>
  );
}

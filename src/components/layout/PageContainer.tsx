import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: number;
}

export default function PageContainer({ children, maxWidth = 600 }: PageContainerProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth,
        mx: 'auto',
        px: 2,
        py: 4,
      }}
    >
      {children}
    </Box>
  );
}

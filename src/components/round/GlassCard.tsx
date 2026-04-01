import { Paper, Typography } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import WineBarIcon from '@mui/icons-material/WineBar';

interface GlassCardProps {
  id: string;
  position: number;
}

export default function GlassCard({ id, position }: GlassCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      elevation={isDragging ? 4 : 1}
      sx={{
        p: 2,
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: isDragging ? 'action.hover' : 'background.paper',
        transition: isDragging ? 'none' : 'all 0.2s',
      }}
    >
      <WineBarIcon sx={{ color: 'secondary.main' }} />
      <Typography variant="body1" fontWeight={600}>
        Verre {position}
      </Typography>
    </Paper>
  );
}

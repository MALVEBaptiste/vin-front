import { Paper, Typography, IconButton, Box } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import CloseIcon from '@mui/icons-material/Close';

interface BottleSlotProps {
  bottleId: string;
  position: number;
  assignedGlass: number | null;
  onRemove?: () => void;
}

export default function BottleSlot({ bottleId, position, assignedGlass, onRemove }: BottleSlotProps) {
  const { isOver, setNodeRef } = useDroppable({ id: bottleId });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: 2,
        minHeight: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed',
        borderColor: isOver ? 'secondary.main' : 'text.secondary',
        bgcolor: isOver ? 'rgba(201,168,76,0.1)' : 'transparent',
        transition: 'all 0.2s',
      }}
    >
      <LocalBarIcon sx={{ color: 'primary.main', mb: 0.5 }} />
      <Typography variant="body2" color="text.secondary">
        Bouteille {position}
      </Typography>
      {assignedGlass !== null && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <Typography variant="body1" color="secondary.main" fontWeight={700}>
            ← Verre {assignedGlass}
          </Typography>
          {onRemove && (
            <IconButton size="small" onClick={onRemove} sx={{ color: 'error.main', p: 0.25 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    </Paper>
  );
}

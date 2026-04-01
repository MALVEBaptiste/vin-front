import { Chip, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import type { Player } from '../../types/auth.types';

interface PlayerChipProps {
  player: Player;
  score?: number;
  isHost?: boolean;
}

export default function PlayerChip({ player, score, isHost }: PlayerChipProps) {
  return (
    <Chip
      avatar={
        <Avatar sx={{ bgcolor: isHost ? 'secondary.main' : 'primary.main' }}>
          <PersonIcon fontSize="small" />
        </Avatar>
      }
      label={`${player.username}${score !== undefined ? ` — ${score} pts` : ''}`}
      variant={isHost ? 'filled' : 'outlined'}
      color={isHost ? 'secondary' : 'default'}
      sx={{ fontWeight: isHost ? 700 : 400 }}
    />
  );
}

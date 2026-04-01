import { Box, Typography, Button, Paper, Stack, Divider, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayerChip from './PlayerChip';
import { useGame } from '../../hooks/useGame';
import { useRound } from '../../hooks/useRound';
import { useState } from 'react';

export default function WaitingRoom() {
  const { currentGame, isHost } = useGame();
  const { startRound } = useRound();
  const [copied, setCopied] = useState(false);

  if (!currentGame) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentGame.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4" color="secondary.main">
          Salle d'attente
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Code de la partie
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'monospace',
                letterSpacing: '0.3em',
                color: 'secondary.main',
                fontWeight: 700,
              }}
            >
              {currentGame.code}
            </Typography>
            <Chip
              icon={<ContentCopyIcon />}
              label={copied ? 'Copié !' : 'Copier'}
              onClick={handleCopy}
              size="small"
              color={copied ? 'success' : 'default'}
            />
          </Box>
        </Box>

        <Divider sx={{ width: '100%' }} />

        <Box>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Joueurs ({currentGame.players.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {currentGame.players.map((p) => (
              <PlayerChip key={p.id} player={p} isHost={p.id === currentGame.hostId} />
            ))}
          </Box>
        </Box>

        {isHost && (
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() => startRound.mutate()}
            disabled={startRound.isPending || currentGame.players.length < 2}
            sx={{ mt: 2 }}
          >
            Démarrer la manche
          </Button>
        )}

        {!isHost && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            En attente de l'hôte…
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

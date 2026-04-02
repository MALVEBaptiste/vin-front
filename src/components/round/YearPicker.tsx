import { useState } from 'react';
import {
  Typography,
  Button,
  Stack,
  TextField, Chip,
  Box,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Bottle } from '../../types/round.types';
import { RoundPhase } from '../../types/round.types';
import { useRound } from '../../hooks/useRound';
import { useGame } from '../../hooks/useGame';

interface YearPickerProps {
  bottles: Bottle[];
  roundId: string;
}

const currentYear = new Date().getFullYear();

export default function YearPicker({ bottles, roundId }: YearPickerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { submitAnswer } = useRound();
  const { isHost } = useGame();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeBottle, setActiveBottle] = useState<string>(bottles[0]?.id ?? '');

  const handleChange = (bottleId: string, value: string) => {
    // Only allow numeric input
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setSelections((prev) => ({ ...prev, [bottleId]: cleaned }));
  };

  const allFilled = bottles.every((b) => {
    const val = selections[b.id];
    return val && val.length === 4 && parseInt(val, 10) >= 1900 && parseInt(val, 10) <= currentYear;
  });

  const handleSubmit = async () => {
    for (const bottle of bottles) {
      const year = selections[bottle.id];
      if (!year) continue;
      await submitAnswer.mutateAsync({
        roundId,
        bottleId: bottle.id,
        roundPhase: RoundPhase.YEAR,
        value: year,
      });
    }
    setSubmitted(true);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5" textAlign="center">
        Quelle année pour chaque bouteille ?
      </Typography>

      <Alert severity="info" sx={{ bgcolor: 'info.lighter' }}>
        <Typography variant="body2">
          <strong>Année :</strong> +2 points si exacte | +1 point si proche (N-1 ou N+1)
        </Typography>
      </Alert>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        {bottles.map((b) => {
          const val = selections[b.id];
          const label = isMobile ? `Bouteille ${b.position}${val ? ` (${val})` : ''}` : `Bouteille ${b.position}${val ? ` (${val})` : ''}`;
          return (
            <Chip
              key={b.id}
              label={label}
              onClick={() => setActiveBottle(b.id)}
              color={activeBottle === b.id ? 'secondary' : 'default'}
              variant={activeBottle === b.id ? 'filled' : 'outlined'}
              sx={{ whiteSpace: 'nowrap' }}
            />
          );
        })}
      </Box>

      <TextField
        label={`Millésime — Bouteille ${bottles.find((b) => b.id === activeBottle)?.position ?? ''}`}
        type="number"
        value={selections[activeBottle] ?? ''}
        onChange={(e) => handleChange(activeBottle, e.target.value)}
        disabled={submitAnswer.isPending}
        slotProps={{
          htmlInput: {
            min: 1900,
            max: currentYear,
            style: { textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.15em' },
          },
        }}
        helperText={`Entre 1900 et ${currentYear}`}
      />

      {!submitted ? (
        <Button
          variant="contained"
          disabled={!allFilled || submitAnswer.isPending}
          onClick={handleSubmit}
        >
          Valider mes années
        </Button>
      ) : (
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <CheckCircleIcon color="success" />
            <Typography color="success.main">
              {isHost ? 'Réponses enregistrées' : "En attente de l'hôte…"}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            disabled={submitAnswer.isPending}
            onClick={handleSubmit}
          >
            Mettre à jour les réponses
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

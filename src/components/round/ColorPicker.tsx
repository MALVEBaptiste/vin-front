import { useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Bottle } from '../../types/round.types';
import { RoundPhase } from '../../types/round.types';
import { useWineColors } from '../../hooks/useWineData';
import { useRound } from '../../hooks/useRound';
import { useGame } from '../../hooks/useGame';

const COLOR_HEX: Record<string, string> = {
  rouge: '#8B1A1A',
  rosé: '#E8A0BF',
  blanc: '#F5ECD7',
  jaune: '#DAA520',
  orange: '#D2691E',
};

interface ColorPickerProps {
  bottles: Bottle[];
  roundId: string;
}

export default function ColorPicker({ bottles, roundId }: ColorPickerProps) {
  const { data: colors = [] } = useWineColors();
  const { submitAnswer } = useRound();
  const { isHost } = useGame();

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (bottleId: string, color: string) => {
    setSelections((prev) => ({ ...prev, [bottleId]: color }));
  };

  const allSelected = bottles.every((b) => selections[b.id]);

  const handleSubmit = async () => {
    for (const bottle of bottles) {
      const color = selections[bottle.id];
      if (!color) continue;
      await submitAnswer.mutateAsync({
        roundId,
        bottleId: bottle.id,
        roundPhase: RoundPhase.COLOR,
        value: color,
      });
    }
    setSubmitted(true);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5" textAlign="center">
        Quelle couleur pour chaque bouteille ?
      </Typography>

      {bottles.map((bottle) => (
        <Box key={bottle.id}>
          <Typography variant="subtitle1" gutterBottom color="text.secondary">
            Bouteille {bottle.position}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {colors.map((color) => (
              <Card
                key={color}
                sx={{
                  width: 90,
                  border: selections[bottle.id] === color ? '2px solid' : '1px solid transparent',
                  borderColor: selections[bottle.id] === color ? 'secondary.main' : 'transparent',
                  opacity: submitAnswer.isPending ? 0.6 : 1,
                }}
              >
                <CardActionArea onClick={() => handleSelect(bottle.id, color)} disabled={submitAnswer.isPending}>
                  <CardContent sx={{ textAlign: 'center', py: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: COLOR_HEX[color] ?? '#888',
                        mx: 'auto',
                        mb: 0.5,
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    />
                    <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                      {color}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Box>
      ))}

      {!submitted ? (
        <Button
          variant="contained"
          disabled={!allSelected || submitAnswer.isPending}
          onClick={handleSubmit}
        >
          Valider mes couleurs
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

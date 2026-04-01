import { useState } from 'react';
import {
    Typography,
    Button,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    Divider,
    Box,
    Chip,
} from '@mui/material';
import type { Bottle } from '../../types/round.types';
import { useRound } from '../../hooks/useRound';
import { useWineColors, useWineGrapes } from '../../hooks/useWineData';

interface HostValidationFormProps {
  bottles: Bottle[];
  roundId: string;
  onValidated: (scores: Record<string, { points: number; bonus: boolean }>) => void;
}

interface BottleInput {
  trueColor: string;
  trueGrape: string[];
  trueGlassPosition: string;
}

export default function HostValidationForm({ bottles, roundId, onValidated }: HostValidationFormProps) {
  const { validateRound } = useRound();
  const { data: colors = [] } = useWineColors();
  const { data: grapes = [] } = useWineGrapes();

  const [inputs, setInputs] = useState<Record<number, BottleInput>>(
    Object.fromEntries(bottles.map((b) => [b.position, { trueColor: '', trueGrape: [], trueGlassPosition: '' }])),
  );

  const updateField = (position: number, field: keyof BottleInput, value: string | string[]) => {
    setInputs((prev) => ({
      ...prev,
      [position]: { ...prev[position], [field]: value },
    }));
  };

  const allFilled = bottles.every((b) => {
    const inp = inputs[b.position];
    return inp.trueColor && inp.trueGrape.length > 0 && inp.trueGlassPosition;
  });

  const handleValidate = async () => {
    const payload = bottles.map((b) => ({
      position: b.position,
      trueColor: inputs[b.position].trueColor,
      trueGrape: inputs[b.position].trueGrape.join(', '),
      trueGlassPosition: parseInt(inputs[b.position].trueGlassPosition, 10),
    }));
    const result = await validateRound.mutateAsync({ roundId, bottles: payload });
    onValidated(result.scores);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5" textAlign="center">
        Validation — Révélez les vins !
      </Typography>

      {bottles.map((bottle) => (
        <Paper key={bottle.id} sx={{ p: 2 }} elevation={1}>
          <Typography variant="subtitle1" color="secondary.main" gutterBottom>
            Bouteille {bottle.position}
          </Typography>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Couleur réelle</InputLabel>
              <Select
                value={inputs[bottle.position].trueColor}
                label="Couleur réelle"
                onChange={(e) => updateField(bottle.position, 'trueColor', e.target.value)}
              >
                {colors.map((c) => (
                  <MenuItem key={c} value={c} sx={{ textTransform: 'capitalize' }}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Cépages réels (multi-sélection)</InputLabel>
              <Select
                multiple
                value={inputs[bottle.position].trueGrape}
                label="Cépages réels (multi-sélection)"
                onChange={(e) => {
                  const value = e.target.value;
                  updateField(bottle.position, 'trueGrape', Array.isArray(value) ? value : [value]);
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} size="small" color="secondary" />
                    ))}
                  </Box>
                )}
              >
                {grapes.map((g) => (
                  <MenuItem key={g.id} value={g.name}>
                    {g.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Numéro de verre réel</InputLabel>
              <Select
                value={inputs[bottle.position].trueGlassPosition}
                label="Numéro de verre réel"
                onChange={(e) => updateField(bottle.position, 'trueGlassPosition', e.target.value)}
              >
                <MenuItem value="1">Verre 1</MenuItem>
                <MenuItem value="2">Verre 2</MenuItem>
                <MenuItem value="3">Verre 3</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>
      ))}

      <Divider />

      <Button
        variant="contained"
        color="secondary"
        onClick={handleValidate}
        disabled={!allFilled || validateRound.isPending}
        size="large"
      >
        Valider et calculer les scores
      </Button>
    </Stack>
  );
}

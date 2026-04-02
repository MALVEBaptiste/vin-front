import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  TextField,
  Alert,
  Tooltip
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { Bottle } from "../../types/round.types";
import { RoundPhase } from "../../types/round.types";
import { useWineGrapes } from "../../hooks/useWineData";
import { useRound } from "../../hooks/useRound";
import { useGame } from "../../hooks/useGame";

interface GrapePickerProps {
  bottles: Bottle[];
  roundId: string;
  colorSelections?: Record<string, string>;
}

export default function GrapePicker({
  bottles,
  roundId,
  
}: GrapePickerProps) {
  const { submitAnswer } = useRound();
  const { isHost } = useGame();
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [filter, setFilter] = useState("");
  const [activeBottle, setActiveBottle] = useState<string>(
    bottles[0]?.id ?? "",
  );

  // Récupérer la couleur sélectionnée pour la bouteille active (optionnel pour filtrer)
  const { data: grapes = [] } = useWineGrapes();

  const filtered = grapes.filter((g) =>
    g.name.toLowerCase().includes(filter.toLowerCase()) ||
    g.synonyms?.some((s) => s.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleToggle = (bottleId: string, grapeName: string) => {
    setSelections((prev) => {
      const current = prev[bottleId] ?? [];
      if (current.includes(grapeName)) {
        return { ...prev, [bottleId]: current.filter((g) => g !== grapeName) };
      }
      return { ...prev, [bottleId]: [...current, grapeName] };
    });
  };

  const allSelected = bottles.every((b) => (selections[b.id]?.length ?? 0) > 0);

  const handleSubmit = async () => {
    for (const bottle of bottles) {
      const grapeList = selections[bottle.id];
      if (!grapeList?.length) continue;
      await submitAnswer.mutateAsync({
        roundId,
        bottleId: bottle.id,
        roundPhase: RoundPhase.GRAPE,
        value: grapeList.join(", "),
      });
    }
    setSubmitted(true);
  };

  const activeSelections = selections[activeBottle] ?? [];

  return (
    <Stack spacing={3}>
      <Typography variant="h5" textAlign="center">
        Quel(s) cépage(s) pour chaque bouteille ?
      </Typography>

      <Alert severity="info" sx={{ bgcolor: 'info.lighter' }}>
        <Typography variant="body2">
          <strong>Cépages :</strong> +1 point par cépage trouvé. Malus si vous en indiquez plus que le vin ne contient.
        </Typography>
      </Alert>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
        {bottles.map((b) => {
          const sel = selections[b.id] ?? [];
          return (
            <Chip
              key={b.id}
              label={`Bouteille ${b.position}${sel.length ? ` (${sel.length})` : ""}`}
              onClick={() => setActiveBottle(b.id)}
              color={activeBottle === b.id ? "secondary" : "default"}
              variant={activeBottle === b.id ? "filled" : "outlined"}
              sx={{ whiteSpace: "nowrap" }}
            />
          );
        })}
      </Box>

      {activeSelections.length > 0 && (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mr: 1, alignSelf: "center" }}
          >
            Sélection :
          </Typography>
          {activeSelections.map((g) => (
            <Chip
              key={g}
              label={g}
              size="small"
              color="secondary"
              onDelete={() => handleToggle(activeBottle, g)}
            />
          ))}
        </Box>
      )}

      <TextField
        size="small"
        placeholder="Rechercher un cépage…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        disabled={submitAnswer.isPending}
      />

      <Box
        sx={{ maxHeight: 400, overflowY: "auto", width: "100%", display: "flex", gap: 1, flexWrap: "wrap" }}
      >
        {filtered.map((grape) => (
          <Tooltip
            key={grape.id}
            title={
              <Box sx={{ fontSize: '0.875rem' }}>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: 'white' }}>
                  {grape.name}
                </Typography>
                {grape.synonyms && grape.synonyms.length > 0 && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'white' }}>
                    <strong>Synonymes:</strong> {grape.synonyms.join(', ')}
                  </Typography>
                )}
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'white' }}>
                  <strong>Régions:</strong> {grape.regions.join(', ')}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'white' }}>
                  <strong>Arômes:</strong> {grape.aromas.join(', ')}
                </Typography>
              </Box>
            }
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: 'rgba(0, 0, 0, 0.85)',
                  maxWidth: '300px'
                }
              }
            }}
          >
            <Chip
              label={grape.name}
              onClick={() => handleToggle(activeBottle, grape.name)}
              color={activeSelections.includes(grape.name) ? "secondary" : "default"}
              variant={activeSelections.includes(grape.name) ? "filled" : "outlined"}
              disabled={submitAnswer.isPending}
              sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
            />
          </Tooltip>
        ))}
      </Box>

      {!submitted ? (
        <Button
          variant="contained"
          disabled={!allSelected || submitAnswer.isPending}
          onClick={handleSubmit}
        >
          Valider mes cépages
        </Button>
      ) : (
        <Stack spacing={1}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <CheckCircleIcon color="success" />
            <Typography color="success.main">
              {isHost ? "Réponses enregistrées" : "En attente de l'hôte…"}
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

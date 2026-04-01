import { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import {
    DndContext,
    type DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from '@dnd-kit/core';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GlassCard from './GlassCard';
import BottleSlot from './BottleSlot';
import type { Bottle } from '../../types/round.types';
import { RoundPhase } from '../../types/round.types';
import { useRound } from '../../hooks/useRound';
import { useGame } from '../../hooks/useGame';

interface MatchingBoardProps {
  bottles: Bottle[];
  roundId: string;
  onDone: () => void;
}

export default function MatchingBoard({ bottles, roundId }: MatchingBoardProps) {
  const { submitAnswer } = useRound();
  const { isHost } = useGame();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Maps bottleId -> glassPosition
  const [assignments, setAssignments] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const glasses = [1, 2, 3];
  const assignedGlasses = new Set(Object.values(assignments));
  const unassignedGlasses = glasses.filter((g) => !assignedGlasses.has(g));

  const handleDragEnd = (event: DragEndEvent) => {
    if (submitted) return;
    const { active, over } = event;
    
    if (!over) {
      // Dropped outside valid zone - reset to unassigned
      const glassPosition = Number(active.id);
      setAssignments((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((bId) => {
          if (updated[bId] === glassPosition) delete updated[bId];
        });
        return updated;
      });
      return;
    }

    const glassPosition = Number(active.id);
    const bottleId = String(over.id);

    // Unassign this glass from any previous bottle
    setAssignments((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((bId) => {
        if (updated[bId] === glassPosition) delete updated[bId];
      });
      // Assign to new bottle
      updated[bottleId] = glassPosition;
      return updated;
    });
  };

  const handleRemove = (bottleId: string) => {
    if (submitted) return;
    setAssignments((prev) => {
      const updated = { ...prev };
      delete updated[bottleId];
      return updated;
    });
  };

  const allAssigned = bottles.every((b) => assignments[b.id] !== undefined);

  const handleSubmit = async () => {
    for (const bottle of bottles) {
      const glassPosition = assignments[bottle.id];
      if (glassPosition === undefined) continue;
      await submitAnswer.mutateAsync({
        roundId,
        bottleId: bottle.id,
        roundPhase: RoundPhase.MATCHING,
        value: String(glassPosition),
      });
    }
    setSubmitted(true);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5" textAlign="center">
        Associez chaque verre à sa bouteille
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Glissez les verres vers les bouteilles correspondantes
      </Typography>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Glasses column */}
          <Box sx={{ minWidth: 140 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Verres
            </Typography>
            <Stack spacing={1}>
              {unassignedGlasses.map((pos) => (
                <GlassCard key={pos} id={String(pos)} position={pos} />
              ))}
            </Stack>
          </Box>

          {/* Bottles column */}
          <Box sx={{ minWidth: 180 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Bouteilles
            </Typography>
            <Stack spacing={1}>
              {bottles.map((b) => (
                <BottleSlot
                  key={b.id}
                  bottleId={b.id}
                  position={b.position}
                  assignedGlass={assignments[b.id] ?? null}
                  onRemove={!submitted && assignments[b.id] !== undefined ? () => handleRemove(b.id) : undefined}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </DndContext>

      {!submitted ? (
        <Button
          variant="contained"
          disabled={!allAssigned || submitAnswer.isPending}
          onClick={handleSubmit}
        >
          Valider mes associations
        </Button>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <CheckCircleIcon color="success" />
          <Typography color="success.main">
            {isHost ? 'Réponses enregistrées' : "En attente de l'hôte…"}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

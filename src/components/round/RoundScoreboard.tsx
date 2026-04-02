import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box, Divider,
  alpha
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getRoundScores,
  getPlayerAnswers,
  getGameLeaderboard,
} from "../../api/round.api";
import { RoundPhaseLabels } from "../../types/round.types";
import { WineLoader } from "../common/WineLoader";

interface RoundScoreboardProps {
  roundId: string;
  gameCode: string;
  validationScores?: Record<string, { points: number; bonus: boolean }>;
}

export default function RoundScoreboard({
  roundId,
  gameCode,
  validationScores,
}: RoundScoreboardProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const { data: scores = [] } = useQuery({
    queryKey: ["round-scores", roundId],
    queryFn: () => getRoundScores(roundId),
    enabled: !validationScores,
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ["game-leaderboard", gameCode],
    queryFn: () => getGameLeaderboard(gameCode),
  });

  const { data: playerAnswersData, isLoading: answersLoading } = useQuery({
    queryKey: ["player-answers", roundId, selectedPlayerId],
    queryFn: () => getPlayerAnswers(roundId, selectedPlayerId!),
    enabled: !!selectedPlayerId,
  });

  // Get username from leaderboard
  const getUsernameById = (playerId: string) => {
    return leaderboard.find((l) => l.playerId === playerId)?.username || playerId;
  };

  // Merge validation scores if we just validated
  const displayScores = validationScores
    ? Object.entries(validationScores)
        .map(([playerId, s]) => ({
          playerId,
          username: getUsernameById(playerId),
          points: s.points,
          bonus: s.bonus,
        }))
        .sort((a, b) => b.points - a.points)
    : scores.map((s) => ({ ...s, bonus: false }));

  // Get cumulative points for each player
  const getCumulativePoints = (playerId: string) => {
    return leaderboard.find((l) => l.playerId === playerId)?.totalPoints || 0;
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" textAlign="center">
        <EmojiEventsIcon
          sx={{ color: "secondary.main", mr: 1, verticalAlign: "middle" }}
        />
        Scores de la manche
      </Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Joueur</TableCell>
              <TableCell align="right">Manche</TableCell>
              <TableCell align="right">Cumul</TableCell>
              <TableCell align="center">Bonus</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayScores.map((entry, i) => (
              <TableRow
                key={entry.playerId}
                onClick={() => setSelectedPlayerId(entry.playerId)}
                sx={{
                  ...(i === 0
                    ? { bgcolor: "rgba(201,168,76,0.1)" }
                    : undefined),
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <Typography fontWeight={i === 0 ? 700 : 400}>
                    {entry.username}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    fontWeight={700}
                    color={i === 0 ? "secondary.main" : "text.primary"}
                  >
                    {entry.points}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight={700} color="secondary.main">
                    {getCumulativePoints(entry.playerId)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {entry.bonus && (
                    <Chip
                      label="+3"
                      color="success"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Player Answers Dialog */}
      <Dialog
        open={!!selectedPlayerId}
        onClose={() => setSelectedPlayerId(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Historique des réponses —{" "}
          {selectedPlayerId &&
            displayScores.find((s) => s.playerId === selectedPlayerId)
              ?.username}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {answersLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <WineLoader size="medium" />
            </Box>
          ) : (
            <Stack spacing={2}>
              {playerAnswersData?.playerAnswers.map((answer, idx) => (
                <Box key={idx}>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: answer.isCorrect
                        ? "success.main"
                        : "error.main",
                      borderRadius: 1,
                      bgcolor: answer.isCorrect
                        ? "rgba(46,107,82,0.1)"
                        : "rgba(179,58,58,0.1)",
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack direction="row" alignItems="center" gap={1}>
                          {answer.isCorrect ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <CancelIcon color="error" />
                          )}
                          <Typography fontWeight={600}>
                            Bouteille {answer.bottlePosition} —{" "}
                            {
                              RoundPhaseLabels[
                                answer.roundPhase as keyof typeof RoundPhaseLabels
                              ]
                            }
                          </Typography>
                        </Stack>
                        <Chip
                          label={`${answer.points} pt`}
                          color={answer.isCorrect ? "success" : "error"}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </Stack>
                      <Box sx={{ pl: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          Réponse: <strong>{answer.playerValue}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Correct: <strong>{answer.trueValue}</strong>
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  {idx % 4 === 3 && <Divider sx={{ borderColor: (theme) => alpha(theme.palette.divider, 0.2), mt: 2, borderWidth: 3, borderRadius: 2}} />}
                </Box>
              ))}
              
              {playerAnswersData && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "rgba(201,168,76,0.1)",
                    borderRadius: 1,
                    border: "2px solid",
                    borderColor: "secondary.main",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    textAlign="center"
                  >
                    Total:{" "}
                    <span
                      style={{ color: "var(--mui-palette-secondary-main)" }}
                    >
                      {playerAnswersData.totalPoints} points
                    </span>
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setSelectedPlayerId(null)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

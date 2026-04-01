import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Stack, Alert } from '@mui/material';
import PageContainer from '../components/layout/PageContainer';
import WaitingRoom from '../components/game/WaitingRoom';
import RoundPhaseIndicator from '../components/round/RoundPhaseIndicator';
import ColorPicker from '../components/round/ColorPicker';
import GrapePicker from '../components/round/GrapePicker';
import MatchingBoard from '../components/round/MatchingBoard';
import HostValidationForm from '../components/round/HostValidationForm';
import RoundScoreboard from '../components/round/RoundScoreboard';
import { useGame } from '../hooks/useGame';
import { useRound } from '../hooks/useRound';
import { useGamePolling } from '../hooks/useGamePolling';
import { getGame } from '../api/game.api';
import { getCurrentRound } from '../api/round.api';
import { GameStatus } from '../types/game.types';
import { RoundStatus } from '../types/round.types';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { WineLoader } from '../components/common/WineLoader';

export default function GameRoomPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { currentGame, currentRound, isHost, setCurrentGame, setCurrentRound } = useGame();
  const { startRound, advancePhase, endGame } = useRound();
  const [validationScores, setValidationScores] = useState<Record<string, { points: number; bonus: boolean }> | null>(null);
  const [loading, setLoading] = useState(true);
  const [advanceError, setAdvanceError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    if (!code) return;
    (async () => {
      try {
        const [game, round] = await Promise.all([
          getGame(code),
          getCurrentRound(code),
        ]);
        setCurrentGame(game);
        if (round) setCurrentRound(round);
      } catch {
        navigate('/lobby');
      } finally {
        setLoading(false);
      }
    })();
  }, [code, setCurrentGame, setCurrentRound, navigate]);

  // Polling
  useGamePolling();

  if (loading) {
    return (
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <WineLoader size="medium" />
        </Box>
      </PageContainer>
    );
  }

  if (!currentGame) return null;

  const isWaiting = currentGame.status === GameStatus.WAITING && !currentRound;
  const isFinished = currentGame.status === GameStatus.FINISHED;

  return (
    <PageContainer maxWidth={700}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" color="secondary.main">
            Partie {currentGame.code}
          </Typography>
          {currentRound && (
            <Typography variant="subtitle1" color="text.secondary">
              Manche {currentRound.roundNumber}
            </Typography>
          )}
        </Box>

        {/* Waiting */}
        {isWaiting && <WaitingRoom />}

        {/* Round active */}
        {currentRound && (
          <>
            <RoundPhaseIndicator status={currentRound.status} />

            <Paper elevation={3} sx={{ p: 3 }}>
              {/* COLOR Phase */}
              {currentRound.status === RoundStatus.COLOR && (
                <ColorPicker
                  bottles={currentRound.bottles}
                  roundId={currentRound.id}
                  onDone={() => {}}
                />
              )}

              {/* GRAPE Phase */}
              {currentRound.status === RoundStatus.GRAPE && (
                <GrapePicker
                  bottles={currentRound.bottles}
                  roundId={currentRound.id}
                  onDone={() => {}}
                />
              )}

              {/* MATCHING Phase */}
              {currentRound.status === RoundStatus.MATCHING && (
                <MatchingBoard
                  bottles={currentRound.bottles}
                  roundId={currentRound.id}
                  onDone={() => {}}
                />
              )}

              {/* SCORING Phase — Host validates */}
              {currentRound.status === RoundStatus.SCORING && isHost && !validationScores && (
                <HostValidationForm
                  bottles={currentRound.bottles}
                  roundId={currentRound.id}
                  onValidated={(scores) => setValidationScores(scores)}
                />
              )}

              {/* SCORING Phase — Players wait */}
              {currentRound.status === RoundStatus.SCORING && !isHost && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <WineLoader size="medium" />
                  <Typography color="text.secondary" sx={{ mt: 2 }}>
                    L'hôte valide les réponses…
                  </Typography>
                </Box>
              )}

              {/* DONE — Show scores */}
              {(currentRound.status === RoundStatus.DONE || validationScores) && (
                <RoundScoreboard roundId={currentRound.id} gameCode={currentGame.code} validationScores={validationScores ?? undefined} />
              )}
            </Paper>

            {/* Host controls */}
            {isHost && (
              <Stack direction="column" spacing={2} alignItems="center">
                {advanceError && (
                  <Alert severity="warning" sx={{ width: '100%' }}>
                    {advanceError}
                  </Alert>
                )}

                <Stack direction="row" spacing={2} justifyContent="center"
                  >
                {[RoundStatus.COLOR, RoundStatus.GRAPE, RoundStatus.MATCHING].includes(currentRound.status) && (
                  <>
                    <Button
                      variant="outlined"
                      color="secondary"
                      endIcon={<NavigateNextIcon />}
                      onClick={() => {
                        setAdvanceError(null);
                        advancePhase.mutate(
                          { roundId: currentRound.id, force: false },
                          {
                            onError: (error: Error) => {
                              const httpError = error as unknown as {
                                response?: { data?: { message?: string } };
                              };
                              setAdvanceError(
                                httpError.response?.data?.message || error.message || 'Erreur'
                              );
                            },
                          },
                        );
                      }}
                      disabled={advancePhase.isPending}
                    >
                      Phase suivante
                    </Button>

                    {advanceError && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setAdvanceError(null);
                          advancePhase.mutate({ roundId: currentRound.id, force: true });
                        }}
                        disabled={advancePhase.isPending}
                      >
                        Forcer
                      </Button>
                    )}
                  </>
                )}

                {currentRound.status === RoundStatus.DONE && (
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      onClick={() => {
                        setValidationScores(null);
                        startRound.mutate();
                      }}
                      disabled={startRound.isPending}
                    >
                      Manche suivante
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        endGame.mutate();
                        navigate(`/game/${currentGame.code}/leaderboard`);
                      }}
                      disabled={endGame.isPending}
                    >
                      Terminer la partie
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Stack>
            )}

            {/* All players can view leaderboard when round is done */}
            {currentRound.status === RoundStatus.DONE && (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<LeaderboardIcon />}
                onClick={() => navigate(`/game/${currentGame.code}/leaderboard`)}
                sx={{ alignSelf: 'center' }}
              >
                Voir le classement
              </Button>
            )}
          </>
        )}

        {/* Finished */}
        {isFinished && (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom color="secondary.main">
              Partie terminée !
            </Typography>
            <Button
              variant="contained"
              startIcon={<LeaderboardIcon />}
              onClick={() => navigate(`/game/${currentGame.code}/leaderboard`)}
            >
              Voir le classement final
            </Button>
          </Paper>
        )}
      </Stack>
    </PageContainer>
  );
}

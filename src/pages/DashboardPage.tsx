import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../hooks/useAuth';
import { getPlayerHistory, getGameResult } from '../api/game.api';
import { GameStatus } from '../types/game.types';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';
import { WineLoader } from '../components/common/WineLoader';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedGameCode, setSelectedGameCode] = useState<string | null>(null);

  const { data: games = [], isLoading } = useQuery({
    queryKey: ['player-history'],
    queryFn: () => getPlayerHistory(),
  });

  const { data: gameResults } = useQuery({
    queryKey: ['game-result', selectedGameCode],
    queryFn: () => getGameResult(selectedGameCode!),
    enabled: !!selectedGameCode,
  });

  const finishedGames = games.filter((g) => g.status === GameStatus.FINISHED);
  if (isLoading) {
    return (
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <WineLoader size="medium" />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth={900}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" color="secondary.main" gutterBottom>
            <LeaderboardIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Tableau de bord
          </Typography>
          <Typography color="text.secondary">
            Bienvenue, <strong>{user?.username}</strong>
          </Typography>
        </Box>

        {/* Stats */}
        <Stack direction="row" spacing={2} justifyContent="space-around">
          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', flex: 1 }}>
            <Typography variant="h5" color="secondary.main">
              {finishedGames.length}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Parties terminées
            </Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', flex: 1 }}>
            <Typography variant="h5" color="secondary.main">
              {finishedGames.reduce((sum) => {
                const rank = gameResults?.find((r) => r.playerId === user?.id);
                return sum + (rank?.totalPoints || 0);
              }, 0)}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Points totaux
            </Typography>
          </Paper>
        </Stack>
              
        {/* Games History */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon sx={{ fontSize: '1.2em' }} />
            Historique des parties
          </Typography>

          {finishedGames.length === 0 ? (
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Vous n'avez pas encore participé à une partie terminée.
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(201,168,76,0.1)' }}>
                    <TableCell>Partie</TableCell>
                    <TableCell align="right">Classement</TableCell>
                    <TableCell align="right">Points</TableCell>
                    <TableCell align="right">Manches</TableCell>
                    <TableCell align="center">Détails</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {finishedGames.map((game) => {
                    const gameResult = gameResults?.find(
                      (r) => r.playerId === user?.id && selectedGameCode === game.code
                    );

                    return (
                      <TableRow
                        key={game.code}
                        sx={{
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                          cursor: 'pointer',
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight={600}>{game.code}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(game.finishedAt!).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => setSelectedGameCode(game.code)}
                            sx={{ textTransform: 'none' }}
                          >
                            <Typography
                              fontWeight={700}
                              color="secondary.main"
                              sx={{
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' },
                              }}
                            >
                              Charger...
                            </Typography>
                          </Button>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={700}>
                            {selectedGameCode === game.code && gameResult
                              ? gameResult.totalPoints
                              : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography color="text.secondary">
                            {game.players?.length || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => navigate(`/game/${game.code}/leaderboard`)}
                          >
                            Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {/* Game Results Modal */}
        {selectedGameCode && gameResults && (
          <Dialog
            open={!!selectedGameCode}
            onClose={() => setSelectedGameCode(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Classement — Partie {selectedGameCode}
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Stack spacing={1}>
                {gameResults.map((result) => (
                  <Paper
                    key={result.playerId}
                    elevation={result.playerId === user?.id ? 3 : 1}
                    sx={{
                      p: 2,
                      bgcolor:
                        result.playerId === user?.id
                          ? 'rgba(201,168,76,0.15)'
                          : undefined,
                      border:
                        result.playerId === user?.id
                          ? '2px solid'
                          : '1px solid',
                      borderColor:
                        result.playerId === user?.id
                          ? 'secondary.main'
                          : 'divider',
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" gap={2} alignItems="center" flex={1}>
                        <Chip
                          label={result.rank}
                          color={
                            result.rank === 1
                              ? 'secondary'
                              : 'default'
                          }
                          size="small"
                          sx={{
                            fontWeight: 700,
                            minWidth: 50,
                          }}
                        />
                        <Typography
                          fontWeight={
                            result.playerId === user?.id ? 700 : 400
                          }
                        >
                          {result.username}
                        </Typography>
                      </Stack>
                      <Typography
                        fontWeight={700}
                        color={
                          result.playerId === user?.id
                            ? 'secondary.main'
                            : 'text.primary'
                        }
                        sx={{ fontSize: '1.2em' }}
                      >
                        {result.totalPoints}
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => setSelectedGameCode(null)}>Fermer</Button>
            </DialogActions>
          </Dialog>
        )}
      </Stack>
    </PageContainer>
  );
}

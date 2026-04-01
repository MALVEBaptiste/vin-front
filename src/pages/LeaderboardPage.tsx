import { useParams, useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Stack,
    CircularProgress,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageContainer from '../components/layout/PageContainer';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../api/game.api';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', code],
    queryFn: () => getLeaderboard(code!),
    enabled: !!code,
  });

  return (
    <PageContainer maxWidth={600}>
      <Stack spacing={3}>
        <Typography variant="h4" textAlign="center" color="secondary.main">
          <EmojiEventsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Classement
        </Typography>

        {isLoading ? (
          <CircularProgress color="secondary" sx={{ mx: 'auto' }} />
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Joueur</TableCell>
                  <TableCell align="right">Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard?.map((entry, i) => (
                  <TableRow
                    key={entry.playerId}
                    sx={i < 3 ? { bgcolor: 'rgba(201,168,76,0.08)' } : undefined}
                  >
                    <TableCell>
                      <Typography variant="body1">
                        {i < 3 ? MEDALS[i] : i + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={i === 0 ? 700 : 400}>
                        {entry.username}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        fontWeight={700}
                        color={i === 0 ? 'secondary.main' : 'text.primary'}
                        variant="h6"
                      >
                        {entry.totalPoints}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/game/${code}`)}
        >
          Retour à la partie
        </Button>

        <Button variant="text" color="secondary" onClick={() => navigate('/lobby')}>
          Retour au lobby
        </Button>
      </Stack>
    </PageContainer>
  );
}

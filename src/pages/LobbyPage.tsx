import { Paper, Typography, Stack, Divider } from '@mui/material';
import PageContainer from '../components/layout/PageContainer';
import CreateGameButton from '../components/game/CreateGameButton';
import JoinGameForm from '../components/game/JoinGameForm';

export default function LobbyPage() {
  return (
    <PageContainer maxWidth={500}>
      <Stack spacing={4}>
        <Typography variant="h3" textAlign="center" color="secondary.main">
          Dégustation
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary">
          Créez une partie ou rejoignez-en une avec un code
        </Typography>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Stack spacing={3}>
            <CreateGameButton />
            <Divider sx={{ '&::before, &::after': { borderColor: 'text.secondary' } }}>
              <Typography variant="body2" color="text.secondary">
                ou
              </Typography>
            </Divider>
            <JoinGameForm />
          </Stack>
        </Paper>
      </Stack>
    </PageContainer>
  );
}

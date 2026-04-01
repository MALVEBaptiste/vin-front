import { useState } from 'react';
import { TextField, Button, Stack, Alert } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { joinGame } from '../../api/game.api';
import { useGame } from '../../hooks/useGame';
import { useNavigate } from 'react-router-dom';

export default function JoinGameForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCurrentGame } = useGame();
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (code.length < 6) return;
    setLoading(true);
    setError('');
    try {
      const game = await joinGame(code.toUpperCase());
      setCurrentGame(game);
      navigate(`/game/${game.code}`);
    } catch {
      setError('Partie introuvable ou déjà terminée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Code de la partie"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        slotProps={{ htmlInput: { maxLength: 6, style: { textTransform: 'uppercase', letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.2rem' } } }}
      />
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<LoginIcon />}
        onClick={handleJoin}
        disabled={loading || code.length < 6}
        fullWidth
      >
        Rejoindre
      </Button>
    </Stack>
  );
}

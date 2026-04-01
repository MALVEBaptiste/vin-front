import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createGame } from '../../api/game.api';
import { useGame } from '../../hooks/useGame';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CreateGameButton() {
  const { setCurrentGame, setCurrentRound } = useGame();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const game = await createGame();
      setCurrentRound(null);
      setCurrentGame(game);
      navigate(`/game/${game.code}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      size="large"
      startIcon={<AddIcon />}
      onClick={handleCreate}
      disabled={loading}
      fullWidth
    >
      Créer une partie
    </Button>
  );
}

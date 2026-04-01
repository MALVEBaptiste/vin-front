import { useQuery } from '@tanstack/react-query';
import { getGame } from '../api/game.api';
import { getCurrentRound } from '../api/round.api';
import { useGame } from './useGame';

export function useGamePolling() {
  const { currentGame, setCurrentGame, setCurrentRound } = useGame();

  return useQuery({
    queryKey: ['game', currentGame?.code],
    queryFn: async () => {
      if (!currentGame) return null;
      const [game, round] = await Promise.all([
        getGame(currentGame.code),
        getCurrentRound(currentGame.code),
      ]);
      setCurrentGame(game);
      if (round) setCurrentRound(round);
      return game;
    },
    enabled: !!currentGame,
    refetchInterval: 3000,
    refetchIntervalInBackground: false,
  });
}

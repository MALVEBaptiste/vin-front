import {
    createContext,
    useState,
    useCallback,
    type ReactNode,
} from 'react';
import type { Game } from '../types/game.types';
import type { Round } from '../types/round.types';
import * as gameApi from '../api/game.api';
import { useAuth } from '../hooks/useAuth';

export interface GameContextValue {
  currentGame: Game | null;
  currentRound: Round | null;
  isHost: boolean;
  setCurrentGame: (game: Game | null) => void;
  setCurrentRound: (round: Round | null) => void;
  refreshGame: () => Promise<void>;
}

export const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);

  const isHost = !!(user && currentGame && currentGame.hostId === user.id);

  const refreshGame = useCallback(async () => {
    if (!currentGame) return;
    const game = await gameApi.getGame(currentGame.code);
    setCurrentGame(game);
  }, [currentGame]);

  return (
    <GameContext.Provider
      value={{
        currentGame,
        currentRound,
        isHost,
        setCurrentGame,
        setCurrentRound,
        refreshGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

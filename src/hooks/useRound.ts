import { useMutation } from '@tanstack/react-query';
import * as roundApi from '../api/round.api';
import * as gameApi from '../api/game.api';
import { useGame } from './useGame';

export function useRound() {
  const { currentGame, setCurrentRound, setCurrentGame } = useGame();

  const startRound = useMutation({
    mutationFn: () => {
      if (!currentGame) throw new Error('No game');
      return roundApi.startRound(currentGame.code);
    },
    onSuccess: (round) => setCurrentRound(round),
  });

  const submitAnswer = useMutation({
    mutationFn: (data: { roundId: string; bottleId: string; roundPhase: string; value: string }) =>
      roundApi.submitAnswer(data.roundId, {
        bottleId: data.bottleId,
        roundPhase: data.roundPhase,
        value: data.value,
      }),
  });

  const advancePhase = useMutation({
    mutationFn: (props: { roundId: string; force?: boolean }) =>
      roundApi.advancePhase(props.roundId, props.force),
    onSuccess: (round) => setCurrentRound(round),
  });

  const validateRound = useMutation({
    mutationFn: (data: {
      roundId: string;
      bottles: { position: number; trueColor: string; trueGrape: string; trueGlassPosition: number; trueYear: number }[];
    }) => roundApi.validateRound(data.roundId, data.bottles),
  });

  const endGame = useMutation({
    mutationFn: () => {
      if (!currentGame) throw new Error('No game');
      return gameApi.endGame(currentGame.code);
    },
    onSuccess: (game) => setCurrentGame(game),
  });

  return { startRound, submitAnswer, advancePhase, validateRound, endGame };
}

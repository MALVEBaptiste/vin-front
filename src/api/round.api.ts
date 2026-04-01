import client from './client';
import type { Round, Answer, ScoreEntry } from '../types/round.types';

export const startRound = (gameCode: string) =>
  client.post<Round>(`/rounds/${gameCode}/start`).then((r) => r.data);

export const getCurrentRound = (gameCode: string) =>
  client.get<Round | null>(`/rounds/${gameCode}/current`).then((r) => r.data);

export const submitAnswer = (
  roundId: string,
  data: { bottleId: string; roundPhase: string; value: string },
) => client.post<Answer>(`/rounds/${roundId}/answer`, data).then((r) => r.data);

export const advancePhase = (roundId: string, force: boolean = false) =>
  client.patch<Round>(`/rounds/${roundId}/phase`, { force }).then((r) => r.data);

export const validateRound = (
  roundId: string,
  bottles: { position: number; trueColor: string; trueGrape: string; trueGlassPosition: number; trueYear: number }[],
) =>
  client
    .post<{ scores: Record<string, { points: number; bonus: boolean }> }>(
      `/rounds/${roundId}/validate`,
      { bottles },
    )
    .then((r) => r.data);

export const getRoundScores = (roundId: string) =>
  client.get<ScoreEntry[]>(`/rounds/${roundId}/scores`).then((r) => r.data);

export const getPlayerAnswers = (roundId: string, playerId: string) =>
  client
    .get<{
      playerAnswers: Array<{
        bottlePosition: number;
        roundPhase: string;
        playerValue: string;
        trueValue: string;
        isCorrect: boolean;
        points: number;
      }>;
      totalPoints: number;
    }>(`/rounds/${roundId}/player/${playerId}/answers`)
    .then((r) => r.data);

export const getGameLeaderboard = (gameCode: string) =>
  client
    .get<Array<{ playerId: string; username: string; totalPoints: number }>>(
      `/games/${gameCode}/leaderboard`,
    )
    .then((r) => r.data);

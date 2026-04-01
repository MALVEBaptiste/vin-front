import client from './client';
import type { Game } from '../types/game.types';
import type { LeaderboardEntry } from '../types/game.types';

export const createGame = () =>
  client.post<Game>('/games').then((r) => r.data);

export const joinGame = (code: string) =>
  client.post<Game>(`/games/${code}/join`).then((r) => r.data);

export const getGame = (code: string) =>
  client.get<Game>(`/games/${code}`).then((r) => r.data);

export const endGame = (code: string) =>
  client.delete<Game>(`/games/${code}`).then((r) => r.data);

export const getLeaderboard = (code: string) =>
  client.get<LeaderboardEntry[]>(`/games/${code}/leaderboard`).then((r) => r.data);

export const getPlayerHistory = () =>
  client.get<Game[]>('/games/player/history').then((r) => r.data);

export interface GameResult {
  playerId: string;
  username: string;
  totalPoints: number;
  rank: number;
}

export const getGameResult = (code: string) =>
  client.get<GameResult[]>(`/games/${code}/result`).then((r) => r.data);

import type { Player } from './auth.types';

export enum GameStatus {
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export interface GamePlayer {
  id: string;
  gameId: string;
  playerId: string;
  player: Player;
}

export interface Game {
  id: string;
  code: string;
  status: GameStatus;
  hostId: string;
  host: Player;
  players: Player[];
  createdAt: string;
  finishedAt: string | null;
}

export interface LeaderboardEntry {
  playerId: string;
  username: string;
  totalPoints: number;
}

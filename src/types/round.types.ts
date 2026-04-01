export enum RoundStatus {
  PENDING = 'PENDING',
  COLOR = 'COLOR',
  GRAPE = 'GRAPE',
  YEAR = 'YEAR',
  MATCHING = 'MATCHING',
  SCORING = 'SCORING',
  DONE = 'DONE',
}

export enum RoundPhase {
  COLOR = 'COLOR',
  GRAPE = 'GRAPE',
  YEAR = 'YEAR',
  MATCHING = 'MATCHING',
}

export const RoundPhaseLabels: Record<RoundPhase, string> = {
  [RoundPhase.COLOR]: 'Couleur',
  [RoundPhase.GRAPE]: 'Cépage',
  [RoundPhase.YEAR]: 'Année',
  [RoundPhase.MATCHING]: 'Association',
};

export interface Bottle {
  id: string;
  roundId: string;
  position: number;
  trueColor: string | null;
  trueGrape: string | null;
  trueName: string | null;
  trueYear: number | null;
}

export interface Answer {
  id: string;
  playerId: string;
  bottleId: string;
  roundPhase: RoundPhase;
  value: string;
  isCorrect: boolean | null;
  points: number;
}

export interface Round {
  id: string;
  gameId: string;
  roundNumber: number;
  status: RoundStatus;
  bottles: Bottle[];
}

export interface ScoreEntry {
  playerId: string;
  username: string;
  points: number;
}

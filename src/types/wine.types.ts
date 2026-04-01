export type WineColor = 'rouge' | 'rosé' | 'blanc' | 'jaune' | 'orange';

export interface Grape {
  id: string;
  name: string;
  colors: string[];
}

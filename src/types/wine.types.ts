export type WineColor = 'rouge' | 'rosé' | 'blanc' | 'jaune' | 'orange';

export interface Grape {
  id: string;
  name: string;
  color: 'rouge' | 'blanc';
  synonyms?: string[];
  regions: string[];
  aromas: string[];
}

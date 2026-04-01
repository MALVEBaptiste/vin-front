import client from './client';
import type { Grape, WineColor } from '../types/wine.types';

export const getColors = () =>
  client.get<WineColor[]>('/wines/colors').then((r) => r.data);

export const getGrapes = (color?: string) =>
  client
    .get<Grape[]>('/wines/grapes', { params: color ? { color } : undefined })
    .then((r) => r.data);

import client from './client';
import type { Grape, WineColor } from '../types/wine.types';

export const getColors = () =>
  client.get<WineColor[]>('/wines/colors').then((r) => r.data);

export const getGrapes = () =>
  client
    .get<Grape[]>('/wines/grapes')
    .then((r) => r.data);

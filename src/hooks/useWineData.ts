import { useQuery } from '@tanstack/react-query';
import { getColors, getGrapes } from '../api/wine.api';

export function useWineColors() {
  return useQuery({
    queryKey: ['wine-colors'],
    queryFn: getColors,
    staleTime: Infinity,
  });
}

export function useWineGrapes(color?: string) {
  return useQuery({
    queryKey: ['wine-grapes', color],
    queryFn: () => getGrapes(),
    staleTime: 5 * 60 * 1000,
  });
}

import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { SupperEvent } from '../types/event';
import type { SupperPackage } from '../types/package';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await api.get<SupperEvent[]>('/events');
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function usePackages() {
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data } = await api.get<SupperPackage[]>('/packages');
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

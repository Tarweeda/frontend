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

export function usePackages(eventId?: string | null) {
  return useQuery({
    queryKey: ['packages', eventId],
    queryFn: async () => {
      const url = eventId ? `/packages?event_id=${eventId}` : '/packages';
      const { data } = await api.get<SupperPackage[]>(url);
      return data;
    },
    enabled: !!eventId,
    staleTime: 10 * 60 * 1000,
  });
}

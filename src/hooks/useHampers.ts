import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { GiftHamper } from '../types/hamper';
import type { HireRole } from '../types/hire';

export function useHampers() {
  return useQuery({
    queryKey: ['hampers'],
    queryFn: async () => {
      const { data } = await api.get<GiftHamper[]>('/hampers');
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useHireRoles() {
  return useQuery({
    queryKey: ['hire-roles'],
    queryFn: async () => {
      const { data } = await api.get<HireRole[]>('/hire/roles');
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

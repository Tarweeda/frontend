import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Product } from '../types/product';

export function useProducts(category?: 'staples' | 'pantry') {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      const params = category ? { category } : {};
      const { data } = await api.get<Product[]>('/products', { params });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

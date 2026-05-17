import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Product } from '../types/product';

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${slug}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
}

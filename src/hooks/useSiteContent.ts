import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { SITE_CONTENT_DEFAULTS, type SiteContent } from '../content/siteContent';

type SiteContentOverrides = Partial<Record<keyof SiteContent, Record<string, unknown>>>;

export function useSiteContent() {
  return useQuery({
    queryKey: ['site-content'],
    queryFn: async () => {
      const { data } = await api.get<SiteContentOverrides>('/site-content');
      return data ?? {};
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Returns a fully-populated section object: the DB override (if any) shallow-merged
 * over the code default. Arrays are replaced wholesale (no deep merge). While the
 * query is loading, returns the default — so there's no flash of empty content.
 */
export function useSection<K extends keyof SiteContent>(key: K): SiteContent[K] {
  const { data } = useSiteContent();
  const override = data?.[key];
  if (!override || Object.keys(override).length === 0) {
    return SITE_CONTENT_DEFAULTS[key];
  }
  return { ...SITE_CONTENT_DEFAULTS[key], ...override } as SiteContent[K];
}

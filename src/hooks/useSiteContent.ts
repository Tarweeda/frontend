import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { SITE_CONTENT_DEFAULTS, type SiteContent } from '../content/siteContent';
import type { SiteLayout } from '../content/sectionRegistry';
import { IS_PREVIEW } from '../preview/previewMode';
import { usePreviewStore } from '../preview/previewStore';

// The site-content endpoint returns per-section overrides keyed by section name, plus the
// reserved `_layout` row (order + visibility). `_layout` is handled by `useLayout`.
type SiteContentOverrides = Partial<Record<keyof SiteContent, Record<string, unknown>>> & {
  _layout?: SiteLayout;
};

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
 *
 * In preview mode it prefers the live editor draft for this section (if present), so the
 * iframe updates as the admin types. The extra store subscription is always called
 * (IS_PREVIEW is constant per page load) to satisfy rules-of-hooks.
 */
export function useSection<K extends keyof SiteContent>(key: K): SiteContent[K] {
  const { data } = useSiteContent();

  const draft = usePreviewStore((s) =>
    IS_PREVIEW ? (s.overrides[key] as SiteContent[K] | undefined) : undefined,
  );
  if (IS_PREVIEW && draft) {
    return draft;
  }

  const override = data?.[key];
  if (!override || Object.keys(override).length === 0) {
    return SITE_CONTENT_DEFAULTS[key];
  }
  return { ...SITE_CONTENT_DEFAULTS[key], ...override } as SiteContent[K];
}

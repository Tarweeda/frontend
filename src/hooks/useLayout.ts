import { useSiteContent } from './useSiteContent';
import {
  LAYOUT_KEY,
  resolveLayout,
  type SectionLayoutItem,
  type SiteLayout,
} from '../content/sectionRegistry';
import { IS_PREVIEW } from '../preview/previewMode';
import { usePreviewStore } from '../preview/previewStore';

/**
 * Resolved homepage section layout (order + visibility).
 *
 * Reads the `_layout` override from the site-content query and reconciles it against the
 * registry via `resolveLayout`. In preview mode it prefers a live draft `_layout` pushed
 * from the editor, so reorder/hide reflect in the iframe before saving.
 */
export function useLayout(): SectionLayoutItem[] {
  const { data } = useSiteContent();

  // Always call the store hook (IS_PREVIEW is constant per page load, so this is
  // a stable branch and safe under rules-of-hooks). Ignore it outside preview.
  const draftLayout = usePreviewStore((s) =>
    IS_PREVIEW ? (s.overrides[LAYOUT_KEY] as SiteLayout | undefined) : undefined,
  );

  if (IS_PREVIEW && draftLayout) {
    return resolveLayout(draftLayout);
  }

  const saved = data?.[LAYOUT_KEY] as SiteLayout | undefined;
  return resolveLayout(saved);
}

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useSiteContent } from '../../../hooks/useSiteContent';
import { SITE_CONTENT_DEFAULTS, type SiteContent } from '../../../content/siteContent';
import {
  LAYOUT_KEY,
  SECTION_REGISTRY,
  CHROME_SECTIONS,
  resolveLayout,
  type SectionLayoutItem,
  type SiteLayout,
} from '../../../content/sectionRegistry';
import { useToastStore } from '../../../store/toast';
import { Spinner } from '../../../components/ui/Spinner';
import { SectionList } from './SectionList';
import { SectionSettings } from './SectionSettings';
import { SaveBar } from './SaveBar';
import { usePreviewBridgeHost } from './usePreviewBridgeHost';
import './SiteEditor.css';

type SectionKey = keyof SiteContent;

// Every editorKey that has a form (homepage sections + chrome).
const EDITOR_KEYS: SectionKey[] = [
  ...Object.values(SECTION_REGISTRY).map((e) => e.editorKey).filter(Boolean) as SectionKey[],
  ...CHROME_SECTIONS.map((c) => c.editorKey),
];
const UNIQUE_EDITOR_KEYS = Array.from(new Set(EDITOR_KEYS));

const stable = (v: unknown) => JSON.stringify(v);

/** Merge a DB override over the code default for one section (matches useSection). */
function mergeSection<K extends SectionKey>(key: K, override?: Record<string, unknown>): SiteContent[K] {
  if (!override || Object.keys(override).length === 0) return SITE_CONTENT_DEFAULTS[key];
  return { ...SITE_CONTENT_DEFAULTS[key], ...override } as SiteContent[K];
}

export function SiteEditor() {
  const { data, isLoading } = useSiteContent();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);

  // Persisted snapshot derived from the server response.
  const persisted = useMemo(() => {
    const sections = {} as Record<SectionKey, SiteContent[SectionKey]>;
    for (const key of UNIQUE_EDITOR_KEYS) {
      sections[key] = mergeSection(key, data?.[key]);
    }
    const layout = resolveLayout(data?.[LAYOUT_KEY] as SiteLayout | undefined);
    return { sections, layout };
  }, [data]);

  // Editable working draft.
  const [draftSections, setDraftSections] = useState<Record<SectionKey, SiteContent[SectionKey]>>(persisted.sections);
  const [draftLayout, setDraftLayout] = useState<SectionLayoutItem[]>(persisted.layout);
  const [selectedKey, setSelectedKey] = useState<string | null>('hero');
  const [saving, setSaving] = useState(false);

  // Sync the draft from persisted whenever the server data changes AND we're clean.
  const isDirtyRef = useRef(false);
  useEffect(() => {
    if (!isDirtyRef.current) {
      setDraftSections(persisted.sections);
      setDraftLayout(persisted.layout);
    }
  }, [persisted]);

  // Dirty tracking.
  const dirtySections = useMemo(() => {
    const set = new Set<SectionKey>();
    for (const key of UNIQUE_EDITOR_KEYS) {
      if (stable(draftSections[key]) !== stable(persisted.sections[key])) set.add(key);
    }
    return set;
  }, [draftSections, persisted.sections]);

  const layoutDirty = stable(draftLayout) !== stable(persisted.layout);
  const dirtyCount = dirtySections.size + (layoutDirty ? 1 : 0);
  isDirtyRef.current = dirtyCount > 0;

  // ---- live preview wiring ----
  const buildOverrides = useCallback((): Record<string, unknown> => {
    const overrides: Record<string, unknown> = {};
    for (const key of UNIQUE_EDITOR_KEYS) overrides[key] = draftSections[key];
    overrides[LAYOUT_KEY] = { sections: draftLayout } satisfies SiteLayout;
    return overrides;
  }, [draftSections, draftLayout]);

  const buildOverridesRef = useRef(buildOverrides);
  buildOverridesRef.current = buildOverrides;

  const { iframeRef, pushDraft, scrollTo, onIframeLoad } = usePreviewBridgeHost({
    getDraftOverrides: () => buildOverridesRef.current(),
    onSectionClicked: (key) => setSelectedKey(key),
  });

  // Push draft to the preview whenever it changes.
  useEffect(() => { pushDraft(); }, [draftSections, draftLayout, pushDraft]);

  // Scroll the preview to the selected homepage section.
  useEffect(() => {
    if (selectedKey && SECTION_REGISTRY[selectedKey]) scrollTo(selectedKey);
  }, [selectedKey, scrollTo]);

  // ---- editing handlers ----
  const handleSectionChange = useCallback((editorKey: SectionKey, value: SiteContent[SectionKey]) => {
    setDraftSections((prev) => ({ ...prev, [editorKey]: value }));
  }, []);

  const handleResetSection = useCallback((editorKey: SectionKey) => {
    setDraftSections((prev) => ({ ...prev, [editorKey]: SITE_CONTENT_DEFAULTS[editorKey] }));
  }, []);

  const handleReorder = useCallback((from: number, to: number) => {
    setDraftLayout((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const handleToggleVisible = useCallback((key: string) => {
    setDraftLayout((prev) => prev.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s)));
  }, []);

  const getValue = useCallback((editorKey: SectionKey) => draftSections[editorKey], [draftSections]);

  // ---- save / discard ----
  const handleDiscard = useCallback(() => {
    setDraftSections(persisted.sections);
    setDraftLayout(persisted.layout);
  }, [persisted]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      for (const key of dirtySections) {
        await api.put(`/admin/site-content/${key}`, { value: draftSections[key] });
      }
      if (layoutDirty) {
        await api.put(`/admin/site-content/${LAYOUT_KEY}`, { value: { sections: draftLayout } });
      }
      await queryClient.invalidateQueries({ queryKey: ['site-content'] });
      showToast('Site content saved.', 'success');
    } catch {
      showToast('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [dirtySections, draftSections, layoutDirty, draftLayout, queryClient, showToast]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  if (isLoading) {
    return <div className="se-loading"><Spinner /></div>;
  }

  return (
    <div className="site-editor">
      <div className="se-topbar">
        <div>
          <h1>Site Content</h1>
          <p>Edit, reorder and show/hide homepage sections. Changes go live after saving.</p>
        </div>
        <SaveBar dirtyCount={dirtyCount} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />
      </div>

      <div className="se-body">
        <div className="se-left">
          <SectionList
            layout={draftLayout}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            onReorder={handleReorder}
            onToggleVisible={handleToggleVisible}
          />
          <SectionSettings
            selectedKey={selectedKey}
            getValue={getValue}
            onChange={handleSectionChange}
            onResetSection={handleResetSection}
          />
        </div>

        <div className="se-preview">
          <iframe
            ref={iframeRef}
            title="Homepage preview"
            src="/?preview=1"
            className="se-preview-frame"
            onLoad={onIframeLoad}
          />
        </div>
      </div>
    </div>
  );
}

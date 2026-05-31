import { create } from 'zustand';

/**
 * Holds the live editor draft inside the preview iframe. The editor pushes the full
 * working draft (every edited section's merged value, plus the `_layout` entry) via
 * postMessage; `useSection` / `useLayout` prefer these overrides when in preview mode.
 *
 * Persisted data is never touched — this layer exists only inside the preview iframe.
 */
interface PreviewState {
  /** key -> full draft section value (and `_layout` -> { sections }). */
  overrides: Record<string, unknown>;
  /** Section currently selected in the editor (for optional highlight). */
  selectedKey: string | null;
  setOverrides: (overrides: Record<string, unknown>) => void;
  setSelectedKey: (key: string | null) => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  overrides: {},
  selectedKey: null,
  setOverrides: (overrides) => set({ overrides }),
  setSelectedKey: (selectedKey) => set({ selectedKey }),
}));

import { useEffect } from 'react';
import { isTrustedPreviewMessage } from './previewMode';
import { usePreviewStore } from './previewStore';
import {
  PREVIEW_MESSAGES,
  type EditorToIframeMessage,
  type HighlightMessage,
} from './messages';

// Mounted inside the public app ONLY when running in preview mode (see App.tsx).
// Bridges the editor (parent window) and this iframe:
//  - announces readiness so the editor flushes its initial draft;
//  - applies draft content/layout pushed from the editor (live preview);
//  - scrolls to / highlights a section on request;
//  - reports section clicks so the editor can open that section's settings.
export function PreviewBridge() {
  const setOverrides = usePreviewStore((s) => s.setOverrides);

  useEffect(() => {
    const post = (message: unknown) => {
      window.parent.postMessage(message, window.location.origin);
    };

    const applyHighlight = (key: string | null) => {
      document
        .querySelectorAll('[data-preview-section].preview-highlight')
        .forEach((el) => el.classList.remove('preview-highlight'));
      if (key) {
        document
          .querySelector(`[data-preview-section="${key}"]`)
          ?.classList.add('preview-highlight');
      }
    };

    const onMessage = (event: MessageEvent) => {
      if (!isTrustedPreviewMessage(event)) return;
      const data = event.data as EditorToIframeMessage;
      if (!data || typeof data !== 'object') return;

      switch (data.type) {
        case PREVIEW_MESSAGES.DRAFT:
          setOverrides(data.overrides ?? {});
          break;
        case PREVIEW_MESSAGES.SCROLL_TO: {
          const el = document.getElementById(`section-${data.key}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        }
        case PREVIEW_MESSAGES.HIGHLIGHT:
          applyHighlight((data as HighlightMessage).key);
          break;
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const section = target?.closest('[data-preview-section]') as HTMLElement | null;
      if (section?.dataset.previewSection) {
        post({ type: PREVIEW_MESSAGES.SECTION_CLICKED, key: section.dataset.previewSection });
      }
    };

    window.addEventListener('message', onMessage);
    document.addEventListener('click', onClick);

    // Tell the editor we're live so it can send the current draft.
    post({ type: PREVIEW_MESSAGES.READY });

    return () => {
      window.removeEventListener('message', onMessage);
      document.removeEventListener('click', onClick);
    };
  }, [setOverrides]);

  return null;
}

import { useCallback, useEffect, useRef } from 'react';
import {
  PREVIEW_MESSAGES,
  type IframeToEditorMessage,
} from '../../../preview/messages';

// Editor-side counterpart to PreviewBridge. Owns the iframe ref, sends the current draft
// (debounced) into the preview, and reacts to the iframe's `ready` / `section-clicked`
// messages. The initial draft is queued until the iframe reports `ready` (and re-sent
// whenever the iframe reloads).
export function usePreviewBridgeHost(options: {
  getDraftOverrides: () => Record<string, unknown>;
  onSectionClicked: (key: string) => void;
}) {
  const { getDraftOverrides, onSectionClicked } = options;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const readyRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep latest callbacks without re-subscribing the message listener.
  const getDraftRef = useRef(getDraftOverrides);
  const onClickRef = useRef(onSectionClicked);
  getDraftRef.current = getDraftOverrides;
  onClickRef.current = onSectionClicked;

  const postToIframe = useCallback((message: unknown) => {
    const win = iframeRef.current?.contentWindow;
    if (win) win.postMessage(message, window.location.origin);
  }, []);

  const sendDraftNow = useCallback(() => {
    if (!readyRef.current) return;
    postToIframe({ type: PREVIEW_MESSAGES.DRAFT, overrides: getDraftRef.current() });
  }, [postToIframe]);

  /** Debounced push of the full draft to the preview iframe. */
  const pushDraft = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(sendDraftNow, 120);
  }, [sendDraftNow]);

  const scrollTo = useCallback(
    (key: string) => postToIframe({ type: PREVIEW_MESSAGES.SCROLL_TO, key }),
    [postToIframe],
  );

  const highlight = useCallback(
    (key: string | null) => postToIframe({ type: PREVIEW_MESSAGES.HIGHLIGHT, key }),
    [postToIframe],
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data as IframeToEditorMessage;
      if (!data || typeof data !== 'object') return;

      if (data.type === PREVIEW_MESSAGES.READY) {
        readyRef.current = true;
        // Flush the current draft as the initial state.
        postToIframe({ type: PREVIEW_MESSAGES.DRAFT, overrides: getDraftRef.current() });
      } else if (data.type === PREVIEW_MESSAGES.SECTION_CLICKED) {
        onClickRef.current(data.key);
      }
    };

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [postToIframe]);

  /** Call on iframe `load` so a reload re-handshakes (ready will re-fire from the bridge). */
  const onIframeLoad = useCallback(() => {
    readyRef.current = false;
  }, []);

  return { iframeRef, pushDraft, scrollTo, highlight, onIframeLoad };
}

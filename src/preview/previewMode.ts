// Preview-mode detection. Active ONLY when the page is loaded with `?preview=1` AND it is
// running inside an iframe (window has a different parent). Both conditions are required so
// a normal visitor who somehow lands on `/?preview=1` directly gets the normal site —
// nothing is ever seeded and the public components behave exactly as usual.

function computeIsPreview(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const flagged = new URLSearchParams(window.location.search).get('preview') === '1';
    const inIframe = window.parent !== window;
    return flagged && inIframe;
  } catch {
    return false;
  }
}

/** Constant for the lifetime of the page load. */
export const IS_PREVIEW = computeIsPreview();

/** Only accept postMessages from our own origin and our parent window. */
export function isTrustedPreviewMessage(event: MessageEvent): boolean {
  return event.origin === window.location.origin && event.source === window.parent;
}

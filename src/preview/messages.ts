// postMessage protocol between the Site Editor (parent) and the preview iframe (child).
// All messages are namespaced and origin-locked (see isTrustedPreviewMessage).

export const PREVIEW_MESSAGES = {
  // iframe -> editor
  READY: 'tarweeda:preview:ready',
  SECTION_CLICKED: 'tarweeda:preview:section-clicked',
  // editor -> iframe
  DRAFT: 'tarweeda:preview:draft',
  SCROLL_TO: 'tarweeda:preview:scroll-to',
  HIGHLIGHT: 'tarweeda:preview:highlight',
} as const;

export interface ReadyMessage {
  type: typeof PREVIEW_MESSAGES.READY;
}
export interface SectionClickedMessage {
  type: typeof PREVIEW_MESSAGES.SECTION_CLICKED;
  key: string;
}
export interface DraftMessage {
  type: typeof PREVIEW_MESSAGES.DRAFT;
  overrides: Record<string, unknown>;
}
export interface ScrollToMessage {
  type: typeof PREVIEW_MESSAGES.SCROLL_TO;
  key: string;
}
export interface HighlightMessage {
  type: typeof PREVIEW_MESSAGES.HIGHLIGHT;
  key: string | null;
}

export type EditorToIframeMessage = DraftMessage | ScrollToMessage | HighlightMessage;
export type IframeToEditorMessage = ReadyMessage | SectionClickedMessage;

import { create } from 'zustand';

interface ConfirmState {
  dialog: {
    title: string;
    message: string;
    confirmLabel: string;
    danger: boolean;
    onConfirm: () => void;
  } | null;
  showConfirm: (opts: {
    title: string;
    message: string;
    confirmLabel?: string;
    danger?: boolean;
    onConfirm: () => void;
  }) => void;
  closeConfirm: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  dialog: null,
  showConfirm: (opts) =>
    set({
      dialog: {
        title: opts.title,
        message: opts.message,
        confirmLabel: opts.confirmLabel ?? 'Confirm',
        danger: opts.danger ?? true,
        onConfirm: opts.onConfirm,
      },
    }),
  closeConfirm: () => set({ dialog: null }),
}));

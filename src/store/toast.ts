import { create } from 'zustand';

interface ToastState {
  toast: { message: string; type: 'error' | 'success' | 'warning' } | null;
  showToast: (message: string, type?: 'error' | 'success' | 'warning') => void;
  clearToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  showToast: (message, type = 'error') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 4000);
  },
  clearToast: () => set({ toast: null }),
}));

import { useToastStore } from '../../store/toast';
import './Toast.css';

const ICONS = {
  error: '✕',
  success: '✦',
  warning: '⚠',
};

export function Toast() {
  const { toast, clearToast } = useToastStore();

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-icon">{ICONS[toast.type]}</span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={clearToast} aria-label="Dismiss">✕</button>
    </div>
  );
}

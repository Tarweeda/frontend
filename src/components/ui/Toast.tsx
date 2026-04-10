import { useToastStore } from '../../store/toast';
import './Toast.css';

export function Toast() {
  const { toast, clearToast } = useToastStore();

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={clearToast}>✕</button>
    </div>
  );
}

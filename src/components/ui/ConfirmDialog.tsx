import { useConfirmStore } from '../../store/confirm';
import { Button } from './Button';
import './ConfirmDialog.css';

export function ConfirmDialog() {
  const { dialog, closeConfirm } = useConfirmStore();

  if (!dialog) return null;

  const handleConfirm = () => {
    dialog.onConfirm();
    closeConfirm();
  };

  return (
    <div className="confirm-bg" onClick={(e) => { if (e.target === e.currentTarget) closeConfirm(); }}>
      <div className="confirm-box">
        <h3 className="confirm-title">{dialog.title}</h3>
        <p className="confirm-msg">{dialog.message}</p>
        <div className="confirm-actions">
          <Button variant="outline" onClick={closeConfirm}>Cancel</Button>
          <Button variant={dialog.danger ? 'terra' : 'primary'} onClick={handleConfirm}>
            {dialog.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

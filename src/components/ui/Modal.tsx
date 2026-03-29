import { useEffect, type ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, children, maxWidth = '660px' }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}

export function ModalHead({ title, subtitle, onClose }: { title: string; subtitle?: string; onClose: () => void }) {
  return (
    <div className="modal-head">
      <div>
        <div className="modal-title">{title}</div>
        {subtitle && <div className="modal-subtitle">{subtitle}</div>}
      </div>
      <button className="modal-close" onClick={onClose}>✕</button>
    </div>
  );
}

export function ModalSteps({ steps, current, onChange }: { steps: string[]; current: number; onChange: (i: number) => void }) {
  return (
    <div className="modal-steps">
      {steps.map((s, i) => (
        <button key={s} className={`modal-step ${i === current ? 'on' : ''}`} onClick={() => onChange(i)}>
          {s}
        </button>
      ))}
    </div>
  );
}

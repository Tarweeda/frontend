import { useEffect, type ReactNode } from 'react';
import './Drawer.css';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Drawer({ open, onClose, children }: DrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className={`drawer-overlay ${open ? 'on' : ''}`} onClick={onClose} />
      <div className={`drawer ${open ? 'on' : ''}`}>{children}</div>
    </>
  );
}

import { useState, useEffect, useRef } from 'react';
import './DatePicker.css';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDisplay(ymd: string): string {
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function parseYMD(ymd: string): { y: number; m: number; d: number } | null {
  if (!ymd) return null;
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return null;
  return { y, m: m - 1, d };
}

interface DatePickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'light' | 'dark';
  minDate?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Select a date', className = '', variant = 'light', minDate }: DatePickerProps) {
  const today = new Date();
  const parsed = parseYMD(value);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed?.y ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.m ?? today.getMonth());
  const [openUp, setOpenUp] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open || !popupRef.current) return;
    const rect = popupRef.current.getBoundingClientRect();
    setOpenUp(rect.bottom > window.innerHeight - 20);
  }, [open]);

  const handleOpen = () => {
    if (parsed) {
      setViewYear(parsed.y);
      setViewMonth(parsed.m);
    }
    setOpen((o) => !o);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const selectDay = (ymd: string) => {
    onChange(ymd);
    setOpen(false);
  };

  const selectToday = () => {
    onChange(toYMD(today));
    setOpen(false);
  };

  const clear = () => {
    onChange('');
    setOpen(false);
  };

  const buildGrid = () => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: { ymd: string; inMonth: boolean }[] = [];

    const prevDays = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth - 1, prevDays - i);
      cells.push({ ymd: toYMD(d), inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ ymd: toYMD(new Date(viewYear, viewMonth, d)), inMonth: true });
    }
    while (cells.length < 42) {
      const d = new Date(viewYear, viewMonth + 1, cells.length - daysInMonth - firstDay + 1);
      cells.push({ ymd: toYMD(d), inMonth: false });
    }
    return cells;
  };

  const todayYMD = toYMD(today);
  const cells = buildGrid();

  return (
    <div className={`dp-wrap${open ? ' dp-open' : ''}`} ref={containerRef}>
      <button
        type="button"
        className={`dp-trigger ${className} ${variant === 'dark' ? 'dp-dark' : 'dp-light'}`}
        onClick={handleOpen}
      >
        <span className={value ? '' : 'dp-placeholder'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <svg className="dp-icon" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="3" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M1 7h14" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className={`dp-popup${openUp ? ' dp-up' : ''}`} ref={popupRef}>
          <div className="dp-header">
            <button type="button" className="dp-nav" onClick={prevMonth}>‹</button>
            <span className="dp-month-label">{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" className="dp-nav" onClick={nextMonth}>›</button>
          </div>

          <div className="dp-grid dp-dow">
            {DAYS.map((d) => <span key={d} className="dp-dow-cell">{d}</span>)}
          </div>

          <div className="dp-grid dp-days">
            {cells.map(({ ymd, inMonth }) => (
              <button
                key={ymd}
                type="button"
                className={[
                  'dp-day',
                  !inMonth ? 'dp-out' : '',
                  ymd === todayYMD ? 'dp-today' : '',
                  ymd === value ? 'dp-selected' : '',
                  minDate && ymd < minDate ? 'dp-disabled' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => !(minDate && ymd < minDate) && selectDay(ymd)}
              >
                {parseInt(ymd.split('-')[2])}
              </button>
            ))}
          </div>

          <div className="dp-footer">
            <button type="button" className="dp-foot-btn" onClick={clear}>Clear</button>
            <button type="button" className="dp-foot-btn dp-foot-today" onClick={selectToday}>Today</button>
          </div>
        </div>
      )}
    </div>
  );
}

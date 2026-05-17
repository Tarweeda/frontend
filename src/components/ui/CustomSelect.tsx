import { useState, useEffect, useRef } from 'react';
import './CustomSelect.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  variant?: 'dark' | 'light';
}

export function CustomSelect({ value, onChange, options, className = '', variant = 'dark' }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div
      className={`cs-wrap ${open ? 'cs-open' : ''} cs-${variant} ${className}`}
      ref={ref}
    >
      <button
        type="button"
        className="cs-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="cs-value">{selected?.label ?? options[0]?.label}</span>
        <svg className="cs-chevron" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="cs-dropdown" role="listbox">
          {options.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`cs-option ${o.value === value ? 'cs-selected' : ''}`}
              onClick={() => handleSelect(o.value)}
            >
              {o.value === value && <span className="cs-tick">✦</span>}
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

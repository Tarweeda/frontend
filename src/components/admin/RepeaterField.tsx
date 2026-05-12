import type { ReactNode } from 'react';
import './RepeaterField.css';

interface Props<T> {
  label: string;
  value: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  renderRow: (item: T, setItem: (next: T) => void) => ReactNode;
  addLabel?: string;
}

export function RepeaterField<T>({ label, value, onChange, newItem, renderRow, addLabel = '+ Add' }: Props<T>) {
  const setAt = (i: number, next: T) => {
    const arr = value.slice();
    arr[i] = next;
    onChange(arr);
  };
  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const arr = value.slice();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };
  const add = () => onChange([...value, newItem()]);

  return (
    <div className="repeater">
      <span className="field-label">{label}</span>
      {value.map((item, i) => (
        <div className="repeater-row" key={i}>
          <div className="repeater-row-body">{renderRow(item, (next) => setAt(i, next))}</div>
          <div className="repeater-row-actions">
            <button type="button" className="repeater-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
            <button type="button" className="repeater-btn" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move down">↓</button>
            <button type="button" className="repeater-btn danger" onClick={() => removeAt(i)} aria-label="Remove">✕</button>
          </div>
        </div>
      ))}
      <button type="button" className="repeater-add" onClick={add}>{addLabel}</button>
    </div>
  );
}

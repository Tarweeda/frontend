import { useState } from 'react';
import {
  SECTION_REGISTRY,
  CHROME_SECTIONS,
  type SectionLayoutItem,
} from '../../../content/sectionRegistry';
import { AdminIcon } from '../../../components/admin/AdminIcon';

// Left rail: the draggable, hideable list of homepage sections + a "Site chrome" group
// (nav/footer) that is editable but not part of the layout. Native HTML5 drag-and-drop
// with up/down arrow buttons as an accessible/touch fallback.
interface Props {
  layout: SectionLayoutItem[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  onReorder: (from: number, to: number) => void;
  onToggleVisible: (key: string) => void;
}

export function SectionList({ layout, selectedKey, onSelect, onReorder, onToggleVisible }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDrop = (to: number) => {
    if (dragIndex !== null && dragIndex !== to) onReorder(dragIndex, to);
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="se-rail">
      <div className="se-rail-group-label">Homepage sections</div>
      <ul className="se-section-list">
        {layout.map((item, index) => {
          const entry = SECTION_REGISTRY[item.key];
          if (!entry) return null;
          return (
            <li
              key={item.key}
              className={[
                'se-row',
                selectedKey === item.key ? 'selected' : '',
                item.visible ? '' : 'hidden',
                dragIndex === index ? 'dragging' : '',
                overIndex === index ? 'drop-target' : '',
              ].join(' ')}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => { e.preventDefault(); setOverIndex(index); }}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
            >
              <span className="se-row-grip" aria-hidden title="Drag to reorder">⋮⋮</span>
              <button type="button" className="se-row-label" onClick={() => onSelect(item.key)}>
                {entry.label}
              </button>
              <div className="se-row-actions">
                <button
                  type="button"
                  className="se-icon-btn"
                  title="Move up"
                  disabled={index === 0}
                  onClick={() => onReorder(index, index - 1)}
                >▲</button>
                <button
                  type="button"
                  className="se-icon-btn"
                  title="Move down"
                  disabled={index === layout.length - 1}
                  onClick={() => onReorder(index, index + 1)}
                >▼</button>
                <button
                  type="button"
                  className={`se-icon-btn se-eye ${item.visible ? '' : 'off'}`}
                  title={item.visible ? 'Hide section' : 'Show section'}
                  onClick={() => onToggleVisible(item.key)}
                >
                  <AdminIcon name={item.visible ? 'grid' : 'box'} size={15} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="se-rail-group-label">Site chrome</div>
      <ul className="se-section-list">
        {CHROME_SECTIONS.map((c) => (
          <li key={c.key} className={`se-row ${selectedKey === c.key ? 'selected' : ''}`}>
            <span className="se-row-grip se-row-grip--fixed" aria-hidden>•</span>
            <button type="button" className="se-row-label" onClick={() => onSelect(c.key)}>
              {c.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

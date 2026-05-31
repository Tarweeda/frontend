import { Button } from '../../../components/ui/Button';

// Sticky unsaved-changes bar. Appears only when the draft differs from what's persisted.
interface Props {
  dirtyCount: number;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export function SaveBar({ dirtyCount, saving, onSave, onDiscard }: Props) {
  if (dirtyCount === 0) return null;
  return (
    <div className="se-savebar">
      <span className="se-savebar-text">
        {dirtyCount} unsaved {dirtyCount === 1 ? 'change' : 'changes'}
      </span>
      <div className="se-savebar-actions">
        <Button variant="ghost" type="button" onClick={onDiscard} disabled={saving}>
          Discard
        </Button>
        <Button variant="primary" type="button" loading={saving} onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

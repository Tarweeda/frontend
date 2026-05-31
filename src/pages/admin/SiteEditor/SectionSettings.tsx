import {
  SECTION_REGISTRY,
  CHROME_SECTIONS,
} from '../../../content/sectionRegistry';
import { type SiteContent } from '../../../content/siteContent';
import { Button } from '../../../components/ui/Button';
import { SectionEditor } from './sectionEditors';

// Right-of-rail settings panel for the selected section. Renders the reused per-section
// editor body, or an explanatory note for event-driven sections without a form.
interface Props {
  selectedKey: string | null;
  getValue: (editorKey: keyof SiteContent) => SiteContent[keyof SiteContent];
  onChange: (editorKey: keyof SiteContent, value: SiteContent[keyof SiteContent]) => void;
  onResetSection: (editorKey: keyof SiteContent) => void;
}

export function SectionSettings({ selectedKey, getValue, onChange, onResetSection }: Props) {
  if (!selectedKey) {
    return <div className="se-settings-empty">Select a section to edit its content.</div>;
  }

  const registryEntry = SECTION_REGISTRY[selectedKey];
  const chromeEntry = CHROME_SECTIONS.find((c) => c.key === selectedKey);
  const label = registryEntry?.label ?? chromeEntry?.label ?? selectedKey;
  const editorKey = registryEntry?.editorKey ?? chromeEntry?.editorKey;
  const hasEditor = registryEntry ? registryEntry.hasEditor : Boolean(chromeEntry);

  return (
    <div className="se-settings">
      <div className="se-settings-head">
        <h2>{label}</h2>
        {editorKey && (
          <Button variant="ghost" type="button" onClick={() => onResetSection(editorKey)}>
            Reset to default
          </Button>
        )}
      </div>

      {hasEditor && editorKey ? (
        <div className="admin-form">
          <SectionEditor
            sectionKey={editorKey}
            value={getValue(editorKey)}
            onChange={(v) => onChange(editorKey, v)}
          />
        </div>
      ) : (
        <p className="sc-hint">
          This section is generated automatically from live data (events). There's no text to
          edit here — you can still reorder it or hide it from the homepage.
        </p>
      )}
    </div>
  );
}

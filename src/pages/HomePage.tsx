import { useLayout } from '../hooks/useLayout';
import { SECTION_REGISTRY } from '../content/sectionRegistry';

// The homepage renders its sections from the saved layout (order + visibility) mapped over
// the section registry. When no `_layout` is saved, `useLayout` falls back to DEFAULT_LAYOUT,
// which matches the original hardcoded order — so the public site is unchanged by default.
//
// Each section is wrapped in an anchor div (`section-<key>`) so the live preview can scroll
// to and target any section by its layout key.
export function HomePage() {
  const layout = useLayout();

  return (
    <>
      {layout
        .filter((item) => item.visible)
        .map((item) => {
          const entry = SECTION_REGISTRY[item.key];
          if (!entry) return null;
          const SectionComponent = entry.component;
          return (
            <div key={item.key} id={`section-${item.key}`} data-preview-section={item.key}>
              <SectionComponent />
            </div>
          );
        })}
    </>
  );
}

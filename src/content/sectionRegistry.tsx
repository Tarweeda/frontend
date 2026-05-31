// Central registry of homepage sections + the saved "section layout" model.
//
// The public HomePage and the admin Site Editor both render/order sections from
// SECTION_REGISTRY × the saved layout. The layout (order + visibility) is persisted
// as a single `site_content` row under the reserved key `_layout`, so no DB migration
// or backend change is needed.

import type { ComponentType } from 'react';
import type { SiteContent } from './siteContent';

import { Hero } from '../components/home/Hero';
import { ShopSection } from '../components/shop/ShopSection';
import { Story } from '../components/home/Story';
import { Pillars } from '../components/home/Pillars';
import { CateringSection } from '../components/catering/CateringSection';
import { SupperBentoSection } from '../components/supper-club/SupperBentoSection';
import { SupperSection } from '../components/supper-club/SupperSection';
import { PastEventsPreview } from '../components/supper-club/PastEventsPreview';
import { HireSection } from '../components/hire/HireSection';
import { HampersSection } from '../components/hampers/HampersSection';
import { Values } from '../components/home/Values';
import { Contact } from '../components/home/Contact';

/** Reserved `site_content` key under which the layout is stored. */
export const LAYOUT_KEY = '_layout';

export interface SectionLayoutItem {
  key: string;
  visible: boolean;
}

export interface SiteLayout {
  sections: SectionLayoutItem[];
}

export interface SectionRegistryEntry {
  component: ComponentType;
  label: string;
  /** Can be reordered/hidden in the editor (all homepage sections are). */
  draggable: boolean;
  hideable: boolean;
  /** Has an editable settings form in the editor. */
  hasEditor: boolean;
  /** Which SiteContent section's editor body to render (omitted for event-driven sections). */
  editorKey?: keyof SiteContent;
}

/**
 * Every homepage section, keyed by a stable layout id.
 *
 * Reconciles the current code/CMS mismatches:
 *  - `pillars` (Pillars) existed in the CMS but was never rendered → now a real, hidden-by-default section.
 *  - `supper` (SupperSection, static) was unused; the live homepage shows `supperBento` + `pastEvents`.
 *  - `supperBento` reads the same `supper` CMS content (see SupperBentoSection), so it shares the `supper` editor.
 */
export const SECTION_REGISTRY: Record<string, SectionRegistryEntry> = {
  hero: { component: Hero, label: 'Hero Carousel', draggable: true, hideable: true, hasEditor: true, editorKey: 'hero' },
  shop: { component: ShopSection, label: 'Shop', draggable: true, hideable: true, hasEditor: true, editorKey: 'shop' },
  story: { component: Story, label: 'Our Story', draggable: true, hideable: true, hasEditor: true, editorKey: 'story' },
  pillars: { component: Pillars, label: 'Pillars Strip', draggable: true, hideable: true, hasEditor: true, editorKey: 'pillars' },
  catering: { component: CateringSection, label: 'Catering', draggable: true, hideable: true, hasEditor: true, editorKey: 'catering' },
  supperBento: { component: SupperBentoSection, label: 'Supper Club (live events)', draggable: true, hideable: true, hasEditor: true, editorKey: 'supper' },
  supper: { component: SupperSection, label: 'Supper Club (static)', draggable: true, hideable: true, hasEditor: true, editorKey: 'supper' },
  pastEvents: { component: PastEventsPreview, label: 'Past Events', draggable: true, hideable: true, hasEditor: false },
  hire: { component: HireSection, label: 'Hire Staff', draggable: true, hideable: true, hasEditor: true, editorKey: 'hire' },
  hampers: { component: HampersSection, label: 'Hampers', draggable: true, hideable: true, hasEditor: true, editorKey: 'hampers' },
  values: { component: Values, label: 'Values', draggable: true, hideable: true, hasEditor: true, editorKey: 'values' },
  contact: { component: Contact, label: 'Contact', draggable: true, hideable: true, hasEditor: true, editorKey: 'contact' },
};

/**
 * Site chrome — editable but NOT part of the reorderable homepage layout
 * (Nav + Footer live in PageLayout and render on every route).
 */
export const CHROME_SECTIONS: { key: string; label: string; editorKey: keyof SiteContent }[] = [
  { key: 'nav', label: 'Navigation Bar', editorKey: 'nav' },
  { key: 'footer', label: 'Footer', editorKey: 'footer' },
];

/**
 * Default order + visibility — matches the homepage exactly as it rendered before this
 * feature, so a site with no `_layout` row looks identical. `pillars` and `supper` were
 * not rendered before, so they ship hidden (opt-in).
 */
export const DEFAULT_LAYOUT: SiteLayout = {
  sections: [
    { key: 'hero', visible: true },
    { key: 'shop', visible: true },
    { key: 'story', visible: true },
    { key: 'pillars', visible: false },
    { key: 'catering', visible: true },
    { key: 'supperBento', visible: true },
    { key: 'supper', visible: false },
    { key: 'pastEvents', visible: true },
    { key: 'hire', visible: true },
    { key: 'hampers', visible: true },
    { key: 'values', visible: true },
    { key: 'contact', visible: true },
  ],
};

/**
 * Turn a (possibly missing/partial/corrupt) saved layout into a safe, complete list:
 *  - keep saved entries whose key is a known registry section, in saved order;
 *  - append any registry sections missing from the saved list, in DEFAULT_LAYOUT order;
 *  - drop unknown keys.
 * Guarantees the homepage never loses a section or breaks from bad layout data.
 */
export function resolveLayout(saved?: SiteLayout | null): SectionLayoutItem[] {
  const known = new Set(Object.keys(SECTION_REGISTRY));
  const savedItems = Array.isArray(saved?.sections) ? saved!.sections : [];

  const seen = new Set<string>();
  const result: SectionLayoutItem[] = [];

  for (const item of savedItems) {
    if (item && typeof item.key === 'string' && known.has(item.key) && !seen.has(item.key)) {
      result.push({ key: item.key, visible: item.visible !== false });
      seen.add(item.key);
    }
  }

  // Append any registry sections not present in the saved list (in default order).
  for (const def of DEFAULT_LAYOUT.sections) {
    if (!seen.has(def.key)) {
      result.push({ ...def });
      seen.add(def.key);
    }
  }

  return result;
}

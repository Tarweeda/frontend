// Per-section editor bodies, extracted verbatim from the original AdminSiteContent.tsx so
// the new Site Editor reuses the exact same forms. Each editor takes a section value and an
// onChange; the parent owns draft state + saving.

import { type ReactNode } from 'react';
import { type SiteContent } from '../../../content/siteContent';
import { Input, Textarea } from '../../../components/ui/Input';
import { ImageUpload } from '../../../components/admin/ImageUpload';
import { RepeaterField } from '../../../components/admin/RepeaterField';

type SectionKey = keyof SiteContent;

export function SectionEditor<K extends SectionKey>({
  sectionKey,
  value,
  onChange,
}: {
  sectionKey: K;
  value: SiteContent[K];
  onChange: (v: SiteContent[K]) => void;
}) {
  switch (sectionKey) {
    case 'hero': return <HeroEditor value={value as SiteContent['hero']} onChange={onChange as (v: SiteContent['hero']) => void} />;
    case 'story': return <StoryEditor value={value as SiteContent['story']} onChange={onChange as (v: SiteContent['story']) => void} />;
    case 'values': return <ValuesEditor value={value as SiteContent['values']} onChange={onChange as (v: SiteContent['values']) => void} />;
    case 'pillars': return <PillarsEditor value={value as SiteContent['pillars']} onChange={onChange as (v: SiteContent['pillars']) => void} />;
    case 'shop': return <ShopEditor value={value as SiteContent['shop']} onChange={onChange as (v: SiteContent['shop']) => void} />;
    case 'catering': return <CateringEditor value={value as SiteContent['catering']} onChange={onChange as (v: SiteContent['catering']) => void} />;
    case 'supper': return <SupperEditor value={value as SiteContent['supper']} onChange={onChange as (v: SiteContent['supper']) => void} />;
    case 'hire': return <HireEditor value={value as SiteContent['hire']} onChange={onChange as (v: SiteContent['hire']) => void} />;
    case 'hampers': return <HampersEditor value={value as SiteContent['hampers']} onChange={onChange as (v: SiteContent['hampers']) => void} />;
    case 'contact': return <ContactEditor value={value as SiteContent['contact']} onChange={onChange as (v: SiteContent['contact']) => void} />;
    case 'nav': return <NavEditor value={value as SiteContent['nav']} onChange={onChange as (v: SiteContent['nav']) => void} />;
    case 'footer': return <FooterEditor value={value as SiteContent['footer']} onChange={onChange as (v: SiteContent['footer']) => void} />;
    default: return null;
  }
}

function Row({ children }: { children: ReactNode }) {
  return <div className="admin-form-row">{children}</div>;
}

function mkPatch<T extends object>(value: T, onChange: (v: T) => void) {
  return (p: Partial<T>) => onChange({ ...value, ...p });
}

const StrRow = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <Input label={label} value={value} onChange={(e) => onChange(e.target.value)} />
);

function HeroEditor({ value, onChange }: { value: SiteContent['hero']; onChange: (v: SiteContent['hero']) => void }) {
  return (
    <RepeaterField
      label="Slides"
      value={value.slides}
      onChange={(slides) => onChange({ ...value, slides })}
      newItem={() => ({ tag: '', heading: '', headingEm: '', subtitle: '', cta1: { label: '', href: '' }, cta2: { label: '', href: '' }, watermark: '', bgImage: '' })}
      addLabel="+ Add slide"
      renderRow={(slide, setItem) => {
        const u = (p: Partial<typeof slide>) => setItem({ ...slide, ...p });
        return (
          <>
            <Input label="Tag (small label)" value={slide.tag} onChange={(e) => u({ tag: e.target.value })} />
            <Row>
              <Input label="Heading" value={slide.heading} onChange={(e) => u({ heading: e.target.value })} />
              <Input label="Heading (emphasised)" value={slide.headingEm} onChange={(e) => u({ headingEm: e.target.value })} />
            </Row>
            <Textarea label="Subtitle" rows={2} value={slide.subtitle} onChange={(e) => u({ subtitle: e.target.value })} />
            <Row>
              <Input label="Button 1 text" value={slide.cta1.label} onChange={(e) => u({ cta1: { ...slide.cta1, label: e.target.value } })} />
              <Input label="Button 1 link" value={slide.cta1.href} onChange={(e) => u({ cta1: { ...slide.cta1, href: e.target.value } })} />
            </Row>
            <Row>
              <Input label="Button 2 text" value={slide.cta2.label} onChange={(e) => u({ cta2: { ...slide.cta2, label: e.target.value } })} />
              <Input label="Button 2 link" value={slide.cta2.href} onChange={(e) => u({ cta2: { ...slide.cta2, href: e.target.value } })} />
            </Row>
            <Input label="Watermark (Arabic, decorative)" value={slide.watermark} onChange={(e) => u({ watermark: e.target.value })} />
            <ImageUpload label="Background image (optional — leave empty for the green gradient)" value={slide.bgImage} onChange={(url) => u({ bgImage: url })} />
          </>
        );
      }}
    />
  );
}

function StoryEditor({ value, onChange }: { value: SiteContent['story']; onChange: (v: SiteContent['story']) => void }) {
  const p = mkPatch(value, onChange);
  return (
    <>
      <Input label="Section label" value={value.label} onChange={(e) => p({ label: e.target.value })} />
      <p className="sc-hint">Heading: "{value.headingPre}<em>{value.headingEm}</em>" + line break + "{value.headingPost}"</p>
      <Row>
        <Input label="Heading — before emphasis" value={value.headingPre} onChange={(e) => p({ headingPre: e.target.value })} />
        <Input label="Heading — emphasised part" value={value.headingEm} onChange={(e) => p({ headingEm: e.target.value })} />
      </Row>
      <Input label="Heading — second line" value={value.headingPost} onChange={(e) => p({ headingPost: e.target.value })} />
      <RepeaterField
        label="Paragraphs"
        value={value.paragraphs}
        onChange={(paragraphs) => p({ paragraphs })}
        newItem={() => ''}
        addLabel="+ Add paragraph"
        renderRow={(text, setItem) => <Textarea label="" rows={3} value={text} onChange={(e) => setItem(e.target.value)} />}
      />
      <Input label="Closing emphasised line (bold)" value={value.emphasisLine} onChange={(e) => p({ emphasisLine: e.target.value })} />
      <Input label="Signature line" value={value.signature} onChange={(e) => p({ signature: e.target.value })} />
      <ImageUpload label="Story image" value={value.image === '/story.jpg' ? '' : value.image} onChange={(url) => p({ image: url || '/story.jpg' })} />
    </>
  );
}

function ValuesEditor({ value, onChange }: { value: SiteContent['values']; onChange: (v: SiteContent['values']) => void }) {
  return (
    <RepeaterField
      label="Values"
      value={value.items}
      onChange={(items) => onChange({ items })}
      newItem={() => ({ title: '', body: '' })}
      addLabel="+ Add value"
      renderRow={(item, setItem) => (
        <>
          <Input label="Title" value={item.title} onChange={(e) => setItem({ ...item, title: e.target.value })} />
          <Textarea label="Body" rows={2} value={item.body} onChange={(e) => setItem({ ...item, body: e.target.value })} />
        </>
      )}
    />
  );
}

function PillarsEditor({ value, onChange }: { value: SiteContent['pillars']; onChange: (v: SiteContent['pillars']) => void }) {
  return (
    <RepeaterField
      label="Pillars"
      value={value.items}
      onChange={(items) => onChange({ items })}
      newItem={() => ({ title: '', sub: '', href: '#shop' })}
      addLabel="+ Add pillar"
      renderRow={(item, setItem) => (
        <>
          <Input label="Title" value={item.title} onChange={(e) => setItem({ ...item, title: e.target.value })} />
          <Input label="Subtitle" value={item.sub} onChange={(e) => setItem({ ...item, sub: e.target.value })} />
          <Input label="Link" value={item.href} onChange={(e) => setItem({ ...item, href: e.target.value })} />
        </>
      )}
    />
  );
}

function ShopEditor({ value, onChange }: { value: SiteContent['shop']; onChange: (v: SiteContent['shop']) => void }) {
  const p = mkPatch(value, onChange);
  return (
    <>
      <Input label="Eyebrow (small label)" value={value.eyebrow} onChange={(e) => p({ eyebrow: e.target.value })} />
      <Row>
        <Input label="Heading — before emphasis" value={value.headingPre} onChange={(e) => p({ headingPre: e.target.value })} />
        <Input label="Heading — emphasised part" value={value.headingEm} onChange={(e) => p({ headingEm: e.target.value })} />
      </Row>
      <p className="sc-hint">Filter tab labels (the underlying categories can't be changed here):</p>
      <Row>
        <Input label="'All' tab label" value={value.tabLabels.all} onChange={(e) => p({ tabLabels: { ...value.tabLabels, all: e.target.value } })} />
        <Input label="'Field Staples' tab label" value={value.tabLabels.staples} onChange={(e) => p({ tabLabels: { ...value.tabLabels, staples: e.target.value } })} />
      </Row>
      <Input label="'Home Preserves' tab label" value={value.tabLabels.pantry} onChange={(e) => p({ tabLabels: { ...value.tabLabels, pantry: e.target.value } })} />
    </>
  );
}

function CateringEditor({ value, onChange }: { value: SiteContent['catering']; onChange: (v: SiteContent['catering']) => void }) {
  const p = mkPatch(value, onChange);
  return (
    <>
      <Input label="Section label" value={value.label} onChange={(e) => p({ label: e.target.value })} />
      <p className="sc-hint">Heading: "{value.headingPre}" + line break + "{value.headingPost}<em>{value.headingEm}</em>"</p>
      <Input label="Heading — first line" value={value.headingPre} onChange={(e) => p({ headingPre: e.target.value })} />
      <Row>
        <Input label="Heading — second line, before emphasis" value={value.headingPost} onChange={(e) => p({ headingPost: e.target.value })} />
        <Input label="Heading — emphasised part" value={value.headingEm} onChange={(e) => p({ headingEm: e.target.value })} />
      </Row>
      <Textarea label="Body paragraph" rows={2} value={value.body} onChange={(e) => p({ body: e.target.value })} />
      <RepeaterField
        label="Dishes list"
        value={value.dishes}
        onChange={(dishes) => p({ dishes })}
        newItem={() => ''}
        addLabel="+ Add dish"
        renderRow={(text, setItem) => <StrRow label="" value={text} onChange={setItem} />}
      />
      <Input label="Pricing note" value={value.pricingNote} onChange={(e) => p({ pricingNote: e.target.value })} />
      <RepeaterField
        label="Event type options (enquiry form dropdown)"
        value={value.eventTypes}
        onChange={(eventTypes) => p({ eventTypes })}
        newItem={() => ''}
        addLabel="+ Add event type"
        renderRow={(text, setItem) => <StrRow label="" value={text} onChange={setItem} />}
      />
      <RepeaterField
        label="City options (enquiry form dropdown)"
        value={value.cities}
        onChange={(cities) => p({ cities })}
        newItem={() => ''}
        addLabel="+ Add city"
        renderRow={(text, setItem) => <StrRow label="" value={text} onChange={setItem} />}
      />
    </>
  );
}

function SupperEditor({ value, onChange }: { value: SiteContent['supper']; onChange: (v: SiteContent['supper']) => void }) {
  const p = mkPatch(value, onChange);
  return (
    <>
      <Input label="Eyebrow (small label)" value={value.eyebrow} onChange={(e) => p({ eyebrow: e.target.value })} />
      <Input label="Heading" value={value.heading} onChange={(e) => p({ heading: e.target.value })} />
      <Textarea label="Description" rows={2} value={value.description} onChange={(e) => p({ description: e.target.value })} />
      <RepeaterField
        label="Stat cards"
        value={value.stats}
        onChange={(stats) => p({ stats })}
        newItem={() => ({ value: '', label: '' })}
        addLabel="+ Add stat"
        renderRow={(item, setItem) => (
          <Row>
            <Input label="Value" value={item.value} onChange={(e) => setItem({ ...item, value: e.target.value })} />
            <Input label="Label" value={item.label} onChange={(e) => setItem({ ...item, label: e.target.value })} />
          </Row>
        )}
      />
    </>
  );
}

function HireEditor({ value, onChange }: { value: SiteContent['hire']; onChange: (v: SiteContent['hire']) => void }) {
  const p = mkPatch(value, onChange);
  return (
    <>
      <Input label="Eyebrow (small label)" value={value.eyebrow} onChange={(e) => p({ eyebrow: e.target.value })} />
      <Row>
        <Input label="Heading — before emphasis" value={value.headingPre} onChange={(e) => p({ headingPre: e.target.value })} />
        <Input label="Heading — emphasised part" value={value.headingEm} onChange={(e) => p({ headingEm: e.target.value })} />
      </Row>
      <Textarea label="Description" rows={2} value={value.description} onChange={(e) => p({ description: e.target.value })} />
      <Input label="CTA bar heading" value={value.ctaHeading} onChange={(e) => p({ ctaHeading: e.target.value })} />
      <Input label="CTA bar subtext" value={value.ctaSub} onChange={(e) => p({ ctaSub: e.target.value })} />
      <Input label="CTA button text" value={value.ctaButton} onChange={(e) => p({ ctaButton: e.target.value })} />
    </>
  );
}

function HampersEditor({ value, onChange }: { value: SiteContent['hampers']; onChange: (v: SiteContent['hampers']) => void }) {
  const p = mkPatch(value, onChange);
  return (
    <>
      <Input label="Section label" value={value.label} onChange={(e) => p({ label: e.target.value })} />
      <Input label="Heading" value={value.heading} onChange={(e) => p({ heading: e.target.value })} />
      <Textarea label="Body paragraph" rows={2} value={value.body} onChange={(e) => p({ body: e.target.value })} />
    </>
  );
}

function ContactEditor({ value, onChange }: { value: SiteContent['contact']; onChange: (v: SiteContent['contact']) => void }) {
  const p = mkPatch(value, onChange);
  return (
    <>
      <Input label="Section label" value={value.label} onChange={(e) => p({ label: e.target.value })} />
      <p className="sc-hint">Heading: "{value.headingLine1}" + line break + "{value.headingLine2Pre}<em>{value.headingLine2Em}</em>"</p>
      <Input label="Heading — first line" value={value.headingLine1} onChange={(e) => p({ headingLine1: e.target.value })} />
      <Row>
        <Input label="Heading — second line, before emphasis" value={value.headingLine2Pre} onChange={(e) => p({ headingLine2Pre: e.target.value })} />
        <Input label="Heading — emphasised part" value={value.headingLine2Em} onChange={(e) => p({ headingLine2Em: e.target.value })} />
      </Row>
      <Textarea label="Body paragraph" rows={2} value={value.body} onChange={(e) => p({ body: e.target.value })} />
      <Row>
        <Input label="Email address" value={value.email} onChange={(e) => p({ email: e.target.value })} />
        <Input label="Instagram handle (e.g. @tarweeda)" value={value.instagramHandle} onChange={(e) => p({ instagramHandle: e.target.value })} />
      </Row>
      <Input label="Instagram URL" value={value.instagramUrl} onChange={(e) => p({ instagramUrl: e.target.value })} />
    </>
  );
}

function NavEditor({ value, onChange }: { value: SiteContent['nav']; onChange: (v: SiteContent['nav']) => void }) {
  const p = mkPatch(value, onChange);
  return (
    <>
      <RepeaterField
        label="Navigation links"
        value={value.links}
        onChange={(links) => p({ links })}
        newItem={() => ({ href: '#', label: '' })}
        addLabel="+ Add link"
        renderRow={(item, setItem) => (
          <Row>
            <Input label="Label" value={item.label} onChange={(e) => setItem({ ...item, label: e.target.value })} />
            <Input label="Link (e.g. #shop)" value={item.href} onChange={(e) => setItem({ ...item, href: e.target.value })} />
          </Row>
        )}
      />
      <Input label="Mobile menu — 'Contact' link label" value={value.contactLabel} onChange={(e) => p({ contactLabel: e.target.value })} />
      <ImageUpload label="Logo (optional — leave empty for the default logo)" value={value.logo} onChange={(url) => p({ logo: url })} />
    </>
  );
}

function FooterEditor({ value, onChange }: { value: SiteContent['footer']; onChange: (v: SiteContent['footer']) => void }) {
  const p = mkPatch(value, onChange);
  return (
    <>
      <Input label="Brand name" value={value.brand} onChange={(e) => p({ brand: e.target.value })} />
      <Input label="Tagline" value={value.tagline} onChange={(e) => p({ tagline: e.target.value })} />
      <RepeaterField
        label="Footer links"
        value={value.links}
        onChange={(links) => p({ links })}
        newItem={() => ({ href: '#', label: '' })}
        addLabel="+ Add link"
        renderRow={(item, setItem) => (
          <Row>
            <Input label="Label" value={item.label} onChange={(e) => setItem({ ...item, label: e.target.value })} />
            <Input label="Link (e.g. #shop)" value={item.href} onChange={(e) => setItem({ ...item, href: e.target.value })} />
          </Row>
        )}
      />
    </>
  );
}

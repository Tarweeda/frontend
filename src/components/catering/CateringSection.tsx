import { useState } from 'react';
import { Container } from '../layout/Container';
import { Reveal } from '../ui/Reveal';
import { api } from '../../lib/api';
import { useToastStore } from '../../store/toast';
import { useSection } from '../../hooks/useSiteContent';
import { useProducts } from '../../hooks/useProducts';
import { DatePicker } from '../ui/DatePicker';
import { CustomSelect } from '../ui/CustomSelect';
import type { Product } from '../../types/product';
import './CateringSection.css';

type SetType = 'home' | 'family' | 'own';

const SETS = [
  {
    id: 'home' as SetType,
    name: 'Home Set',
    sub: '5–6 people',
    contents: ['1 Starter', 'Main serve', '1 Side', 'Drink'],
    cta: 'Select →',
  },
  {
    id: 'family' as SetType,
    name: 'Family Set',
    sub: '8–9 people',
    contents: ['3 Starters', 'Main serve', '2 Sides', 'Drink'],
    cta: 'Select →',
  },
  {
    id: 'own' as SetType,
    name: 'Own Set',
    sub: 'Your choice',
    contents: ['Build from the Tarweeda menu'],
    cta: 'Build →',
  },
];

const SET_LABELS: Record<SetType, string> = {
  home: 'Home Set',
  family: 'Family Set',
  own: 'Own Set',
};

export function CateringSection() {
  const c = useSection('catering');
  const { data: products } = useProducts();

  const [selectedSet, setSelectedSet] = useState<SetType | null>(null);
  const [ownItems, setOwnItems] = useState<string[]>([]);
  const [ownConfirmed, setOwnConfirmed] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', event_type: c.eventTypes[0] ?? '',
    guest_count: '', event_date: '', city: c.cities[0] ?? '',
    dietary_notes: '', additional_notes: '',
  });
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const toggleOwnItem = (name: string) =>
    setOwnItems((prev) => prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]);

  const resetSet = () => {
    setSelectedSet(null);
    setOwnItems([]);
    setOwnConfirmed(false);
  };

  const submit = async () => {
    const showToast = useToastStore.getState().showToast;
    if (!form.name || !form.email) { showToast('Please enter your name and email.', 'warning'); return; }
    try {
      await api.post('/catering/enquiries', {
        ...form,
        guest_count: form.guest_count ? parseInt(form.guest_count) : undefined,
        selected_set: selectedSet,
        selected_items: selectedSet === 'own' ? ownItems.join(', ') : undefined,
      });
      setSent(true);
    } catch { useToastStore.getState().showToast('Something went wrong. Please try again.'); }
  };

  const showForm = selectedSet !== null && (selectedSet !== 'own' || ownConfirmed);

  return (
    <section className="catering-section" id="catering">
      <Container>
        <div className="catering-grid">
          <Reveal className="catering-left">
            <span className="label" style={{ color: 'var(--g5)', opacity: 0.8 }}>{c.label}</span>
            <h2>{c.headingPre}<br />{c.headingPost}<em>{c.headingEm}</em></h2>
            <p className="catering-body">{c.body}</p>
            <ul className="catering-dishes">{c.dishes.map((d, i) => <li key={i}>{d}</li>)}</ul>
            <p className="catering-body" style={{ fontSize: '0.78rem', opacity: 0.45 }}>{c.pricingNote}</p>
          </Reveal>

          <Reveal className="catering-form">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}>✦</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--g6)', marginBottom: '0.5rem' }}>Enquiry Sent</h3>
                <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'rgba(200,216,176,0.5)', fontSize: '0.95rem' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                {/* Step 1a — Set cards */}
                {selectedSet === null && (
                  <>
                    <h3>Choose your set</h3>
                    <div className="c-sets">
                      {SETS.map((s) => (
                        <button key={s.id} className="c-set-card" onClick={() => setSelectedSet(s.id)}>
                          <div className="c-set-name">{s.name}</div>
                          <div className="c-set-sub">{s.sub}</div>
                          <ul className="c-set-contents">
                            {s.contents.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                          <div className="c-set-cta">{s.cta}</div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Step 1b — Own Set product picker */}
                {selectedSet === 'own' && !ownConfirmed && (
                  <>
                    <div className="c-set-header">
                      <h3>Build your own set</h3>
                      <button className="c-back-link" onClick={resetSet}>← Change set</button>
                    </div>
                    <p className="c-set-hint">Select the items you'd like included.</p>
                    <div className="c-products-grid">
                      {(products ?? []).map((p: Product) => (
                        <label key={p.id} className={`c-product-item ${ownItems.includes(p.name) ? 'checked' : ''}`}>
                          <input
                            type="checkbox"
                            checked={ownItems.includes(p.name)}
                            onChange={() => toggleOwnItem(p.name)}
                          />
                          <div className="c-product-info">
                            <span className="c-product-name">{p.name}</span>
                            <span className="c-product-tag">{p.tag}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    <button
                      className="c-submit"
                      disabled={ownItems.length === 0}
                      onClick={() => setOwnConfirmed(true)}
                    >
                      Continue →
                    </button>
                  </>
                )}

                {/* Step 2 — Enquiry form */}
                {showForm && (
                  <>
                    <div className="c-set-header">
                      <h3>Enquire — {SET_LABELS[selectedSet!]}</h3>
                      <button className="c-back-link" onClick={resetSet}>← Change set</button>
                    </div>

                    {selectedSet === 'own' && ownItems.length > 0 && (
                      <div className="c-set-summary">
                        {ownItems.join(' · ')}
                      </div>
                    )}

                    <div className="c-row">
                      <div className="c-field"><label className="c-label">Your name</label><input className="c-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full name" /></div>
                      <div className="c-field"><label className="c-label">Email</label><input className="c-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" /></div>
                    </div>
                    <div className="c-row">
                      <div className="c-field"><label className="c-label">Event type</label><CustomSelect className="c-input" value={form.event_type} onChange={(val) => update('event_type', val)} options={c.eventTypes.map((t) => ({ value: t, label: t }))} /></div>
                      <div className="c-field"><label className="c-label">Guests</label><input className="c-input" type="number" value={form.guest_count} onChange={(e) => update('guest_count', e.target.value)} placeholder="e.g. 50" /></div>
                    </div>
                    <div className="c-row">
                      <div className="c-field"><label className="c-label">Date</label><DatePicker className="c-input" value={form.event_date} onChange={(val) => update('event_date', val)} placeholder="Select a date" /></div>
                      <div className="c-field"><label className="c-label">City</label><CustomSelect className="c-input" value={form.city} onChange={(val) => update('city', val)} options={c.cities.map((ct) => ({ value: ct, label: ct }))} /></div>
                    </div>
                    <div className="c-field"><label className="c-label">Dietary needs</label><input className="c-input" value={form.dietary_notes} onChange={(e) => update('dietary_notes', e.target.value)} placeholder="Vegetarian, vegan, allergies…" /></div>
                    <div className="c-field"><label className="c-label">Tell us more</label><textarea className="c-input" rows={3} value={form.additional_notes} onChange={(e) => update('additional_notes', e.target.value)} placeholder="Budget, preferences…" style={{ resize: 'vertical', minHeight: 70 }} /></div>
                    <button className="c-submit" onClick={submit}>Send Enquiry</button>
                  </>
                )}
              </>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

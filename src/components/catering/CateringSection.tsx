import { useState } from 'react';
import { Container } from '../layout/Container';
import { Reveal } from '../ui/Reveal';
import { api } from '../../lib/api';
import { useToastStore } from '../../store/toast';
import { useSection } from '../../hooks/useSiteContent';
import './CateringSection.css';

export function CateringSection() {
  const c = useSection('catering');
  const [form, setForm] = useState({ name: '', email: '', event_type: c.eventTypes[0] ?? '', guest_count: '', event_date: '', city: c.cities[0] ?? '', dietary_notes: '', additional_notes: '' });
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const submit = async () => {
    const showToast = useToastStore.getState().showToast;
    if (!form.name || !form.email) { showToast('Please enter your name and email.', 'warning'); return; }
    try {
      await api.post('/catering/enquiries', { ...form, guest_count: form.guest_count ? parseInt(form.guest_count) : undefined });
      setSent(true);
    } catch { showToast('Something went wrong. Please try again.'); }
  };

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
                <h3>Enquire about catering</h3>
                <div className="c-row">
                  <div className="c-field"><label className="c-label">Your name</label><input className="c-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full name" /></div>
                  <div className="c-field"><label className="c-label">Email</label><input className="c-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" /></div>
                </div>
                <div className="c-row">
                  <div className="c-field"><label className="c-label">Event type</label><select className="c-input" value={form.event_type} onChange={(e) => update('event_type', e.target.value)}>{c.eventTypes.map((t) => <option key={t}>{t}</option>)}</select></div>
                  <div className="c-field"><label className="c-label">Guests</label><input className="c-input" type="number" value={form.guest_count} onChange={(e) => update('guest_count', e.target.value)} placeholder="e.g. 50" /></div>
                </div>
                <div className="c-row">
                  <div className="c-field"><label className="c-label">Date</label><input className="c-input" type="date" value={form.event_date} onChange={(e) => update('event_date', e.target.value)} /></div>
                  <div className="c-field"><label className="c-label">City</label><select className="c-input" value={form.city} onChange={(e) => update('city', e.target.value)}>{c.cities.map((ct) => <option key={ct}>{ct}</option>)}</select></div>
                </div>
                <div className="c-field"><label className="c-label">Dietary needs</label><input className="c-input" value={form.dietary_notes} onChange={(e) => update('dietary_notes', e.target.value)} placeholder="Vegetarian, vegan, allergies…" /></div>
                <div className="c-field"><label className="c-label">Tell us more</label><textarea className="c-input" rows={3} value={form.additional_notes} onChange={(e) => update('additional_notes', e.target.value)} placeholder="Budget, preferences…" style={{ resize: 'vertical', minHeight: 70 }} /></div>
                <button className="c-submit" onClick={submit}>Send Enquiry</button>
              </>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

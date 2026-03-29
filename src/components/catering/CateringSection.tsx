import { useState } from 'react';
import { Container } from '../layout/Container';
import { Reveal } from '../ui/Reveal';
import { api } from '../../lib/api';
import './CateringSection.css';

const DISHES = ['Maqluba', 'Musakhan', 'Maftoul', 'Fatteh Ghazawiyeh', 'Fatteh Hummus', 'Dawali', 'Fatayer (handmade, custom fillings)', 'Mezze, sides, desserts & drinks'];

export function CateringSection() {
  const [form, setForm] = useState({ name: '', email: '', event_type: 'Family gathering', guest_count: '', event_date: '', city: 'London', dietary_notes: '', additional_notes: '' });
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const submit = async () => {
    if (!form.name || !form.email) { alert('Please enter your name and email.'); return; }
    try {
      await api.post('/catering/enquiries', { ...form, guest_count: form.guest_count ? parseInt(form.guest_count) : undefined });
      setSent(true);
    } catch { alert('Something went wrong. Please try again.'); }
  };

  return (
    <section className="catering-section" id="catering">
      <Container>
        <div className="catering-grid">
          <Reveal className="catering-left">
            <span className="label" style={{ color: 'var(--olive-pale)', opacity: 0.6 }}>Catering & Gatherings</span>
            <h2>Tell us about<br />your <em>gathering</em></h2>
            <p className="catering-body">Full catering for gatherings of 10 to 200+. We bring the feast to you — communal, generous, and deeply Palestinian.</p>
            <ul className="catering-dishes">{DISHES.map((d) => <li key={d}>{d}</li>)}</ul>
            <p className="catering-body" style={{ fontSize: '0.78rem', opacity: 0.45 }}>From £28 per person. We'll confirm your quote within 24 hours.</p>
          </Reveal>

          <Reveal className="catering-form">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}>✦</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--cream)', marginBottom: '0.5rem' }}>Enquiry Sent</h3>
                <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'rgba(245,240,232,0.5)', fontSize: '0.95rem' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h3>Enquire about catering</h3>
                <div className="c-row">
                  <div className="c-field"><label className="c-label">Your name</label><input className="c-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full name" /></div>
                  <div className="c-field"><label className="c-label">Email</label><input className="c-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" /></div>
                </div>
                <div className="c-row">
                  <div className="c-field"><label className="c-label">Event type</label><select className="c-input" value={form.event_type} onChange={(e) => update('event_type', e.target.value)}><option>Family gathering</option><option>Corporate event</option><option>Wedding</option><option>Community event</option><option>Other</option></select></div>
                  <div className="c-field"><label className="c-label">Guests</label><input className="c-input" type="number" value={form.guest_count} onChange={(e) => update('guest_count', e.target.value)} placeholder="e.g. 50" /></div>
                </div>
                <div className="c-row">
                  <div className="c-field"><label className="c-label">Date</label><input className="c-input" type="date" value={form.event_date} onChange={(e) => update('event_date', e.target.value)} /></div>
                  <div className="c-field"><label className="c-label">City</label><select className="c-input" value={form.city} onChange={(e) => update('city', e.target.value)}><option>London</option><option>Rabat</option></select></div>
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

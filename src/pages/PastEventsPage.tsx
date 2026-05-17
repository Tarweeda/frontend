import { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Reveal } from '../components/ui/Reveal';
import { Spinner } from '../components/ui/Spinner';
import { useEvents } from '../hooks/useEvents';
import type { SupperEvent } from '../types/event';
import './PastEventsPage.css';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }).toUpperCase();
}

export function PastEventsPage() {
  const { data: events, isLoading } = useEvents();
  const past = (events ?? [])
    .filter((e) => e.status === 'past')
    .sort((a, b) => b.event_date.localeCompare(a.event_date));

  return (
    <div className="pe-page">
      <section className="pe-hero">
        <Container>
          <Reveal>
            <span className="eyebrow" style={{ color: 'var(--g5)' }}>Tarweeda Supper Club</span>
            <h1 className="pe-title">Past Evenings</h1>
            <p className="pe-subtitle">A record of the tables we've shared.</p>
          </Reveal>
        </Container>
      </section>

      <section className="pe-list">
        <Container>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <Spinner />
            </div>
          ) : past.length === 0 ? (
            <div className="pe-empty">
              <p>No past events yet — stay tuned for upcoming gatherings.</p>
            </div>
          ) : (
            past.map((ev, i) => (
              <Reveal key={ev.id}>
                <EventRow event={ev} />
                {i < past.length - 1 && <div className="pe-divider" />}
              </Reveal>
            ))
          )}
        </Container>
      </section>
    </div>
  );
}

function EventRow({ event: ev }: { event: SupperEvent }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="pe-event">
      {/* Cover image dome */}
      <div className="pe-cover-wrap">
        {ev.cover_image_path ? (
          <img src={ev.cover_image_path} alt={ev.name} className="pe-cover-img" />
        ) : (
          <div className="pe-cover-placeholder" />
        )}
        <div className="pe-cover-overlay" />
        <div className="pe-cover-text">
          <div className="pe-cover-meta">{formatDate(ev.event_date)} · {ev.location.toUpperCase()}</div>
          <h2 className="pe-cover-name">{ev.name}</h2>
        </div>
      </div>

      {/* Content below image */}
      <div className="pe-content">
        <div className="pe-theme-badge">{ev.theme}</div>

        {ev.recap && <p className="pe-recap">{ev.recap}</p>}

        <button className="pe-menu-toggle" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? 'Hide menu ↑' : 'View menu ↓'}
        </button>

        {menuOpen && (
          <div className="pe-courses">
            {ev.menu.map((c, i) => (
              <div key={i} className="pe-course">
                <div className="pe-course-num">0{i + 1}</div>
                <div className="pe-course-body">
                  <div className="pe-course-label">{c.course}</div>
                  <div className="pe-course-dish">{c.dish}</div>
                  {c.note && <div className="pe-course-note">{c.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

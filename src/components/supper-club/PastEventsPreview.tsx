import { Link } from 'react-router-dom';
import { Container } from '../layout/Container';
import { Reveal } from '../ui/Reveal';
import { useEvents } from '../../hooks/useEvents';
import type { SupperEvent } from '../../types/event';
import './PastEventsPreview.css';

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export function PastEventsPreview() {
  const { data: events } = useEvents();
  const past = events?.filter((e) => e.status === 'past').slice(0, 2) ?? [];

  if (past.length === 0) return null;

  return (
    <section className="prev-section">
      <Container>
        <Reveal className="prev-head">
          <span className="eyebrow" style={{ color: 'var(--g5)' }}>Past Gatherings</span>
          <h2>Previous Evenings</h2>
        </Reveal>
        <Reveal>
          <div className="prev-grid">
            {past.map((ev) => <PastCard key={ev.id} event={ev} />)}
          </div>
          <div className="prev-footer">
            <Link to="/past-events" className="prev-all-link">View all evenings →</Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function PastCard({ event: ev }: { event: SupperEvent }) {
  return (
    <Link to="/past-events" className="prev-card">
      <div className="prev-img-wrap">
        {ev.cover_image_path ? (
          <img src={ev.cover_image_path} alt={ev.name} className="prev-img" />
        ) : (
          <div className="prev-img-placeholder" />
        )}
        <div className="prev-img-overlay" />
        <div className="prev-img-name">{ev.name}</div>
      </div>
      <div className="prev-card-body">
        <span className="prev-date">{formatEventDate(ev.event_date)}</span>
        <span className="prev-dot">·</span>
        <span className="prev-location">{ev.location}</span>
      </div>
    </Link>
  );
}
